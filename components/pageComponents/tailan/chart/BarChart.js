import React from 'react';
import { Bar } from 'react-chartjs-2';

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      width:2
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
  scales: {
    xAxes: [{
      barThickness: 6,  // number (pixels) or 'flex'
      maxBarThickness: 8, // number (pixels),
      gridLines: {
        display: false
      },
    }],
    yAxes:[
      {
        gridLines:{
          borderDash:[2]
        }
      }
    ]
  }
};

export default function App({data}) {
  return <Bar options={options} data={data} />;
}
