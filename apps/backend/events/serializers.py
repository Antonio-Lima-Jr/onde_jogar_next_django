from rest_framework import serializers
from .models import Event, Participation
from users.serializers import UserSafeSerializer
from django.contrib.gis.geos import Point

class ParticipationSerializer(serializers.ModelSerializer):
    user = UserSafeSerializer(read_only=True)
    
    class Meta:
        model = Participation
        fields = ('id', 'user', 'event', 'joined_at')
        read_only_fields = ('joined_at',)

class EventSerializer(serializers.ModelSerializer):
    created_by = UserSafeSerializer(read_only=True)
    is_authenticated_user_joined = serializers.SerializerMethodField()
    participants_count = serializers.SerializerMethodField()
    participations = ParticipationSerializer(many=True, read_only=True)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)


    class Meta:
        model = Event
        fields = (
            'id', 'title', 'description', 'date', 'location',
            'latitude', 'longitude',
            'created_by', 'slots', 'created_at', 'updated_at',
            'is_authenticated_user_joined', 'participants_count',
            'participations'
        )
        read_only_fields = ('created_at', 'updated_at', 'created_by')

    def _coerce_point(self, validated_data):
        has_lat = 'latitude' in self.initial_data
        has_lon = 'longitude' in self.initial_data
        if not (has_lat or has_lon):
            return None, False

        lat = validated_data.pop('latitude', None)
        lon = validated_data.pop('longitude', None)

        if lat is None and lon is None:
            return None, True
        if lat is None or lon is None:
            raise serializers.ValidationError("Both latitude and longitude are required.")
        if not (-90 <= lat <= 90):
            raise serializers.ValidationError("Latitude must be between -90 and 90.")
        if not (-180 <= lon <= 180):
            raise serializers.ValidationError("Longitude must be between -180 and 180.")
        return Point(lon, lat, srid=4326), True

    def create(self, validated_data):
        point, has_coords = self._coerce_point(validated_data)
        if has_coords:
            validated_data['location'] = point
        return super().create(validated_data)

    def update(self, instance, validated_data):
        point, has_coords = self._coerce_point(validated_data)
        if has_coords:
            validated_data['location'] = point
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        point = getattr(instance, 'location', None)
        data['location'] = (
            {"type": "Point", "coordinates": [point.x, point.y]} if point else None
        )
        data['latitude'] = point.y if point else None
        data['longitude'] = point.x if point else None
        return data

    def get_is_authenticated_user_joined(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Participation.objects.filter(user=request.user, event=obj).exists()
        return False

    def get_participants_count(self, obj):
        return obj.participations.count()

    def validate_date(self, value):
        from django.utils import timezone
        if value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value
