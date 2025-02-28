from rest_framework import generics
from .models import NetworkStatus
from .serializers import NetworkStatusSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class NetworkStatusList(generics.ListAPIView):
    queryset = NetworkStatus.objects.all()
    serializer_class = NetworkStatusSerializer
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "user": {"email": user.email, "username": user.username},
                }
            )
        return Response({"error": "Invalid credentials"}, status=400)