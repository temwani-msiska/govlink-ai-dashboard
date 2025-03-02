from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import NetworkStatus, CustomUser, BandwidthMetrics
from .serializers import NetworkStatusSerializer
from rest_framework.decorators import api_view
import openai
import json
import os
from .network_monitor import RealTimeBandwidth, execute_ping

# Fetch OpenAI API Key from environment variables
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

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

        # Ensure authentication works with email instead of username
        user = authenticate(request, email=email, password=password)

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

        if not OPENAI_API_KEY:
            return Response({'error': 'OpenAI API key is missing'}, status=500)

        openai.api_key = OPENAI_API_KEY

        try:
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that answers questions about network status."},
                    {"role": "user", "content": question}
                ]
            )

            response = completion['choices'][0]['message']['content']
            return Response({'response': response})

        except openai.error.OpenAIError as e:
            print(f"OpenAI API Error: {str(e)}")
            return Response({'error': 'Failed to get response from OpenAI'}, status=500)

    except Exception as e:
        print(f"Server Error: {str(e)}")
        return Response({'error': str(e)}, status=500)


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
        return Response({'error': 'Speed test failed or no data available'}, status=500)
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
        if not OPENAI_API_KEY:
            return Response({'error': 'OpenAI API key is missing'}, status=500)

        openai.api_key = OPENAI_API_KEY

        try:
            completion = openai.ChatCompletion.create(
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

            # Safeguard against invalid JSON responses
            try:
                topology_data = json.loads(completion['choices'][0]['message']['content'])
                return Response({'result': topology_data})
            except json.JSONDecodeError:
                print("Error: Invalid JSON received from OpenAI")
                return Response({'error': 'Invalid topology format received'}, status=500)

        except openai.error.OpenAIError as e:
            print(f"Topology generation error: {str(e)}")
            return Response({'error': 'Failed to generate network topology'}, status=500)

    return Response({'error': 'Invalid action'}, status=400)
