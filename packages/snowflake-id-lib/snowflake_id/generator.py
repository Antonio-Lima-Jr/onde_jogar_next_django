from __future__ import annotations

import threading
import time
from dataclasses import dataclass
from typing import Callable, Literal, Optional

from .worker import WorkerIdProvider, StaticWorkerIdProvider


ClockRollbackStrategy = Literal["raise", "wait"]


@dataclass(frozen=True)
class SnowflakeLayout:
    """Bit layout for a 64-bit snowflake id.

    Default matches the classic "Twitter-style":
      - 41 bits timestamp (ms since epoch)
      - 10 bits worker_id
      - 12 bits sequence

    The sum must be 63 bits so the resulting integer stays positive in signed int64.
    """

    timestamp_bits: int = 41
    worker_id_bits: int = 10
    sequence_bits: int = 12

    def validate(self) -> None:
        total = self.timestamp_bits + self.worker_id_bits + self.sequence_bits
        if total != 63:
            raise ValueError(f"Layout must sum to 63 bits (positive int64), got {total}.")
        if self.timestamp_bits <= 0 or self.worker_id_bits <= 0 or self.sequence_bits <= 0:
            raise ValueError("All bit sizes must be positive integers.")

    @property
    def max_worker_id(self) -> int:
        return (1 << self.worker_id_bits) - 1

    @property
    def max_sequence(self) -> int:
        return (1 << self.sequence_bits) - 1

    @property
    def worker_shift(self) -> int:
        return self.sequence_bits

    @property
    def timestamp_shift(self) -> int:
        return self.sequence_bits + self.worker_id_bits


class SnowflakeGenerator:
    """Thread-safe Snowflake ID generator.

    Properties:
      - IDs sortable by generation time (roughly monotonic)
      - Unique per (timestamp, worker_id, sequence)
      - sequence resets when timestamp changes; reset across process restarts is normal

    Notes:
      - Process-local only. In multi-process deployments each process MUST have a
        distinct worker_id (or you risk collisions).
      - If system clock moves backwards, behavior depends on rollback_strategy.
    """

    def __init__(
        self,
        worker_id: Optional[int] = None,
        *,
        worker_id_provider: Optional[WorkerIdProvider] = None,
        epoch_ms: int = 1704067200000,  # 2024-01-01T00:00:00Z
        layout: SnowflakeLayout = SnowflakeLayout(),
        now_ms: Callable[[], int] = lambda: int(time.time() * 1000),
        rollback_strategy: ClockRollbackStrategy = "raise",
    ) -> None:
        layout.validate()
        self.layout = layout
        self.epoch_ms = int(epoch_ms)
        self.now_ms = now_ms
        self.rollback_strategy = rollback_strategy

        if worker_id is not None and worker_id_provider is not None:
            raise ValueError("Provide either worker_id or worker_id_provider, not both.")

        if worker_id_provider is None:
            worker_id_provider = StaticWorkerIdProvider(worker_id if worker_id is not None else 0)

        self.worker_id = int(worker_id_provider.get(self.layout.max_worker_id))

        self._lock = threading.Lock()
        self._last_ts = -1
        self._sequence = 0

    def _wait_next_ms(self, last_ts: int) -> int:
        ts = self.now_ms()
        while ts <= last_ts:
            ts = self.now_ms()
        return ts

    def generate(self) -> int:
        """Generate a new positive int64 snowflake id."""
        with self._lock:
            ts = self.now_ms()

            if ts < self._last_ts:
                if self.rollback_strategy == "raise":
                    raise RuntimeError(f"Clock moved backwards (ms): now={ts} < last={self._last_ts}")
                ts = self._wait_next_ms(self._last_ts)

            if ts == self._last_ts:
                self._sequence = (self._sequence + 1) & self.layout.max_sequence
                if self._sequence == 0:
                    ts = self._wait_next_ms(self._last_ts)
            else:
                self._sequence = 0

            self._last_ts = ts

            t = ts - self.epoch_ms
            if t < 0:
                raise RuntimeError(f"Timestamp earlier than epoch: ts={ts}, epoch={self.epoch_ms}")
            if t >= (1 << self.layout.timestamp_bits):
                raise OverflowError(f"Timestamp overflow for layout ({self.layout.timestamp_bits} bits).")

            return (
                (t << self.layout.timestamp_shift)
                | (self.worker_id << self.layout.worker_shift)
                | self._sequence
            )

    def decompose(self, snowflake_id: int) -> dict:
        """Decompose an ID back into parts for debugging/inspection."""
        sf = int(snowflake_id)
        seq = sf & self.layout.max_sequence
        worker = (sf >> self.layout.worker_shift) & self.layout.max_worker_id
        t = sf >> self.layout.timestamp_shift
        ts = t + self.epoch_ms
        return {"timestamp_ms": ts, "worker_id": worker, "sequence": seq}
