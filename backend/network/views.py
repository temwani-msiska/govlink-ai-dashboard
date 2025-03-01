from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import NetworkStatus, CustomUser
from .serializers import NetworkStatusSerializer
import pandas as pd
import os
from django.conf import settings



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

class NetworkSimulationData(APIView):
    def get(self, request):
        file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "network_data.csv")


        if not os.path.exists(file_path):
            return Response({"error": f"File not found at {file_path}"}, status=500)

        try:
            df = pd.read_csv(file_path)

            # Ensure required columns exist
            required_columns = {"Protocol", "Source", "Destination", "Length"}
            if not required_columns.issubset(df.columns):
                return Response({"error": "CSV file is missing required columns"}, status=500)

            # Generate structured data for the frontend
            data = {
                "protocol_distribution": df["Protocol"].value_counts().to_dict(),
                "top_sources": df["Source"].value_counts().to_dict(),
                "top_destinations": df["Destination"].value_counts().to_dict(),
                "average_packet_length": df.groupby("Protocol")["Length"].mean().to_dict(),
            }

            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)