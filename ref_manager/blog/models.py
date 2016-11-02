from django.db import models
from django.contrib.auth.models import User


class Reference(models.Model):
    title = models.CharField(max_length=100)
    link = models.CharField(max_length=1000)
    notes = models.TextField(max_length=1000)
    user = models.ForeignKey(User, related_name='reference')
