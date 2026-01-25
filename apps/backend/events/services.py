from django.db import transaction
from .models import Event, Participation

class EventService:
    @staticmethod
    @transaction.atomic
    def create_event(user, data):
        event = Event.objects.create(
            created_by=user,
            **data
        )
        return event

    @staticmethod
    @transaction.atomic
    def join_event(user, event):
        if Participation.objects.filter(user=user, event=event).exists():
            raise ValueError("You have already joined this event.")

        if event.participations.count() >= event.slots:
            raise ValueError("Event is full.")

        return Participation.objects.create(user=user, event=event)

    @staticmethod
    @transaction.atomic
    def leave_event(user, event):
        participation = Participation.objects.filter(user=user, event=event).first()
        if not participation:
            raise ValueError("You are not a participant of this event.")

        participation.delete()
        return True
