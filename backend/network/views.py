from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import NetworkStatus, CustomUser
from .serializers import NetworkStatusSerializer

class NetworkStatusList(generics.ListAPIView):
    queryset = NetworkStatus.objects.all()
    serializer_class = NetworkStatusSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Raw Request Data:", request.data)  # Debugging

        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            print("Error: Missing email or password")  # Debugging
            return Response({"error": "Missing email or password"}, status=400)

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            print("Error: User not found")  # Debugging
            return Response({"error": "Invalid credentials"}, status=400)

        # Authenticate using username (Django expects username, not email)
        user = authenticate(username=user.username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "is_staff": user.is_staff,
                    },
                },
                status=200,
            )

        print("Error: Authentication failed")  # Debugging
        return Response({"error": "Invalid credentials"}, status=400)
