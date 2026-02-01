"""Snowflake ID generator (64-bit) with robust clock handling.

Public API:
  - SnowflakeGenerator
  - WorkerIdProvider
  - EnvWorkerIdProvider
  - StaticWorkerIdProvider
  - HashWorkerIdProvider
  - DjangoSnowflakeIDField (optional; requires Django)
"""

from .generator import SnowflakeGenerator
from .worker import (
    WorkerIdProvider,
    EnvWorkerIdProvider,
    StaticWorkerIdProvider,
    HashWorkerIdProvider,
)

__all__ = [
    "SnowflakeGenerator",
    "WorkerIdProvider",
    "EnvWorkerIdProvider",
    "StaticWorkerIdProvider",
    "HashWorkerIdProvider",
]

try:
    from .django_field import DjangoSnowflakeIDField  # noqa: F401
    __all__.append("DjangoSnowflakeIDField")
except Exception:
    # Django not installed; field remains unavailable.
    pass
