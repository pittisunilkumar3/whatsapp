import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { 
	BarChart2, 
	TrendingUp, 
	Users, 
	MessageCircle, 
	Calendar,
	Download,
	RefreshCw
} from 'lucide-react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface AnalyticsData {
	messages: number;
	delivered: number;
	read: number;
	responses: number;
	engagementRate: number;
	deliveryRate: number;
}

export const AnalyticsTab: React.FC<{ channel: 'whatsapp' | 'sms' | 'email' }> = ({ channel }) => {
	const [timeRange, setTimeRange] = useState('7d');
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
		messages: 1250,
		delivered: 1200,
		read: 980,
		responses: 450,
		engagementRate: 78,
		deliveryRate: 96
	});

	const messageData = {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Messages Sent',
				data: [150, 230, 180, 290, 200, 120, 80],
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.5)',
			},
			{
				label: 'Responses',
				data: [70, 120, 90, 150, 100, 60, 40],
				borderColor: 'rgb(34, 197, 94)',
				backgroundColor: 'rgba(34, 197, 94, 0.5)',
			}
		]
	};

	const engagementData = {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Engagement Rate',
				data: [65, 72, 68, 82, 75, 70, 78],
				backgroundColor: 'rgba(59, 130, 246, 0.8)',
			}
		]
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<Dropdown
					value={timeRange}
					onChange={setTimeRange}
					options={[
						{ label: 'Last 7 days', value: '7d' },
						{ label: 'Last 30 days', value: '30d' },
						{ label: 'Last 3 months', value: '90d' },
						{ label: 'Last year', value: '365d' }
					]}
					className="w-full sm:w-40"
				/>
				<div className="flex gap-2 w-full sm:w-auto">
					<Button variant="outline" className="flex-1 sm:flex-none">
						<Download className="w-4 h-4 mr-2" />
						Export
					</Button>
					<Button variant="outline" className="flex-1 sm:flex-none">
						<RefreshCw className="w-4 h-4 mr-2" />
						Refresh
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Card className="p-4">
					<div className="flex items-center gap-2 mb-2">
						<MessageCircle className="w-5 h-5 text-blue-500" />
						<h3 className="font-medium">Messages</h3>
					</div>
					<p className="text-2xl font-bold">{analyticsData.messages.toLocaleString()}</p>
					<p className="text-sm text-gray-500 mt-1">Total messages sent</p>
				</Card>
				<Card className="p-4">
					<div className="flex items-center gap-2 mb-2">
						<TrendingUp className="w-5 h-5 text-green-500" />
						<h3 className="font-medium">Engagement Rate</h3>
					</div>
					<p className="text-2xl font-bold">{analyticsData.engagementRate}%</p>
					<p className="text-sm text-gray-500 mt-1">Average engagement</p>
				</Card>
				<Card className="p-4">
					<div className="flex items-center gap-2 mb-2">
						<Users className="w-5 h-5 text-purple-500" />
						<h3 className="font-medium">Responses</h3>
					</div>
					<p className="text-2xl font-bold">{analyticsData.responses.toLocaleString()}</p>
					<p className="text-sm text-gray-500 mt-1">Total responses received</p>
				</Card>
			</div>

			<Card className="p-6">
				<h3 className="text-lg font-semibold mb-4">Message Activity</h3>
				<div className="h-[300px]">
					<Line
						data={messageData}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							scales: {
								y: {
									beginAtZero: true
								}
							}
						}}
					/>
				</div>
			</Card>

			<Card className="p-6">
				<h3 className="text-lg font-semibold mb-4">Engagement Overview</h3>
				<div className="h-[300px]">
					<Bar
						data={engagementData}
						options={{
							responsive: true,
							maintainAspectRatio: false,
							scales: {
								y: {
									beginAtZero: true,
									max: 100
								}
							}
						}}
					/>
				</div>
			</Card>
		</div>
	);
};