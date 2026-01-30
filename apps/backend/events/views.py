from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.exceptions import ValidationError
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.db.models import Count
from .models import Event, Participation, EventCategory
from .serializers import EventSerializer, EventCategorySerializer

from .services import EventService, LocationService
from .filters import EventFilter


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
    filterset_class = EventFilter
    search_fields = ['title', 'description', 'category__name']
    ordering_fields = ['date', 'created_at']
    ordering = ['date']

    def get_queryset(self):
        queryset = Event.objects.all().select_related('category', 'created_by')
        queryset = queryset.annotate(participants_count=Count('participations', distinct=True))

        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius_km = self.request.query_params.get('radius_km')

        if (lat is not None) ^ (lng is not None):
            raise ValidationError({"detail": "Both lat and lng are required for distance filtering."})

        if lat is not None and lng is not None:
            try:
                lat_value = float(lat)
                lng_value = float(lng)
            except (TypeError, ValueError):
                raise ValidationError({"detail": "lat and lng must be valid numbers."})

            point = LocationService.build_point(lat_value, lng_value)
            queryset = queryset.annotate(distance=Distance('location', point))

            if radius_km:
                try:
                    radius_value = float(radius_km)
                except (TypeError, ValueError):
                    raise ValidationError({"detail": "radius_km must be a valid number."})
                if radius_value <= 0:
                    raise ValidationError({"detail": "radius_km must be greater than 0."})
                queryset = queryset.filter(location__distance_lte=(point, D(km=radius_value)))

        ordering = self.request.query_params.get('ordering')
        if ordering:
            if ordering == 'popular':
                queryset = queryset.order_by('-participants_count', 'date')
            elif ordering == 'soonest':
                queryset = queryset.order_by('date')
            elif ordering == 'newest':
                queryset = queryset.order_by('-created_at')
            elif ordering == 'distance':
                if lat is None or lng is None:
                    raise ValidationError({"detail": "lat and lng are required to order by distance."})
                queryset = queryset.order_by('distance', 'date')
            elif ordering in {'date', '-date', 'created_at', '-created_at'}:
                queryset = queryset.order_by(ordering)
            else:
                raise ValidationError({"detail": "Invalid ordering value."})
        else:
            queryset = queryset.order_by('date')

        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

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


class EventCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventCategory.objects.filter(is_active=True).order_by("name")
    serializer_class = EventCategorySerializer
    permission_classes = [permissions.AllowAny]
