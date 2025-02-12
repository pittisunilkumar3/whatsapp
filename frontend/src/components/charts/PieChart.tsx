import React from 'react';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	ChartOptions
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend
);

interface PieChartProps {
	data: {
		labels: string[];
		datasets: {
			data: number[];
			backgroundColor?: string[];
			borderColor?: string[];
			borderWidth?: number;
		}[];
	};
	title?: string;
	height?: number | string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title, height = 300 }) => {
	const options: ChartOptions<'pie'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: window.innerWidth < 640 ? 'bottom' : 'right',
				align: window.innerWidth < 640 ? 'center' : 'start',
				labels: {
					boxWidth: window.innerWidth < 640 ? 12 : 15,
					padding: window.innerWidth < 640 ? 10 : 15,
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
				},
				callbacks: {
					label: function(context) {
						const value = context.raw as number;
						const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
						const percentage = ((value / total) * 100).toFixed(1);
						return `${context.label}: ${percentage}%`;
					}
				}
			},
		},
		layout: {
			padding: window.innerWidth < 640 ? 10 : 20
		}
	};

	return (
		<div style={{ height, width: '100%' }}>
			<Pie options={options} data={data} />
		</div>
	);
};