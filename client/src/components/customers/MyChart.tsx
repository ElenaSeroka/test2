import React from 'react';
import GetButton from './GetButton.tsx';
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


} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

function MyChart(props) {
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
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};
// const labels = ['boo', 'February', 'March', 'April', 'May', 'June', 'July'];



const data = {
    labels: props.labels,
    datasets: [
        {
            fill: true,
            label: 'Dataset 1',
            // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            // data: [10, 20, 30, 40, 50, 60, 70],
            data: props.data1,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            fill: true,
            label: 'Dataset 2',
            data: props.data2,
            // data:[10, 20, 30, 40, 50, 60, 70],
            // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

    return (
        <div>
        <Line options={options} data={data} />
        {/* <GetButton /> */}
        </div>
    )
}

export default MyChart;