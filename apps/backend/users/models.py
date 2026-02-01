from django.contrib.auth.models import AbstractUser
from django.db import models
from snowflake_id.django_field import DjangoSnowflakeIDField
from common.snowflake import SNOWFLAKE_GENERATOR

class User(AbstractUser):
    class Meta:
        db_table = 'users'

    id = DjangoSnowflakeIDField(generator=SNOWFLAKE_GENERATOR)
    bio = models.TextField(max_length=500, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True)
    favorite_sports = models.JSONField(default=list, blank=True)

    @property
    def games_played_count(self):
        return self.participations.count()
