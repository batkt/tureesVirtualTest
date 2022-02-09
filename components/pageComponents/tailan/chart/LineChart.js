import _ from 'lodash';
import React from 'react';

import { Line } from 'react-chartjs-2';
import formatNumber from 'tools/function/formatNumber'

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
  scales: {
    yAxes: [
        {
            ticks: {
                callback: function(label, index, labels) {
                    if(_.isNumber(label))
                      return formatNumber(label)
                    return label
                }
            },
        }
    ]
  },
  tooltips: {
    callbacks: {
        label: function(tooltipItem, data) {
          const {datasetIndex} = tooltipItem
          const {datasets} = data
          if(_.isNumber(tooltipItem?.yLabel))
            return datasets[datasetIndex].label + " " + formatNumber(tooltipItem?.value)
          return datasets[datasetIndex].label + " " + tooltipItem?.value
        }
    }
}
};

export default function App({data}) {
  return <Line options={options} data={data} />;
}
