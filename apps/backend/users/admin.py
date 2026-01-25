from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Profile Info', {'fields': ('bio', 'avatar_url', 'favorite_sports')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Profile Info', {'fields': ('bio', 'avatar_url', 'favorite_sports')}),
    )
    list_display = UserAdmin.list_display + ('games_played_count',)

admin.site.register(User, CustomUserAdmin)
