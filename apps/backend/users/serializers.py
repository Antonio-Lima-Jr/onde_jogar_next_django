from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSafeSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar_url')

class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    games_played_count = serializers.ReadOnlyField()
    upcoming_events = serializers.SerializerMethodField()
    past_events = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'bio', 'avatar_url', 
            'favorite_sports', 'games_played_count', 
            'upcoming_events', 'past_events'
        )

    def get_upcoming_events(self, obj):
        from events.serializers import EventSerializer
        from django.utils import timezone
        participations = obj.participations.filter(event__date__gte=timezone.now()).order_by('event__date')
        events = [p.event for p in participations]
        # Important: Passes context to ensure nested requests work, 
        # but EventSerializer now uses UserSafeSerializer internally.
        return EventSerializer(events, many=True, context=self.context).data

    def get_past_events(self, obj):
        from events.serializers import EventSerializer
        from django.utils import timezone
        participations = obj.participations.filter(event__date__lt=timezone.now()).order_by('-event__date')
        events = [p.event for p in participations]
        return EventSerializer(events, many=True, context=self.context).data



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user
