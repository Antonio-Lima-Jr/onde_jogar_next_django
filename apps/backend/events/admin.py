from celery import current_app
from django.contrib import admin, messages
from django.shortcuts import redirect
from django.urls import path, reverse, NoReverseMatch
from django.utils.html import format_html

from .models import Event, Participation, EventCategory

EVENT_RANKING_TASK = "events.generate_event_ranking"
HEAL_CHECK_TASK = "events.heal_check"
REFRESH_RANKINGS_TASK = "rankings.refresh_rankings"

EVENTS_QUEUE = "events"
RANKINGS_QUEUE = "rankings"

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
    actions = (
        "action_generate_event_ranking",
        "action_heal_check",
        "action_refresh_rankings",
    )

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

        result = current_app.send_task(EVENT_RANKING_TASK, args=[event_id], queue=EVENTS_QUEUE)
        result_link = self._task_result_link(result.id)
        self.message_user(
            request,
            format_html(
                "Ranking task enqueued for event {} (id: {}). {}",
                event_id,
                result.id,
                result_link,
            ),
            level=messages.SUCCESS,
        )
        return redirect(request.META.get("HTTP_REFERER", reverse("admin:events_event_changelist")))

    def run_heal_check_view(self, request):
        result = current_app.send_task(HEAL_CHECK_TASK, queue=EVENTS_QUEUE)
        result_link = self._task_result_link(result.id)
        self.message_user(
            request,
            format_html("Heal check enqueued (id: {}). {}", result.id, result_link),
            level=messages.SUCCESS,
        )
        return redirect(request.META.get("HTTP_REFERER", reverse("admin:events_event_changelist")))

    def run_refresh_rankings_view(self, request):
        result = current_app.send_task(REFRESH_RANKINGS_TASK, queue=RANKINGS_QUEUE)
        result_link = self._task_result_link(result.id)
        self.message_user(
            request,
            format_html("Refresh rankings enqueued (id: {}). {}", result.id, result_link),
            level=messages.SUCCESS,
        )
        return redirect(request.META.get("HTTP_REFERER", reverse("admin:events_event_changelist")))

    @admin.action(description="Executar ranking para eventos selecionados")
    def action_generate_event_ranking(self, request, queryset):
        if not queryset.exists():
            self.message_user(request, "Nenhum evento selecionado.", level=messages.WARNING)
            return
        task_ids = []
        for event in queryset.only("id"):
            result = current_app.send_task(EVENT_RANKING_TASK, args=[event.id], queue=EVENTS_QUEUE)
            task_ids.append(result.id)
        self.message_user(
            request,
            f"Ranking enfileirado para {queryset.count()} evento(s).",
            level=messages.SUCCESS,
        )

    @admin.action(description="Executar heal_check")
    def action_heal_check(self, request, queryset):
        result = current_app.send_task(HEAL_CHECK_TASK, queue=EVENTS_QUEUE)
        result_link = self._task_result_link(result.id)
        self.message_user(
            request,
            format_html("Heal check enqueued (id: {}). {}", result.id, result_link),
            level=messages.SUCCESS,
        )

    @admin.action(description="Executar refresh_rankings")
    def action_refresh_rankings(self, request, queryset):
        result = current_app.send_task(REFRESH_RANKINGS_TASK, queue=RANKINGS_QUEUE)
        result_link = self._task_result_link(result.id)
        self.message_user(
            request,
            format_html("Refresh rankings enqueued (id: {}). {}", result.id, result_link),
            level=messages.SUCCESS,
        )

    def _task_result_link(self, task_id: str):
        try:
            url = reverse("admin:django_celery_results_taskresult_change", args=[task_id])
        except NoReverseMatch:
            return ""
        return format_html('<a href="{}">Ver resultado</a>', url)

@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'joined_at')
    list_filter = ('joined_at',)

@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    search_fields = ('name', 'slug')
    list_filter = ('is_active',)
