from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.shortcuts import get_object_or_404
from .models import Event, Participation
from .serializers import EventSerializer, ParticipationSerializer

from .services import EventService


class IsEventCreatorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user and request.user.is_authenticated:
            return request.user.is_superuser or obj.created_by_id == request.user.id
        return False

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('date')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsEventCreatorOrReadOnly]

    def perform_create(self, serializer):
        event = EventService.create_event(self.request.user, serializer.validated_data)
        serializer.instance = event

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        event = self.get_object()
        try:
            EventService.join_event(request.user, event)
            return Response({"detail": "Successfully joined the event."}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def leave(self, request, pk=None):
        event = self.get_object()
        target_user_id = request.data.get("user_id")

        if target_user_id is not None:
            try:
                target_user_id = int(target_user_id)
            except (TypeError, ValueError):
                return Response({"detail": "Invalid user_id."}, status=status.HTTP_400_BAD_REQUEST)

            if target_user_id != request.user.id:
                if not (request.user.is_superuser or event.created_by_id == request.user.id):
                    return Response({"detail": "You do not have permission to remove this participant."}, status=status.HTTP_403_FORBIDDEN)

            participation = Participation.objects.filter(event=event, user_id=target_user_id).first()
            if not participation:
                return Response({"detail": "Participation not found."}, status=status.HTTP_404_NOT_FOUND)

            participation.delete()
            return Response({"detail": "Successfully left the event."}, status=status.HTTP_204_NO_CONTENT)

        try:
            EventService.leave_event(request.user, event)
            return Response({"detail": "Successfully left the event."}, status=status.HTTP_204_NO_CONTENT)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
