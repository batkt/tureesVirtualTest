import _ from "lodash";
import React from "react";
import { Line } from "react-chartjs-2";
import formatNumberNershil from "tools/function/formatNumberNershil";
import formatNumber from "tools/function/formatNumber";
import { t } from "i18next";

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const { datasetIndex, dataset, parsed } = context;
          if (_.isNumber(parsed?.y))
            return (
              t(dataset.label) +
              " " +
              formatNumber(parsed.y)
            );
          return t(dataset.label) + " " + parsed.y;
        },
      },
    },
  },
  scales: {
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

export default function App({ data }) {
  // Ensure data has proper structure for Chart.js v4
  const chartData = {
    labels: data?.labels || [],
    datasets: data?.datasets || [],
  };

  return <Line options={options} data={chartData} />;
}
