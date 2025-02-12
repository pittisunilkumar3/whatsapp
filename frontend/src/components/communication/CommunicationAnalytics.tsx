import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { BarChart } from '../charts/BarChart';
import { MessageSquare, Phone, Mail, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const channelData = {
	metrics: [
		{
			title: 'Total Messages',
			value: '45,678',
			change: '+12.5%',
			isPositive: true
		},
		{
			title: 'Response Rate',
			value: '92.3%',
			change: '+5.1%',
			isPositive: true
		},
		{
			title: 'Avg Response Time',
			value: '15m',
			change: '-2.4%',
			isPositive: true
		},
		{
			title: 'Conversion Rate',
			value: '24.8%',
			change: '+3.2%',
			isPositive: true
		}
	],
	channelDistribution: {
		labels: ['WhatsApp', 'SMS', 'Voice', 'Email'],
		data: [45, 25, 15, 15],
		colors: ['#25D366', '#3B82F6', '#F97316', '#A855F7']
	},
	responseTime: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'WhatsApp',
				data: [15, 12, 18, 14, 13, 16, 15],
				borderColor: '#25D366'
			},
			{
				label: 'SMS',
				data: [20, 18, 22, 17, 19, 21, 20],
				borderColor: '#3B82F6'
			},
			{
				label: 'Voice',
				data: [25, 22, 28, 24, 23, 26, 25],
				borderColor: '#F97316'
			},
			{
				label: 'Email',
				data: [35, 32, 38, 34, 33, 36, 35],
				borderColor: '#A855F7'
			}
		]
	},
	conversionsByChannel: {
		labels: ['WhatsApp', 'SMS', 'Voice', 'Email'],
		data: [28, 22, 18, 24]
	}
};

export const CommunicationAnalytics: React.FC = () => {
	const [dateRange, setDateRange] = useState('7d');

	return (
		<div className="space-y-6">
			{/* Metrics Grid */}
			<div className="grid grid-cols-4 gap-6">
				{channelData.metrics.map((metric) => (
					<Card key={metric.title} className="p-6">
						<p className="text-secondary-text">{metric.title}</p>
						<div className="mt-2 flex items-baseline">
							<h3 className="text-2xl font-semibold">{metric.value}</h3>
							<span className={`ml-2 flex items-center text-sm ${
								metric.isPositive ? 'text-green-600' : 'text-red-600'
							}`}>
								{metric.isPositive ? (
									<ArrowUpRight className="w-4 h-4 mr-1" />
								) : (
									<ArrowDownRight className="w-4 h-4 mr-1" />
								)}
								{metric.change}
							</span>
						</div>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-2 gap-6">
				{/* Channel Distribution */}
				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Channel Distribution</h3>
					<PieChart
						labels={channelData.channelDistribution.labels}
						data={channelData.channelDistribution.data}
						colors={channelData.channelDistribution.colors}
					/>
				</Card>

				{/* Response Time by Channel */}
				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Response Time by Channel</h3>
					<LineChart
						labels={channelData.responseTime.labels}
						datasets={channelData.responseTime.datasets}
					/>
				</Card>

				{/* Conversions by Channel */}
				<Card className="col-span-2 p-6">
					<h3 className="text-lg font-semibold mb-4">Conversions by Channel</h3>
					<BarChart
						labels={channelData.conversionsByChannel.labels}
						data={channelData.conversionsByChannel.data}
						label="Conversion Rate (%)"
					/>
				</Card>
			</div>
		</div>
	);
};