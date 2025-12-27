from django.contrib.auth.models import AbstractUser
from django.db import models
from common.models import BaseModel

class User(AbstractUser, BaseModel):

    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('technician', 'Technician'),
        ('employee', 'Employee'),
    )

    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='technician'
    )

    def __str__(self):
        return self.username

