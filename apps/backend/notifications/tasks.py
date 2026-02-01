from celery import shared_task

from .services import dispatch_event_notification


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
    name="notifications.dispatch_event_notification",
)
def dispatch_event_notification_task(self, event_id: int):
    return dispatch_event_notification(event_id)
