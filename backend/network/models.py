from django.db import models
from django.contrib.auth.models import AbstractUser

class NetworkStatus(models.Model):
    service = models.CharField(max_length=255)
    latency = models.IntegerField()
    packet_loss = models.FloatField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.service
    
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email

class BandwidthMetrics(models.Model):
    service = models.CharField(max_length=100)
    current_usage = models.FloatField()
    total_capacity = models.FloatField()
    peak_time = models.TimeField()
    timestamp = models.DateTimeField(auto_now=True)

    def usage_display(self):
        return f"{self.current_usage} Mbps / {self.total_capacity} Mbps"