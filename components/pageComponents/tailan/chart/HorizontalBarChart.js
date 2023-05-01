import _ from "lodash"
import React from "react"

import { HorizontalBar } from "react-chartjs-2"
import formatNumberNershil from "tools/function/formatNumberNershil"
import formatNumber from "tools/function/formatNumber"
import { t } from "i18next"

export default function App({ data }) {
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
    },
    scales: {
      xAxes: [
        {
          barThickness: 6, // number (pixels) or 'flex'
          maxBarThickness: 8, // number (pixels)
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
          if (_.isNumber(tooltipItem?.xLabel))
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
  return <HorizontalBar options={options} data={data} />
}
