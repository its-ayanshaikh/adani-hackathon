from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'password',
        )

    def create(self, validated_data):
        user = User(
            username=validated_data['email'],  # username = email
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            user_type='technician',  # default
        )
        user.set_password(validated_data['password'])  # 🔐 hash password
        user.save()
        return user
