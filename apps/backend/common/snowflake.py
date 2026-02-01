import os

from snowflake_id import SnowflakeGenerator
from snowflake_id.worker import EnvWorkerIdProvider, HashWorkerIdProvider


def _build_worker_id_provider():
    # Prefer explicit WORKER_ID when set; otherwise fall back to a hash-based id
    # to keep local/dev commands working without extra env setup.
    if os.getenv("WORKER_ID") is None:
        return HashWorkerIdProvider()
    return EnvWorkerIdProvider()


SNOWFLAKE_GENERATOR = SnowflakeGenerator(worker_id_provider=_build_worker_id_provider())
