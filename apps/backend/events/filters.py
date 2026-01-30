import django_filters
from django.db.models import Count, F

from .models import Event


class EventFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name='category_id')
    date_from = django_filters.DateTimeFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateTimeFilter(field_name='date', lookup_expr='lte')
    open_slots = django_filters.BooleanFilter(method='filter_open_slots')

    class Meta:
        model = Event
        fields = ['category', 'date_from', 'date_to', 'open_slots']

    def filter_open_slots(self, queryset, name, value):
        if not value:
            return queryset
        annotated = queryset.annotate(participants_count=Count('participations', distinct=True))
        return annotated.filter(slots__gt=F('participants_count'))
