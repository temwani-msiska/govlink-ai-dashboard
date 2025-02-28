from rest_framework import generics
from .models import NetworkStatus
from .serializers import NetworkStatusSerializer

class NetworkStatusList(generics.ListAPIView):
    queryset = NetworkStatus.objects.all()
    serializer_class = NetworkStatusSerializer
