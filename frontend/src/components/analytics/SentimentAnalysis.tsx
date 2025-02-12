import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { Dropdown } from '../ui/Dropdown';
import { MessageSquare, Phone, Mail, TrendingUp } from 'lucide-react';

interface SentimentData {
	channel: string;
	positive: number;
	neutral: number;
	negative: number;
	trend: {
		dates: string[];
		sentiment: number[];
	};
}

const mockData: Record<string, SentimentData> = {
	whatsapp: {
		channel: 'WhatsApp',
		positive: 65,
		neutral: 25,
		negative: 10,
		trend: {
			dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
			sentiment: [75, 72, 78, 82, 80]
		}
	},
	sms: {
		channel: 'SMS',
		positive: 58,
		neutral: 32,
		negative: 10,
		trend: {
			dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
			sentiment: [70, 68, 72, 75, 73]
		}
	},
	voice: {
		channel: 'Voice',
		positive: 72,
		neutral: 20,
		negative: 8,
		trend: {
			dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
			sentiment: [80, 78, 82, 85, 83]
		}
	},
	email: {
		channel: 'Email',
		positive: 55,
		neutral: 35,
		negative: 10,
		trend: {
			dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
			sentiment: [65, 62, 68, 70, 68]
		}
	}
};

export const SentimentAnalysis: React.FC = () => {
	const [selectedChannel, setSelectedChannel] = useState('all');
	const [timeRange, setTimeRange] = useState('7d');

	const channels = [
		{ label: 'All Channels', value: 'all' },
		{ label: 'WhatsApp', value: 'whatsapp' },
		{ label: 'SMS', value: 'sms' },
		{ label: 'Voice', value: 'voice' },
		{ label: 'Email', value: 'email' }
	];

	const timeRanges = [
		{ label: 'Last 7 Days', value: '7d' },
		{ label: 'Last 30 Days', value: '30d' },
		{ label: 'Last 90 Days', value: '90d' }
	];

	const getAggregatedData = () => {
		if (selectedChannel === 'all') {
			const channels = Object.values(mockData);
			return {
				positive: Math.round(channels.reduce((acc, c) => acc + c.positive, 0) / channels.length),
				neutral: Math.round(channels.reduce((acc, c) => acc + c.neutral, 0) / channels.length),
				negative: Math.round(channels.reduce((acc, c) => acc + c.negative, 0) / channels.length)
			};
		}
		const data = mockData[selectedChannel];
		return {
			positive: data.positive,
			neutral: data.neutral,
			negative: data.negative
		};
	};

	const data = getAggregatedData();

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold">Sentiment Analysis</h2>
				<div className="flex space-x-4">
					<Dropdown
						value={selectedChannel}
						onChange={setSelectedChannel}
						options={channels}
						label="Channel"
					/>
					<Dropdown
						value={timeRange}
						onChange={setTimeRange}
						options={timeRanges}
						label="Time Range"
					/>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-6">
				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-medium">Positive</h3>
						<span className="text-green-500">{data.positive}%</span>
					</div>
					<ProgressBar progress={data.positive} color="green" />
				</Card>
				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-medium">Neutral</h3>
						<span className="text-blue-500">{data.neutral}%</span>
					</div>
					<ProgressBar progress={data.neutral} color="blue" />
				</Card>
				<Card className="p-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-medium">Negative</h3>
						<span className="text-red-500">{data.negative}%</span>
					</div>
					<ProgressBar progress={data.negative} color="red" />
				</Card>
			</div>

			<div className="grid grid-cols-2 gap-6">
				<Card className="p-6">
					<h3 className="font-medium mb-4">Sentiment Distribution</h3>
					<PieChart
						data={[data.positive, data.neutral, data.negative]}
						labels={['Positive', 'Neutral', 'Negative']}
						colors={['#10B981', '#3B82F6', '#EF4444']}
					/>
				</Card>

				<Card className="p-6">
					<h3 className="font-medium mb-4">Sentiment Trend</h3>
					<LineChart
						labels={mockData[selectedChannel === 'all' ? 'whatsapp' : selectedChannel].trend.dates}
						datasets={[
							{
								label: 'Sentiment Score',
								data: mockData[selectedChannel === 'all' ? 'whatsapp' : selectedChannel].trend.sentiment,
								borderColor: '#10B981'
							}
						]}
					/>
				</Card>
			</div>
		</div>
	);
};

const ProgressBar: React.FC<{ progress: number; color: string }> = ({ progress, color }) => (
	<div className="w-full bg-gray-200 rounded-full h-2">
		<div
			className={`h-2 rounded-full bg-${color}-500`}
			style={{ width: `${progress}%` }}
		/>
	</div>
);