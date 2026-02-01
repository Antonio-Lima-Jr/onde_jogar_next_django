from __future__ import annotations

import os
import socket
import hashlib
from dataclasses import dataclass
from typing import Protocol


class WorkerIdProvider(Protocol):
    """Provide a stable worker_id in [0, max_worker_id]."""

    def get(self, max_worker_id: int) -> int: ...


@dataclass(frozen=True)
class StaticWorkerIdProvider:
    worker_id: int

    def get(self, max_worker_id: int) -> int:
        if not (0 <= self.worker_id <= max_worker_id):
            raise ValueError(f"worker_id out of range 0..{max_worker_id}: {self.worker_id}")
        return self.worker_id


@dataclass(frozen=True)
class EnvWorkerIdProvider:
    """Reads worker_id from an environment variable (default: WORKER_ID)."""

    env_var: str = "WORKER_ID"

    def get(self, max_worker_id: int) -> int:
        val = os.getenv(self.env_var)
        if val is None:
            raise RuntimeError(f"{self.env_var} is not set")
        try:
            wid = int(val)
        except ValueError as e:
            raise RuntimeError(f"{self.env_var} must be an int, got: {val!r}") from e
        if not (0 <= wid <= max_worker_id):
            raise RuntimeError(f"{self.env_var} out of range 0..{max_worker_id}: {wid}")
        return wid


@dataclass(frozen=True)
class HashWorkerIdProvider:
    """Derives worker_id by hashing host + optional salt.

    Use this only if you accept a small collision risk across hosts/processes.
    For strict guarantees in multi-instance deployments, set WORKER_ID explicitly.
    """

    salt: str = ""

    def get(self, max_worker_id: int) -> int:
        host = socket.gethostname()
        raw = (host + "|" + self.salt).encode("utf-8")
        h = hashlib.blake2b(raw, digest_size=8).digest()
        n = int.from_bytes(h, "big", signed=False)
        return n % (max_worker_id + 1)
