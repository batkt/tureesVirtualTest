import _ from "lodash"
import React from "react"

import { Line } from "react-chartjs-2"
import formatNumberNershil from "tools/function/formatNumberNershil"
import formatNumber from "tools/function/formatNumber"
import { t } from "i18next"

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
  },
  scales: {
    yAxes: [
      {
        ticks: {
          callback: function (label, index, labels) {
            if (_.isNumber(label)) return formatNumberNershil(label)
            return t(label)
          },
        },
      },
    ],
  },
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        const { datasetIndex } = tooltipItem
        const { datasets } = data
        if (_.isNumber(tooltipItem?.yLabel))
          return (
            t(datasets[datasetIndex].label) +
            " " +
            formatNumber(tooltipItem?.value)
          )
        return t(datasets[datasetIndex].label) + " " + tooltipItem?.value
      },
    },
  },
  animation: {
    duration: 1500,
    easing: "easeInQuad",
  },
}

export default function App({ data }) {
  return <Line options={options} data={data} />
}
