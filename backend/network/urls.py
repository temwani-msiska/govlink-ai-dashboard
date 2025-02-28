from django.urls import path
from .views import NetworkStatusList

urlpatterns = [
    path('network-status/', NetworkStatusList.as_view(), name='network-status'),
]
