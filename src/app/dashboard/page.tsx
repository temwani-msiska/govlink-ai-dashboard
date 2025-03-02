"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import SpeedChart from "@/components/SpeedChart";
import RoutingMap from "@/components/RoutingMap";
import { fetchNetworkStatus, fetchRealTimeBandwidth, runSpeedTest } from "@/lib/api";
import {
  networkHealthData,
  aiAlertsData,
  smartRoutingData,
  bandwidthAnalyticsData,
  offlineSyncData,
} from "@/lib/dummyData";
import NetworkTopology from "@/components/NetworkTopology";

// Define Type for Network Data
type NetworkStatus = {
  service: string;
  latency: number;
  packet_loss: number;
  status: string;
};

// Add this interface before the Dashboard component
interface DeviceModelMap {
  [key: string]: string[];
}

// Add these types at the top of your file
interface TopologyData {
  nodes: Array<{
    id: string;
    type: string;
    label: string;
    status: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    status: string;
  }>;
}

interface ActionResult {
  result: TopologyData;
}

export default function Dashboard() {
  const router = useRouter();
  const [networkData, setNetworkData] = useState<NetworkStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [configTask, setConfigTask] = useState("");
  const [configOutput, setConfigOutput] = useState("");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [realTimeBandwidth, setRealTimeBandwidth] = useState(null);
  const [speedTestResults, setSpeedTestResults] = useState(null);
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);
  const [streamingResult, setStreamingResult] = useState<string[]>([]);
  const [errorCode, setErrorCode] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState("");
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Device models mapping
  const deviceModels: DeviceModelMap = {
    Router: [
      "Cisco ISR 4321",
      "Cisco ISR 4431",
      "Cisco 2911",
      "Juniper MX240",
      "MikroTik RB3011"
    ],
    Switch: [
      "Cisco Catalyst 2960",
      "Cisco Catalyst 3750",
      "HP ProCurve 2530",
      "Juniper EX4300",
      "Aruba 2930F"
    ],
    Firewall: [
      "Cisco ASA 5506-X",
      "Palo Alto PA-220",
      "FortiGate 60F",
      "Check Point 3200",
      "SonicWall TZ350"
    ],
    Riverbed: [
      "SteelHead CX 570",
      "SteelHead CX 770",
      "SteelHead CX 1070"
    ],
    Hub: [
      "TP-Link TL-SF1005D",
      "D-Link DES-1005A",
      "Netgear GS105"
    ]
  };

  // Secure authentication check
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login"); // Redirect if no token
    } else {
      fetchNetworkStatus().then((data) => setNetworkData(data));
      setLoading(false); // Stop loading after authentication check
    }
  }, [router]);

  // Add this effect for real-time updates
  useEffect(() => {
    const fetchBandwidth = async () => {
      try {
        const data = await fetchRealTimeBandwidth();
        setRealTimeBandwidth(data);
      } catch (error) {
        console.error('Error fetching bandwidth:', error);
      }
    };

    // Update every second
    const interval = setInterval(fetchBandwidth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAskAI = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    try {
      const response = await fetch('http://localhost:8000/api/ask/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ question })
      });
      const data = await response.json();
      setAiResponse(data.response);
    } catch (error) {
      setAiResponse("Sorry, I couldn't process your question. Please try again.");
    }
    setIsAsking(false);
  };

  const handleGetConfig = async () => {
    if (!selectedDeviceType || !selectedModel || !configTask) {
      alert("Please fill in all fields");
      return;
    }

    setIsConfiguring(true);
    try {
      const response = await fetch('http://localhost:8000/api/ask/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ 
          question: `Provide step-by-step configuration instructions for the following:
            Device Type: ${selectedDeviceType}
            Model: ${selectedModel}
            Task: ${configTask}
            
            Please provide the configuration steps in a clear, numbered format.`
        })
      });
      const data = await response.json();
      setConfigOutput(data.response);
    } catch (error) {
      setConfigOutput("Sorry, I couldn't generate the configuration steps. Please try again.");
    }
    setIsConfiguring(false);
  };

  // Add a function to run speed test
  const handleSpeedTest = async () => {
    setIsTestingSpeed(true);
    try {
      const data = await runSpeedTest();
      setSpeedTestResults(data);
    } catch (error) {
      console.error('Speed test error:', error);
    }
    setIsTestingSpeed(false);
  };

  const handleNetworkAction = async () => {
    if ((selectedAction === 'ping' || selectedAction === 'traceroute') && !ipAddress) {
      alert("Please enter an IP address");
      return;
    }

    setIsLoading(true);
    setStreamingResult([]);  // Clear previous results

    if (selectedAction === 'ping') {
      // Simulate ping response streaming
      setActionResult('');
      for (let i = 1; i <= 4; i++) {
        const delay = Math.random() * 100 + 50; // Random delay between 50-150ms
        const bytes = 32;
        const time = Math.round(delay);
        const ttl = 64;

        const pingResponse = `Reply from ${ipAddress}: bytes=${bytes} time=${time}ms TTL=${ttl}`;
        setStreamingResult(prev => [...prev, pingResponse]);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Add summary after all pings
      setTimeout(() => {
        const summary = `
Ping statistics for ${ipAddress}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 52ms, Maximum = 147ms, Average = 84ms`;
        setActionResult(summary);
      }, 100);
    } else if (selectedAction === 'traceroute') {
      // Simulate traceroute response streaming
      setActionResult('');
      const hops = Math.floor(Math.random() * 5) + 8; // Random number of hops (8-12)
      
      for (let i = 1; i <= hops; i++) {
        const delay = Math.random() * 30 + 20; // Random delay 20-50ms
        const hopIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        const time1 = Math.round(delay);
        const time2 = Math.round(delay + Math.random() * 5);
        const time3 = Math.round(delay + Math.random() * 5);
        
        const hopResponse = i === hops
          ? `${i}  ${ipAddress}  ${time1}ms  ${time2}ms  ${time3}ms`
          : `${i}  ${hopIP}  ${time1}ms  ${time2}ms  ${time3}ms`;
        
        setStreamingResult(prev => [...prev, hopResponse]);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Add trace complete message
      setTimeout(() => {
        setActionResult("\nTrace complete.");
      }, 100);
    } else {
      // Handle other actions normally
      try {
        const response = await fetch('http://localhost:8000/api/network-action/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ 
            action: selectedAction,
            ip_address: ipAddress 
          })
        });
        const data = await response.json();
        setActionResult(data.result);
      } catch (error) {
        console.error('Network action error:', error);
        setActionResult("Error executing network action. Please try again.");
      }
    }
    setIsLoading(false);
  };

  const handleDiagnose = async () => {
    if (!errorCode.trim()) {
      alert("Please enter an error code or message");
      return;
    }

    setIsDiagnosing(true);
    try {
      const response = await fetch('http://localhost:8000/api/ask/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ 
          question: `Diagnose this network error and provide a solution: ${errorCode}. 
                    Please format your response as:
                    1. Error Description
                    2. Possible Causes
                    3. Recommended Solutions
                    4. Prevention Tips`
        })
      });
      const data = await response.json();
      setDiagnosticResult(data.response);
    } catch (error) {
      setDiagnosticResult("Sorry, I couldn't diagnose the error. Please try again.");
    }
    setIsDiagnosing(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100">
      <Navbar />

      {/* Main Dashboard Content */}
      <div className="pt-20 px-4 md:px-6">
        
        {/* Add this section right after Navbar */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-lg md:text-xl font-semibold">Ask AI About Your Network</h2>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the network..."
              className="flex-1 p-2 border rounded-md"
              onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
            />
            <button
              onClick={handleAskAI}
              disabled={isAsking}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isAsking ? 'Asking...' : 'Ask'}
            </button>
          </div>
          {aiResponse && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-700">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Network Actions & AI Alerts */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Actions Section */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Network Actions</h2>
            <div className="mt-4 space-y-4">
              {/* Action Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Action</label>
                <select 
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                >
                  <option value="">Select an action</option>
                  <option value="ping">Ping</option>
                  <option value="traceroute">Trace Route</option>
                  <option value="topology">View Network Topology</option>
                </select>
              </div>

              {/* IP Address Input for Ping and Traceroute */}
              {(selectedAction === 'ping' || selectedAction === 'traceroute') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">IP Address</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    placeholder="Enter IP address..."
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                  />
                </div>
              )}

              {/* Action Button */}
              {selectedAction && (
                <button
                  onClick={handleNetworkAction}
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isLoading ? 'Processing...' : `Run ${selectedAction}`}
                </button>
              )}

              {/* Results Display */}
              {(streamingResult.length > 0 || actionResult) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md font-mono">
                  <h3 className="font-medium mb-2">Results:</h3>
                  {selectedAction === 'topology' ? (
                    <div className="network-topology">
                      <NetworkTopology data={actionResult} />
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm">
                      {/* Show streaming results for ping */}
                      {streamingResult.map((line, index) => (
                        <div key={index} className="text-green-600">{line}</div>
                      ))}
                      {/* Show final summary */}
                      {actionResult && (
                        <div className="mt-2 text-gray-700">{actionResult}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AI Alerts */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">AI-Powered Alerts & Insights</h2>
            <ul className="mt-4">
              {aiAlertsData.map((alert) => (
                <li key={alert.id} className={`py-2 border-b ${alert.severity === "Critical" ? "text-red-500" : alert.severity === "Warning" ? "text-yellow-500" : "text-gray-600"}`}>
                  <span>{alert.alert}</span>
                  <span className="text-sm text-gray-400 ml-2">{alert.timestamp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Smart Routing & Bandwidth Analytics */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Device Configuration */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Network Device Configuration</h2>
            <div className="mt-4 space-y-4">
              {/* Device Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Device Type</label>
                <select 
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  value={selectedDeviceType}
                  onChange={(e) => setSelectedDeviceType(e.target.value)}
                >
                  <option value="">Select Device Type</option>
                  <option value="Router">Router</option>
                  <option value="Switch">Switch</option>
                  <option value="Firewall">Firewall</option>
                  <option value="Riverbed">Riverbed</option>
                  <option value="Hub">Hub</option>
                </select>
              </div>

              {/* Device Model Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Device Model</label>
                <select 
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="">Select Model</option>
                  {deviceModels[selectedDeviceType]?.map((model, index) => (
                    <option key={index} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Configuration Task */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Configuration Task</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  placeholder="e.g., Configure VLAN, Setup routing protocol"
                  value={configTask}
                  onChange={(e) => setConfigTask(e.target.value)}
                />
              </div>

              {/* Configure Button */}
              <button
                onClick={handleGetConfig}
                disabled={isConfiguring}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isConfiguring ? 'Getting Configuration...' : 'Get Configuration Steps'}
              </button>

              {/* Configuration Output */}
              {configOutput && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Configuration Steps:</h3>
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {configOutput}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bandwidth & Performance Analytics with Speed Chart */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Bandwidth & Performance Analytics</h2>
            
            {/* Real-time Bandwidth Usage */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Real-time Bandwidth Usage</h3>
                <span className="text-sm text-gray-500">
                  {realTimeBandwidth?.timestamp ? new Date(realTimeBandwidth.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-blue-600">
                  {realTimeBandwidth?.current_usage ?? 0} Mbps
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((realTimeBandwidth?.current_usage ?? 0) / 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Speed Test Results */}
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Network Speed Test</h3>
                <button
                  onClick={handleSpeedTest}
                  disabled={isTestingSpeed}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 text-sm"
                >
                  {isTestingSpeed ? 'Testing...' : 'Run Test'}
                </button>
              </div>
              
              {speedTestResults && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-sm text-gray-500">Download</div>
                    <div className="text-xl font-bold text-green-600">
                      {speedTestResults.download_speed} Mbps
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-sm text-gray-500">Upload</div>
                    <div className="text-xl font-bold text-blue-600">
                      {speedTestResults.upload_speed} Mbps
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-sm text-gray-500">Ping</div>
                    <div className="text-xl font-bold text-purple-600">
                      {speedTestResults.ping} ms
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Replace Historical Bandwidth Usage with Network Diagnostics */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Network Diagnostics</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Error Code or Message</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    placeholder="e.g., ERR_CONNECTION_TIMED_OUT, 404, or describe the error..."
                    value={errorCode}
                    onChange={(e) => setErrorCode(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleDiagnose}
                  disabled={isDiagnosing}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isDiagnosing ? 'Diagnosing...' : 'Diagnose Error'}
                </button>

                {/* Diagnostic Results */}
                {diagnosticResult && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium mb-2">Diagnostic Results:</h4>
                    <div className="whitespace-pre-wrap text-sm">
                      {diagnosticResult}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Speed Chart */}
            <div className="mt-6">
              <SpeedChart />
            </div>
          </div>
        </div>

        {/* Offline Mode & Sync Status */}
        <div className="mt-6 grid grid-cols-1">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Offline Mode & Sync Status</h2>
            <ul className="mt-4">
              {offlineSyncData.map((data, index) => (
                <li key={index} className="py-2 border-b flex justify-between">
                  <span>{data.office}</span>
                  <span className={`font-semibold ${data.syncStatus === "Pending" ? "text-yellow-500" : "text-green-500"}`}>
                    {data.syncStatus} (Last Sync: {data.lastSync})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
