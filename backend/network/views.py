from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import NetworkStatus, CustomUser, BandwidthMetrics
from .serializers import NetworkStatusSerializer
from rest_framework.decorators import api_view
from django.conf import settings
import openai
from .network_monitor import RealTimeBandwidth, execute_ping
import json
import os
from dotenv import load_dotenv
import requests
from openai import OpenAI

load_dotenv()  # Load environment variables

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

@api_view(['POST'])
def ask_openai(request):
    try:
        question = request.data.get('question')
        if not question:
            return Response({'error': 'Question is required'}, status=400)

        # AI/ML API configuration - using same setup as travel.py
        base_url = "https://api.aimlapi.com/v1"
        api_key = os.getenv('AI_ML_API_KEY')
        
        api = OpenAI(api_key=api_key, base_url=base_url)
        
        completion = api.chat.completions.create(
            model="mistralai/Mistral-7B-Instruct-v0.2",
            messages=[
                {"role": "system", "content": "You are a network diagnostic assistant. Be descriptive and helpful with network-related questions."},
                {"role": "user", "content": question},
            ],
            temperature=0.7,
            max_tokens=256,
        )

        response = completion.choices[0].message.content
        return Response({'response': response})
            
    except Exception as e:
        print(f"AI/ML API Error: {str(e)}")
        return Response({'error': 'Failed to get response from AI service'}, status=500)

@api_view(['GET'])
def bandwidth_metrics(request):
    metrics = BandwidthMetrics.objects.all()
    data = [{
        'service': m.service,
        'usage': m.usage_display(),
        'peakTime': m.peak_time.strftime('%H:%M')
    } for m in metrics]
    return Response(data)

bandwidth_monitor = RealTimeBandwidth()

@api_view(['GET'])
def real_time_bandwidth(request):
    try:
        usage_data = bandwidth_monitor.get_network_usage()
        return Response(usage_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def speed_test(request):
    try:
        speed_data = bandwidth_monitor.get_speed_test()
        if speed_data:
            return Response(speed_data)
        return Response({'error': 'Speed test failed'}, status=500)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def network_action(request):
    action = request.data.get('action')
    ip_address = request.data.get('ip_address')
    
    if action == 'ping':
        if not ip_address:
            return Response({'error': 'IP address is required'}, status=400)
        result = execute_ping(ip_address)
        return Response(result)
    
    elif action == 'topology':
        try:
            # Get API key from environment variable
            api_key = os.getenv('OPENAI_API_KEY')
            client = openai.OpenAI(api_key=api_key)
            
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": """You are a network topology analyzer. 
                    Generate a realistic network topology with nodes and links. 
                    Return only valid JSON that matches this structure exactly:
                    {
                        "nodes": [
                            {"id": "string", "type": "string", "label": "string", "status": "string"}
                        ],
                        "links": [
                            {"source": "string", "target": "string", "status": "string"}
                        ]
                    }
                    Include core routers, switches, firewalls, and servers. Make sure all IDs referenced in links exist in nodes."""},
                    {"role": "user", "content": "Generate a realistic enterprise network topology with core infrastructure, servers, and security devices."}
                ]
            )
            
            # Parse the response and ensure it's valid JSON
            topology_data = json.loads(completion.choices[0].message.content)
            return Response({'result': topology_data})
            
        except Exception as e:
            print(f"Topology generation error: {str(e)}")
            return Response({'error': 'Failed to generate network topology'}, status=500)
    
    return Response({'error': 'Invalid action'}, status=400)
