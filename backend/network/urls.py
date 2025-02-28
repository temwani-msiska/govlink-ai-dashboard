from django.urls import path
from .views import NetworkStatusList
from .views import LoginView

urlpatterns = [
    path('network-status/', NetworkStatusList.as_view(), name='network-status'),
    path("login/", LoginView.as_view(), name="login"),
]
