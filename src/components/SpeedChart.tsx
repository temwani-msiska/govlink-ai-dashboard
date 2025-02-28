"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { speedTestData } from "@/lib/dummyData";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SpeedChart() {
  const speedChartData = {
    labels: ["Used Speed", "Remaining"],
    datasets: [
      {
        data: [speedTestData.downloadSpeed, 100 - speedTestData.downloadSpeed], // Simulate speed gauge
        backgroundColor: ["#2f68bc", "#e0e0e0"], // Blue for used, gray for remaining
        borderWidth: 1,
      },
    ],
  };

  const speedChartOptions = {
    cutout: "80%", // Makes it look like a speed gauge
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-md font-semibold mb-2">Download Speed</h3>
      <div className="w-40 h-40">
        <Doughnut data={speedChartData} options={speedChartOptions} />
      </div>
      <p className="mt-2 text-gray-700">
        {speedTestData.downloadSpeed} Mbps (Latency: {speedTestData.latency} ms)
      </p>
    </div>
  );
}
