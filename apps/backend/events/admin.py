from django.contrib import admin
from .models import Event, Participation

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'slots', 'created_by')
    search_fields = ('title', 'location')
    list_filter = ('date',)

@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'joined_at')
    list_filter = ('joined_at',)
