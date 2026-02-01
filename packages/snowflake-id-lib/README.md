# snowflake-id

Reusable Snowflake ID generator (positive int64) with robust clock handling.

## Install (editable for local dev)

```bash
pip install -e .[test]
```

## Quick start

```python
from snowflake_id import SnowflakeGenerator
from snowflake_id.worker import EnvWorkerIdProvider

gen = SnowflakeGenerator(worker_id_provider=EnvWorkerIdProvider("WORKER_ID"))
new_id = gen.generate()
print(new_id, gen.decompose(new_id))
```

Set worker id:

```bash
export WORKER_ID=1
```

## Django field (optional)

```bash
pip install -e .[django]
export WORKER_ID=1
```

```python
from django.db import models
from snowflake_id import SnowflakeGenerator
from snowflake_id.django_field import DjangoSnowflakeIDField
from snowflake_id.worker import EnvWorkerIdProvider

generator = SnowflakeGenerator(worker_id_provider=EnvWorkerIdProvider("WORKER_ID"))

class Event(models.Model):
    id = DjangoSnowflakeIDField(generator=generator)
    name = models.CharField(max_length=255)
```

## Operational notes

- `sequence` resets to 0 when the millisecond changes — and also across process restarts. This is normal.
- Uniqueness depends on each process/instance using a distinct `worker_id`.
- If the system clock moves backwards:
  - default behavior is `rollback_strategy="raise"` (fail fast)
  - alternative is `rollback_strategy="wait"` to block until clock catches up

## Run tests

```bash
pytest -q
```
