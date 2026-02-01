# Django + Celery + RabbitMQ — Implementation Spec (Codex-Friendly)

## Objective

Add asynchronous processing to a Django backend using:

- Celery (workers)
- RabbitMQ (message broker)
- django-celery-beat (scheduler)
- django-celery-results (result backend)
- Docker Compose (local & production)

This spec is **explicitly structured to avoid ambiguity for AI tools like Codex**.

---

## Folder Structure (Do Not Deviate)

```text
backend/
├── config/
│   ├── __init__.py
│   ├── celery.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   ├── events/
│   │   ├── tasks.py
│   │   ├── services.py
│   │   ├── models.py
│   │   └── apps.py
│   │
│   ├── notifications/
│   │   ├── tasks.py
│   │   └── services.py
│   │
│   └── rankings/
│       ├── tasks.py
│       └── services.py
│
├── manage.py
└── requirements.txt
```

**Rules**
- `tasks.py` contains Celery tasks only
- `services.py` contains business logic only
- `services.py` MUST NOT import Celery
- `tasks.py` MUST be thin wrappers

---

## Dependencies (`requirements.txt`)

```txt
celery>=5.3
django-celery-beat>=2.5
django-celery-results>=2.5
kombu>=5.3
```

---

## Celery Configuration

### `config/celery.py`

```python
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("backend")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

### `config/__init__.py`

```python
from .celery import app as celery_app

__all__ = ("celery_app",)
```

---

## Django Settings (RabbitMQ)

```python
INSTALLED_APPS += [
    "django_celery_beat",
    "django_celery_results",
]

CELERY_BROKER_URL = "amqp://guest:guest@rabbitmq:5672//"
CELERY_RESULT_BACKEND = "django-db"

CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"

CELERY_TIMEZONE = "America/Sao_Paulo"
CELERY_ENABLE_UTC = True

CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
```

Run migrations:

```bash
python manage.py migrate django_celery_results
python manage.py migrate django_celery_beat
```

---

## Task Convention (Mandatory)

### `apps/events/tasks.py`

```python
from celery import shared_task
from .services import generate_event_ranking

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
    name="events.generate_event_ranking",
)
def generate_event_ranking_task(self, event_id: int):
    return generate_event_ranking(event_id)
```

---

## Queues and Routing

```python
from kombu import Queue

CELERY_TASK_QUEUES = (
    Queue("events"),
    Queue("notifications"),
    Queue("rankings"),
)

CELERY_TASK_ROUTES = {
    "events.*": {"queue": "events"},
    "notifications.*": {"queue": "notifications"},
    "rankings.*": {"queue": "rankings"},
}
```

---

## Docker Compose

```yaml
version: "3.9"

services:
  backend:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    depends_on:
      - rabbitmq
    env_file:
      - .env

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest

  celery-worker:
    build: .
    command: celery -A config worker -l info
    depends_on:
      - backend
      - rabbitmq
    volumes:
      - .:/app
    env_file:
      - .env

  celery-beat:
    build: .
    command: celery -A config beat -l info
    depends_on:
      - backend
      - rabbitmq
    volumes:
      - .:/app
    env_file:
      - .env
```

---

## Codex Guardrails

- Never create tasks outside `apps/*/tasks.py`
- Never put logic inside Celery tasks
- Always name tasks explicitly (`domain.action`)
- Never import Celery inside `services.py`
- Never hardcode schedules (use django-celery-beat)

---

## Future Evolution (No Refactor Needed)

- Dedicated workers per queue
- Flower monitoring
- RabbitMQ cluster
- DLQ strategies
- Event-driven migration if Kafka is introduced later

---

## Final Recommendation

This setup is:
- Production-safe
- MVP-friendly
- AI-assisted development ready
- Scalable without architectural debt
