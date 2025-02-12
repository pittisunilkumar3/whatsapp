import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface BarChartProps {
	data: {
		labels: string[];
		datasets: {
			label: string;
			data: number[];
			backgroundColor?: string | string[];
			borderColor?: string | string[];
			borderWidth?: number;
		}[];
	};
	title?: string;
	height?: number | string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, height = 300 }) => {
	const options: ChartOptions<'bar'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: window.innerWidth < 640 ? 'bottom' : 'top',
				align: 'start',
				labels: {
					boxWidth: 12,
					padding: 15,
					font: {
						size: window.innerWidth < 640 ? 11 : 12
					}
				}
			},
			title: {
				display: !!title,
				text: title,
				font: {
					size: window.innerWidth < 640 ? 14 : 16
				}
			},
			tooltip: {
				backgroundColor: 'white',
				titleColor: '#333333',
				bodyColor: '#333333',
				borderColor: '#e5e7eb',
				borderWidth: 1,
				padding: window.innerWidth < 640 ? 8 : 12,
				boxPadding: 6,
				usePointStyle: true,
				titleFont: {
					size: window.innerWidth < 640 ? 12 : 14
				},
				bodyFont: {
					size: window.innerWidth < 640 ? 11 : 12
				}
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: '#f3f4f6',
				},
				ticks: {
					color: '#666666',
					font: {
						size: window.innerWidth < 640 ? 10 : 12
					},
					maxTicksLimit: window.innerWidth < 640 ? 5 : 8
				},
			},
			x: {
				grid: {
					display: false,
				},
				ticks: {
					color: '#666666',
					font: {
						size: window.innerWidth < 640 ? 10 : 12
					},
					maxRotation: window.innerWidth < 640 ? 45 : 0,
					maxTicksLimit: window.innerWidth < 640 ? 6 : undefined
				},
			},
		},
		barThickness: window.innerWidth < 640 ? 'flex' : undefined,
		maxBarThickness: window.innerWidth < 640 ? 30 : 50,
	};

	return (
		<div style={{ height, width: '100%' }}>
			<Bar options={options} data={data} />
		</div>
	);
};