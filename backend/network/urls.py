from django.urls import path
from .views import NetworkStatusList, LoginView
from . import views

urlpatterns = [
    path('network-status/', NetworkStatusList.as_view(), name='network-status'),
    path('login/', LoginView.as_view(), name="login"),
    path('ask/', views.ask_openai, name='ask_openai'),
    path('bandwidth/current/', views.real_time_bandwidth, name='real-time-bandwidth'),
    path('bandwidth/speedtest/', views.speed_test, name='speed-test'),
    path('network-action/', views.network_action, name='network-action'),
]
