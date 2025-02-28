"use client";

import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Dummy Data Import
import { networkHealthData, aiAlertsData, bandwidthAnalyticsData } from "@/lib/dummyData";

export default function Charts() {
  // 📌 **1️⃣ Pie Chart: Network Health**
  const networkHealthChart = {
    labels: networkHealthData.map((service) => service.service),
    datasets: [
      {
        label: "Network Status",
        data: networkHealthData.map((service) =>
          service.status === "Operational" ? 80 : service.status === "Slow" ? 50 : 20
        ),
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  // 📌 **2️⃣ Line Chart: AI Alerts Over Time**
  const aiAlertsChart = {
    labels: ["1hr ago", "30 mins ago", "15 mins ago", "Now"],
    datasets: [
      {
        label: "AI Alerts",
        data: [2, 5, 7, aiAlertsData.length], // Simulating alert spikes
        borderColor: "#2f68bc",
        backgroundColor: "rgba(47, 104, 188, 0.5)",
      },
    ],
  };

  // 📌 **3️⃣ Bar Chart: Bandwidth Usage**
  const bandwidthChart = {
    labels: bandwidthAnalyticsData.map((data) => data.service),
    datasets: [
      {
        label: "Usage (GB)",
        data: bandwidthAnalyticsData.map((data) => parseInt(data.usage)),
        backgroundColor: ["#2f68bc", "#71d3ee", "#4CAF50"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Network Health - Pie Chart */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold">Network Health</h2>
        <Pie data={networkHealthChart} />
      </div>

      {/* AI Alerts - Line Chart */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold">AI Alerts Over Time</h2>
        <Line data={aiAlertsChart} />
      </div>

      {/* Bandwidth Usage - Bar Chart */}
      <div className="bg-white p-6 shadow-md rounded-lg col-span-1 lg:col-span-2">
        <h2 className="text-lg font-semibold">Bandwidth Usage</h2>
        <Bar data={bandwidthChart} />
      </div>
    </div>
  );
}
