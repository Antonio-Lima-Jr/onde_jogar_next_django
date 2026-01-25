from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True)
    favorite_sports = models.JSONField(default=list, blank=True)

    @property
    def games_played_count(self):
        return self.participations.count()
