import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

interface LineChartProps {
	data: {
		labels: string[];
		datasets: {
			label: string;
			data: number[];
			borderColor?: string;
			backgroundColor?: string;
		}[];
	};
	title?: string;
	height?: number | string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title, height = 300 }) => {
	const options: ChartOptions<'line'> = {
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
		elements: {
			line: {
				tension: 0.3,
			},
			point: {
				radius: window.innerWidth < 640 ? 3 : 4,
				hoverRadius: window.innerWidth < 640 ? 4 : 6,
			},
		},
	};

	return (
		<div style={{ height, width: '100%' }}>
			<Line options={options} data={data} />
		</div>
	);
};