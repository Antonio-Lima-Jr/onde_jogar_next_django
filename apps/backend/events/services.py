from __future__ import annotations

from typing import Any, Mapping, MutableMapping, Tuple

from django.contrib.gis.geos import Point
from django.db import transaction
from rest_framework import serializers

from .models import Event, Participation


class LocationService:
    """
    Encapsulates all geolocation rules so views and serializers stay thin.
    The backend is the source of truth for SRID and coordinate validation.
    """

    SRID = 4326

    @staticmethod
    def normalize_city(city: Any) -> str:
        if city is None:
            return ""
        if not isinstance(city, str):
            city = str(city)
        return city.strip()

    @staticmethod
    def _validate_latitude(lat: float) -> None:
        if not (-90 <= lat <= 90):
            raise serializers.ValidationError(
                {"latitude": "Latitude must be between -90 and 90."}
            )

    @staticmethod
    def _validate_longitude(lng: float) -> None:
        if not (-180 <= lng <= 180):
            raise serializers.ValidationError(
                {"longitude": "Longitude must be between -180 and 180."}
            )

    @classmethod
    def build_point(cls, lat: float, lng: float) -> Point:
        cls._validate_latitude(lat)
        cls._validate_longitude(lng)
        # PostGIS expects (x, y) == (longitude, latitude)
        return Point(lng, lat, srid=cls.SRID)

    @classmethod
    def coerce_point(
        cls,
        *,
        initial_data: Mapping[str, Any],
        attrs: MutableMapping[str, Any],
        require_coordinates: bool,
    ) -> Tuple[Point | None, bool]:
        """
        Extract latitude/longitude from serializer attrs, validate them and
        return a PostGIS Point. Returns (point, has_coordinates_input).
        """
        if "location" in initial_data:
            raise serializers.ValidationError(
                {"location": "Send latitude/longitude instead of location."}
            )

        has_lat = "latitude" in initial_data
        has_lng = "longitude" in initial_data
        has_coords_input = has_lat or has_lng

        if require_coordinates and not (has_lat and has_lng):
            raise serializers.ValidationError(
                {
                    "latitude": "This field is required.",
                    "longitude": "This field is required.",
                }
            )

        if not has_coords_input:
            return None, False

        lat = attrs.pop("latitude", None)
        lng = attrs.pop("longitude", None)

        if lat is None or lng is None:
            raise serializers.ValidationError(
                {"detail": "Both latitude and longitude are required."}
            )

        try:
            lat_value = float(lat)
            lng_value = float(lng)
        except (TypeError, ValueError):
            raise serializers.ValidationError(
                {"detail": "Latitude and longitude must be valid numbers."}
            )

        return cls.build_point(lat_value, lng_value), True

    @staticmethod
    def point_to_lat_lng(point: Point | None) -> tuple[float | None, float | None]:
        if not point:
            return None, None
        return point.y, point.x

class EventService:
    @staticmethod
    @transaction.atomic
    def create_event(user, data):
        data["city"] = LocationService.normalize_city(data.get("city"))
        return Event.objects.create(created_by=user, **data)

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
