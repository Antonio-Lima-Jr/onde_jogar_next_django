from celery import shared_task

from .services import generate_event_ranking


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
    name="events.generate_event_ranking",
)
def generate_event_ranking_task(self, event_id: int):
    print(f"Generating event ranking for event_id: {event_id}")
    return generate_event_ranking(event_id)


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
    name="events.heal_check",
)
def heal_check(self):
    print("Heal check executed - will retry")
    raise Exception("Forçando retry")
