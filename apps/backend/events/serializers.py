from rest_framework import serializers
from .models import Event, Participation, EventCategory
from users.serializers import UserSafeSerializer
from .services import EventService, LocationService

class ParticipationSerializer(serializers.ModelSerializer):
    user = UserSafeSerializer(read_only=True)
    
    class Meta:
        model = Participation
        fields = ('id', 'user', 'event', 'joined_at')
        read_only_fields = ('joined_at',)

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = ('id', 'name', 'slug', 'description')

class EventSerializer(serializers.ModelSerializer):
    created_by = UserSafeSerializer(read_only=True)
    is_authenticated_user_joined = serializers.SerializerMethodField()
    participants_count = serializers.SerializerMethodField()
    participations = ParticipationSerializer(many=True, read_only=True)
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)
    category = EventCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=EventCategory.objects.filter(is_active=True),
        write_only=True,
        required=True,
    )


    class Meta:
        model = Event
        fields = (
            'id', 'title', 'description', 'date', 'category', 'category_id',
            'city', 'location',
            'latitude', 'longitude',
            'created_by', 'slots', 'created_at', 'updated_at',
            'is_authenticated_user_joined', 'participants_count',
            'participations'
        )
        read_only_fields = ('created_at', 'updated_at', 'created_by')
        extra_kwargs = {
            'location': {'required': False},
        }

    def validate(self, attrs):
        require_coordinates = self.instance is None
        point, has_coords_input = LocationService.coerce_point(
            initial_data=self.initial_data,
            attrs=attrs,
            require_coordinates=require_coordinates,
        )

        if has_coords_input:
            attrs['location'] = point

        if 'city' in attrs:
            attrs['city'] = LocationService.normalize_city(attrs.get('city'))

        return attrs

    def create(self, validated_data):
        created_by = validated_data.pop('created_by')
        return EventService.create_event(created_by, validated_data)

    def update(self, instance, validated_data):
        if 'city' in validated_data:
            validated_data['city'] = LocationService.normalize_city(validated_data.get('city'))
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        point = getattr(instance, 'location', None)
        data['location'] = (
            {"type": "Point", "coordinates": [point.x, point.y]} if point else None
        )
        lat, lng = LocationService.point_to_lat_lng(point)
        data['latitude'] = lat
        data['longitude'] = lng
        return data

    def get_is_authenticated_user_joined(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Participation.objects.filter(user=request.user, event=obj).exists()
        return False

    def get_participants_count(self, obj):
        annotated_count = getattr(obj, 'participants_count', None)
        if annotated_count is not None:
            return annotated_count
        return obj.participations.count()

    def validate_date(self, value):
        from django.utils import timezone
        if value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value
