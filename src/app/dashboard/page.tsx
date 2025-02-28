"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import SpeedChart from "@/components/SpeedChart";
import RoutingMap from "@/components/RoutingMap";
import { fetchNetworkStatus } from "@/lib/api";
import {
  networkHealthData,
  aiAlertsData,
  smartRoutingData,
  bandwidthAnalyticsData,
  offlineSyncData,
} from "@/lib/dummyData";

// Define Type for Network Data
type NetworkStatus = {
  service: string;
  latency: number;
  packet_loss: number;
  status: string;
};

export default function Dashboard() {
  const [networkData, setNetworkData] = useState<NetworkStatus[]>([]);

  useEffect(() => {
    fetchNetworkStatus().then((data) => setNetworkData(data));
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-100">
      <Navbar />

      {/* Main Dashboard Content */}
      <div className="pt-20 px-4 md:px-6">
        
        {/* Network Health Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Network Health</h2>
            <ul className="mt-4">
              {networkData.map((service: NetworkStatus, index: number) => (
                <li key={index} className="flex justify-between p-2 border-b">
                  <span>{service.service}</span>
                  <span className={service.status === "Down" ? "text-red-500" : "text-green-500"}>
                    {service.status}
                  </span>
                </li>
              ))}
            </ul>
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
          {/* Smart Routing & Failover Recommendations */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Smart Routing & Failover Recommendations</h2>
            <RoutingMap />
          </div>

          {/* Bandwidth & Performance Analytics with Speed Chart */}
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-lg md:text-xl font-semibold">Bandwidth & Performance Analytics</h2>
            <ul className="mt-4">
              {bandwidthAnalyticsData.map((data, index) => (
                <li key={index} className="py-2 border-b flex justify-between">
                  <span>{data.service}</span>
                  <span className="text-gray-600">{data.usage} (Peak: {data.peakTime})</span>
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
