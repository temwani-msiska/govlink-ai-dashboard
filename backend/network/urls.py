from django.urls import path
from .views import NetworkStatusList
from .views import LoginView
from django.urls import path
from .views import NetworkSimulationData

urlpatterns = [
    path('network-status/', NetworkStatusList.as_view(), name='network-status'),
    path("login/", LoginView.as_view(), name="login"),
    path("simulation-data/", NetworkSimulationData.as_view(), name="simulation-data"),
]
