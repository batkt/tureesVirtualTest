import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import _ from "lodash";
import formatNumberNershil from "tools/function/formatNumberNershil";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
  scales: {
    x: {
      barThickness: 6,
      maxBarThickness: 8,
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        borderDash: [2],
      },
      ticks: {
        callback: function (label, index, labels) {
          if (_.isNumber(label)) return formatNumberNershil(label);
          return label;
        },
      },
    },
  },
  animation: {
    duration: 1500,
    easing: "easeInQuad",
  },
};

export default function App({ data }) {
  // Ensure data has proper structure for Chart.js v4
  const chartData = {
    labels: data?.labels || [],
    datasets: data?.datasets || [],
  };

  return <Bar options={options} data={chartData} />;
}
