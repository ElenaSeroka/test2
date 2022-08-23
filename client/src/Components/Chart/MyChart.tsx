import React from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

import { Line } from 'react-chartjs-2'

/**
 * Renders a chart with data sent in as props.
 *
 * @param {object} props - Props sent in from App.js
 * @returns {HTMLElement} Chart - Chart that renders onClick and on Window Load.
 */
function MyChart (props) {
  console.log(props)
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
  )

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      title: {
        display: true,
        text: props.title[0]
      }
    }
  }

  let data

  if (!props.data2) {
    data = {
      labels: props.labels,
      datasets: [
        {
          fill: true,
          label: props.lowerLabelRed,
          // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
          // data: [10, 20, 30, 40, 50, 60, 70],
          data: props.data1,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        }
      ]
    }
  } else {
    data = {
      labels: props.labels,
      datasets: [
        {
          fill: true,
          label: props.lowerLabelRed,
          // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
          // data: [10, 20, 30, 40, 50, 60, 70],
          data: props.data1,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)'
        },
        {
          fill: true,
          label: props.lowerLabelBlue,
          data: props.data2,
          // data:[10, 20, 30, 40, 50, 60, 70],
          // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)'
        }
      ]
    }
  }

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  )
}

export default MyChart
