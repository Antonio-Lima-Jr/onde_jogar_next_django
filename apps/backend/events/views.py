from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Event, Participation
from .serializers import EventSerializer, ParticipationSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        event = self.get_object()
        user = request.user

        if Participation.objects.filter(user=user, event=event).exists():
            return Response({"detail": "You have already joined this event."}, status=status.HTTP_400_BAD_REQUEST)

        if event.participations.count() >= event.slots:
            return Response({"detail": "Event is full."}, status=status.HTTP_400_BAD_REQUEST)

        Participation.objects.create(user=user, event=event)
        return Response({"detail": "Successfully joined the event."}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        event = self.get_object()
        user = request.user

        participation = Participation.objects.filter(user=user, event=event).first()
        if not participation:
            return Response({"detail": "You are not a participant of this event."}, status=status.HTTP_400_BAD_REQUEST)

        participation.delete()
        return Response({"detail": "Successfully left the event."}, status=status.HTTP_204_NO_CONTENT)
