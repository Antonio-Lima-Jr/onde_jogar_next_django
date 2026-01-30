from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils import timezone
from django.contrib.gis.db import models as gis_models
from django.contrib.postgres.indexes import GistIndex

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    category = models.ForeignKey(
        'EventCategory',
        on_delete=models.PROTECT,
        related_name='events',
    )
    # Auxiliary metadata for simple filters (no reverse geocoding in MVP).
    city = models.CharField(max_length=120, blank=True, default="")
    # Geographic point (lon/lat) stored in PostGIS for distance queries.
    location = gis_models.PointField(
        geography=True,
        srid=4326,
    )
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    slots = models.IntegerField(validators=[MinValueValidator(1)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            GistIndex(fields=["location"], name="events_location_gist_idx"),
        ]

    def __str__(self):
        return f"{self.title} ({self.date.strftime('%Y-%m-%d %H:%M')})"

    def clean(self):
        # Basic validation example, though usually handled in forms/serializers
        pass

class Participation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='participations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participations')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user} -> {self.event.title}"


class EventCategory(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(max_length=80, unique=True)
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Event categories"
        ordering = ["name"]

    def __str__(self):
        return self.name
