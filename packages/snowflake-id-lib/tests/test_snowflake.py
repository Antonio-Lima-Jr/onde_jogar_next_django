import threading
import pytest

from snowflake_id.generator import SnowflakeGenerator, SnowflakeLayout
from snowflake_id.worker import StaticWorkerIdProvider


def test_monotonic_non_decreasing():
    t = {"v": 1704067200000}

    def now():
        t["v"] += 1
        return t["v"]

    gen = SnowflakeGenerator(worker_id_provider=StaticWorkerIdProvider(1), now_ms=now)
    ids = [gen.generate() for _ in range(1000)]
    assert ids == sorted(ids)


def test_same_ms_sequence_increments():
    t = {"v": 1704067200000}

    def now():
        return t["v"]

    gen = SnowflakeGenerator(worker_id_provider=StaticWorkerIdProvider(1), now_ms=now)
    a = gen.generate()
    b = gen.generate()
    da = gen.decompose(a)
    db = gen.decompose(b)
    assert da["timestamp_ms"] == db["timestamp_ms"]
    assert da["worker_id"] == db["worker_id"] == 1
    assert db["sequence"] == da["sequence"] + 1


def test_sequence_overflow_waits_next_ms():
    # Use tiny sequence bits to force overflow quickly (max seq=3)
    layout = SnowflakeLayout(timestamp_bits=41, worker_id_bits=10, sequence_bits=2)
    t = {"v": 1704067200000}

    def now():
        return t["v"]

    gen = SnowflakeGenerator(
        worker_id_provider=StaticWorkerIdProvider(1),
        now_ms=now,
        layout=layout,
        rollback_strategy="wait",
    )

    _ = [gen.generate() for _ in range(4)]  # seq 0..3 in same ms

    # Next generate should wait for next ms; simulate clock tick after overflow
    def bump():
        t["v"] += 1
        return t["v"]

    gen.now_ms = bump
    x = gen.generate()
    d = gen.decompose(x)
    assert d["timestamp_ms"] == 1704067200001


def test_clock_rollback_raise():
    t = {"v": 1704067200002}

    def now():
        return t["v"]

    gen = SnowflakeGenerator(worker_id_provider=StaticWorkerIdProvider(1), now_ms=now, rollback_strategy="raise")
    _ = gen.generate()
    t["v"] = 1704067200001  # rollback
    with pytest.raises(RuntimeError):
        gen.generate()


def test_thread_safety_uniqueness():
    # constant clock, rely on sequence; plenty of bits so no overflow here
    t = {"v": 1704067200000}

    def now():
        return t["v"]

    gen = SnowflakeGenerator(worker_id_provider=StaticWorkerIdProvider(1), now_ms=now)

    out = []
    out_lock = threading.Lock()

    def worker(n):
        local = [gen.generate() for _ in range(n)]
        with out_lock:
            out.extend(local)

    threads = [threading.Thread(target=worker, args=(2000,)) for _ in range(4)]
    for th in threads:
        th.start()
    for th in threads:
        th.join()

    assert len(out) == 8000
    assert len(set(out)) == 8000
