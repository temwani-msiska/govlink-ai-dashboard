"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import SpeedChart from "@/components/SpeedChart";
import RoutingMap from "@/components/RoutingMap";
import { fetchNetworkStatus } from "@/lib/api";
import { fetchSimulationData } from "@/lib/api";

// Define Type for Network Data
type NetworkStatistics = {
  protocol_distribution: { [key: string]: number };
  top_sources: { [key: string]: number };
  top_destinations: { [key: string]: number };
  average_packet_length: { [key: string]: number };
};

export default function Dashboard() {
  const router = useRouter();
  const [networkData, setNetworkData] = useState<NetworkStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Simulation Data
  useEffect(() => {
    fetchSimulationData().then((data) => {
      setNetworkData(data);
      setLoading(false);
    });
  }, []);

  // Secure authentication check
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

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

        {/* Network Health Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Network Protocol Distribution</h2>
            <ul className="mt-4">
              {Object.entries(networkData?.protocol_distribution || {}).map(([protocol, count], index) => (
                <li key={index} className="flex justify-between p-2 border-b">
                  <span>{protocol}</span>
                  <span className="font-semibold text-gray-600">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Alerts */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">AI-Powered Alerts & Insights</h2>
            <ul className="mt-4">
              {networkData?.protocol_distribution["ARP"] && networkData.protocol_distribution["ARP"] > 20 ? (
                <li className="text-red-500 py-2 border-b">
                  High ARP Requests Detected - Potential Spoofing Activity!
                </li>
              ) : (
                <li className="text-green-500 py-2 border-b">
                  No suspicious ARP requests detected.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Smart Routing & Bandwidth Analytics */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Routing & Failover Recommendations */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Smart Routing & Failover Recommendations</h2>
            <RoutingMap />
          </div>

          {/* Bandwidth & Performance Analytics with Speed Chart */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Bandwidth & Performance Analytics</h2>
            <ul className="mt-4">
              {Object.entries(networkData?.average_packet_length || {}).map(([protocol, avgLength], index) => (
                <li key={index} className="py-2 border-b flex justify-between">
                  <span>{protocol}</span>
                  <span className="text-gray-600">{avgLength.toFixed(2)} bytes</span>
                </li>
              ))}
            </ul>

            {/* Speed Chart */}
            <div className="mt-6 flex justify-center">
              <SpeedChart />
            </div>
          </div>
        </div>

        {/* Offline Mode & Sync Status */}
        <div className="mt-6 grid grid-cols-1">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Top Network Traffic Sources</h2>
            <ul className="mt-4">
              {Object.entries(networkData?.top_sources || {}).map(([source, count], index) => (
                <li key={index} className="py-2 border-b flex justify-between">
                  <span>{source}</span>
                  <span className="text-gray-600">{count} packets</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top Destinations */}
        <div className="mt-6 grid grid-cols-1">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Top Network Traffic Destinations</h2>
            <ul className="mt-4">
              {Object.entries(networkData?.top_destinations || {}).map(([destination, count], index) => (
                <li key={index} className="py-2 border-b flex justify-between">
                  <span>{destination}</span>
                  <span className="text-gray-600">{count} packets</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
