from celery import shared_task

from .services import refresh_rankings


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
    name="rankings.refresh_rankings",
)
def refresh_rankings_task(self):
    return refresh_rankings()
