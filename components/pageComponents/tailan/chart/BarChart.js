import React from "react"
import { Bar } from "react-chartjs-2"
import formatNumberNershil from "tools/function/formatNumberNershil"

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      width: 2,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
  scales: {
    xAxes: [
      {
        barThickness: 6, // number (pixels) or 'flex'
        maxBarThickness: 8, // number (pixels),
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          borderDash: [2],
        },
        ticks: {
          callback: function (label, index, labels) {
            if (_.isNumber(label)) return formatNumberNershil(label)
            return label
          },
        },
      },
    ],
  },
  animation: {
    duration: 1500,
    easing: "easeInQuad",
  },
}

export default function App({ data }) {
  return <Bar options={options} data={data} />
}
