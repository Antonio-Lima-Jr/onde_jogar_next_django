from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, EventCategoryViewSet

router = DefaultRouter()
router.register(r'', EventViewSet)

urlpatterns = [
    path('categories/', EventCategoryViewSet.as_view({'get': 'list'}), name='event-category-list'),
    path('', include(router.urls)),
]
