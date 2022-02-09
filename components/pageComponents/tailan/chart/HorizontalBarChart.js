import _ from "lodash"
import React from "react"

import { HorizontalBar } from "react-chartjs-2"
import formatNumber from "tools/function/formatNumber"

export const options = {
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
          callback: function(label, index, labels) {
              if(_.isNumber(label))
                return formatNumber(label)
              return label
          }
        },
      },
    ],
  },
}

export default function App({ data }) {
  return <HorizontalBar options={options} data={data} />
}
