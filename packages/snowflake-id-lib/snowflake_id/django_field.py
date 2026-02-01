from __future__ import annotations

from django.db import models

from .generator import SnowflakeGenerator
from .worker import EnvWorkerIdProvider


class DjangoSnowflakeIDField(models.BigIntegerField):
    """Django primary key field using SnowflakeGenerator.

    Usage:
        generator = SnowflakeGenerator(worker_id_provider=EnvWorkerIdProvider("WORKER_ID"))

        class Event(models.Model):
            id = DjangoSnowflakeIDField(generator=generator)
            ...
    """

    description = "Snowflake ID (int64)"

    def __init__(self, *args, generator: SnowflakeGenerator | None = None, **kwargs):
        kwargs.setdefault("primary_key", True)
        kwargs.setdefault("editable", False)

        # Default generator: WORKER_ID env var required (fail-fast)
        self.generator = generator or SnowflakeGenerator(worker_id_provider=EnvWorkerIdProvider())

        # Callable default so Django calls it per row
        kwargs.setdefault("default", self.generator.generate)
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        # Don't serialize generator instance into migrations; recreate from env at runtime.
        kwargs.pop("generator", None)
        return name, path, args, kwargs
