import random
import time
from datetime import datetime
import psutil
import speedtest
import subprocess
import platform
import ipaddress

class NetworkMonitor:
    def __init__(self):
        self.services = [
            "Main Router",
            "DNS Server",
            "Web Server",
            "Database Server",
            "Email Server"
        ]
    
    def get_network_status(self):
        """Simulate network monitoring data"""
        status_data = []
        for service in self.services:
            # Simulate realistic network metrics
            latency = random.uniform(5, 100)  # ms
            packet_loss = random.uniform(0, 5)  # percentage
            status = "Up" if random.random() > 0.1 else "Down"  # 10% chance of being down
            
            status_data.append({
                "service": service,
                "latency": round(latency, 2),
                "packet_loss": round(packet_loss, 2),
                "status": status,
                "timestamp": datetime.now().isoformat()
            })
        
        return status_data 

class RealTimeBandwidth:
    def __init__(self):
        self.speed_test = speedtest.Speedtest()
    
    def get_network_usage(self):
        # Get network interfaces statistics
        net_io = psutil.net_io_counters()
        
        # Calculate current bandwidth usage
        bytes_sent = net_io.bytes_sent
        bytes_recv = net_io.bytes_recv
        
        # Convert to Mbps
        total_usage = (bytes_sent + bytes_recv) * 8 / 1_000_000  # Convert to Mbps
        
        return {
            'current_usage': round(total_usage, 2),
            'timestamp': datetime.now().isoformat()
        }
    
    def get_speed_test(self):
        try:
            print("Getting download speed...")
            download_speed = self.speed_test.download() / 1_000_000  # Convert to Mbps
            print("Getting upload speed...")
            upload_speed = self.speed_test.upload() / 1_000_000  # Convert to Mbps
            print("Getting ping...")
            ping = self.speed_test.results.ping
            
            return {
                'download_speed': round(download_speed, 2),
                'upload_speed': round(upload_speed, 2),
                'ping': round(ping, 2),
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Speed test error: {str(e)}")
            return None 

def execute_ping(ip_address, count=4):
    try:
        # Validate IP address
        try:
            # This will validate both IPv4 and IPv6 addresses
            ipaddress.ip_address(ip_address)
        except ValueError:
            return {"error": "Invalid IP address format"}
            
        # Different ping command for Windows vs Unix-based systems
        if platform.system().lower() == "windows":
            command = ["ping", "-n", str(count), ip_address]
        else:
            command = ["ping", "-c", str(count), ip_address]
            
        # Execute ping command and capture output
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        if stderr:
            return {"error": stderr.decode()}
            
        return {"result": stdout.decode()}
        
    except Exception as e:
        return {"error": str(e)} 