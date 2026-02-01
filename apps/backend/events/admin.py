from django.contrib import admin, messages
from django.shortcuts import redirect
from django.urls import path, reverse
from django.utils.html import format_html

from rankings.tasks import refresh_rankings_task

from .models import Event, Participation, EventCategory
from .tasks import generate_event_ranking_task, heal_check

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'category',
        'city',
        'date',
        'location',
        'slots',
        'created_by',
        'run_ranking_task_link',
    )
    search_fields = ('title', 'city')
    list_filter = ('date', 'category')

    @admin.display(description="Ranking task")
    def run_ranking_task_link(self, obj):
        url = reverse("admin:events_event_run_ranking", args=[obj.pk])
        return format_html('<a href="{}">Run now</a>', url)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "run-ranking/<int:event_id>/",
                self.admin_site.admin_view(self.run_ranking_task_view),
                name="events_event_run_ranking",
            ),
            path(
                "run-heal-check/",
                self.admin_site.admin_view(self.run_heal_check_view),
                name="events_event_run_heal_check",
            ),
            path(
                "run-refresh-rankings/",
                self.admin_site.admin_view(self.run_refresh_rankings_view),
                name="events_event_run_refresh_rankings",
            ),
        ]
        return custom_urls + urls

    def run_ranking_task_view(self, request, event_id: int):
        if not Event.objects.filter(pk=event_id).exists():
            self.message_user(
                request,
                f"Event {event_id} not found.",
                level=messages.ERROR,
            )
            return redirect(reverse("admin:events_event_changelist"))

        result = generate_event_ranking_task.apply(args=[event_id])
        self.message_user(
            request,
            f"Ranking task executed for event {event_id} (state: {result.state}).",
            level=messages.SUCCESS,
        )
        return redirect(request.META.get("HTTP_REFERER", reverse("admin:events_event_changelist")))

    def run_heal_check_view(self, request):
        result = heal_check.apply()
        self.message_user(
            request,
            f"Heal check executed (state: {result.state}).",
            level=messages.SUCCESS,
        )
        return redirect(request.META.get("HTTP_REFERER", reverse("admin:events_event_changelist")))

    def run_refresh_rankings_view(self, request):
        result = refresh_rankings_task.apply()
        self.message_user(
            request,
            f"Refresh rankings executed (state: {result.state}).",
            level=messages.SUCCESS,
        )
        return redirect(request.META.get("HTTP_REFERER", reverse("admin:events_event_changelist")))

@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'joined_at')
    list_filter = ('joined_at',)

@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    search_fields = ('name', 'slug')
    list_filter = ('is_active',)
