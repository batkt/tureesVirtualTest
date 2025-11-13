import _ from "lodash";
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
import formatNumberNershil from "tools/function/formatNumberNershil";
import formatNumber from "tools/function/formatNumber";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function App({ t, data }) {
  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Chart.js Horizontal Bar Chart",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const { dataset, parsed } = context;
            if (_.isNumber(parsed?.x))
              return (
                t(dataset.label) +
                " " +
                formatNumber(parsed.x)
              );
            return t(dataset.label) + " " + parsed.x;
          },
        },
      },
    },
    scales: {
      x: {
        barThickness: 6,
        maxBarThickness: 8,
      },
      y: {
        ticks: {
          callback: function (label, index, labels) {
            if (_.isNumber(label)) return formatNumberNershil(label);
            return t(label);
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInQuad",
    },
  };
  // Ensure data has proper structure for Chart.js v4
  const chartData = {
    labels: data?.labels || [],
    datasets: data?.datasets || [],
  };

  return <Bar options={options} data={chartData} />;
}
