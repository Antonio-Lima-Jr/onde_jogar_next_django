from django.contrib.auth import get_user_model
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
        return user

    @staticmethod
    def update_user_profile(user, data):
        for attr, value in data.items():
            setattr(user, attr, value)
        user.save()
        return user
