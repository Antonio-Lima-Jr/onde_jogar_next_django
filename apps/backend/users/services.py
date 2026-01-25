from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.db import transaction

User = get_user_model()

class UserService:
    @staticmethod
    @transaction.atomic
    def register_user(username, email, password):
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        token, _ = Token.objects.get_or_create(user=user)
        return user, token.key

    @staticmethod
    def update_user_profile(user, data):
        for attr, value in data.items():
            setattr(user, attr, value)
        user.save()
        return user
