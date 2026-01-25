from rest_framework import serializers
from .models import Event, Participation
from users.serializers import UserSerializer

class ParticipationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Participation
        fields = ('id', 'user', 'event', 'joined_at')
        read_only_fields = ('joined_at',)

class EventSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    is_authenticated_user_joined = serializers.SerializerMethodField()
    participants_count = serializers.SerializerMethodField()
    participations = ParticipationSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = (
            'id', 'title', 'description', 'date', 'location', 
            'created_by', 'slots', 'created_at', 'updated_at',
            'is_authenticated_user_joined', 'participants_count',
            'participations'
        )
        read_only_fields = ('created_at', 'updated_at', 'created_by')

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
