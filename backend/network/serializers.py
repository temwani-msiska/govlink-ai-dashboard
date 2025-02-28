from rest_framework import serializers
from .models import NetworkStatus

class NetworkStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkStatus
        fields = '__all__'
