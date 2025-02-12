import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { HeatmapChart } from '../charts/HeatmapChart';
import { Button } from '../ui/Button';
import { DateRangePicker } from '../ui/DateRangePicker';
import { MessageSquare, Phone, Mail } from 'lucide-react';

interface ChannelMetrics {
	messagesSent: number;
	responses: number;
	conversions: number;
	avgResponseTime: string;
	sentiment: {
		positive: number;
		neutral: number;
		negative: number;
	};
}

const mockData: Record<string, ChannelMetrics> = {
	whatsapp: {
		messagesSent: 1234,
		responses: 987,
		conversions: 123,
		avgResponseTime: '5m',
		sentiment: { positive: 65, neutral: 25, negative: 10 }
	},
	sms: {
		messagesSent: 856,
		responses: 654,
		conversions: 89,
		avgResponseTime: '15m',
		sentiment: { positive: 55, neutral: 35, negative: 10 }
	},
	voice: {
		messagesSent: 432,
		responses: 321,
		conversions: 45,
		avgResponseTime: '2m',
		sentiment: { positive: 70, neutral: 20, negative: 10 }
	},
	email: {
		messagesSent: 765,
		responses: 432,
		conversions: 67,
		avgResponseTime: '2h',
		sentiment: { positive: 50, neutral: 40, negative: 10 }
	}
};

export const CommunicationAnalytics: React.FC = () => {
	const [selectedChannel, setSelectedChannel] = useState<'all' | 'whatsapp' | 'sms' | 'voice' | 'email'>('all');
	const [dateRange, setDateRange] = useState({ start: '', end: '' });

	const channels = [
		{ id: 'all', label: 'All Channels', icon: MessageSquare },
		{ id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
		{ id: 'sms', label: 'SMS', icon: MessageSquare },
		{ id: 'voice', label: 'Voice', icon: Phone },
		{ id: 'email', label: 'Email', icon: Mail }
	];

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-lg font-semibold">Communication Analytics</h2>
					<p className="text-secondary-text mt-1">
						Performance metrics across all channels
					</p>
				</div>
				<DateRangePicker
					startDate={dateRange.start}
					endDate={dateRange.end}
					onChange={setDateRange}
				/>
			</div>

			<div className="flex space-x-2">
				{channels.map(channel => (
					<Button
						key={channel.id}
						variant={selectedChannel === channel.id ? 'default' : 'ghost'}
						onClick={() => setSelectedChannel(channel.id as typeof selectedChannel)}
					>
						<channel.icon className="w-4 h-4 mr-2" />
						{channel.label}
					</Button>
				))}
			</div>

			<div className="grid grid-cols-4 gap-6">
				{selectedChannel !== 'all' && (
					<>
						<Card className="p-6">
							<h3 className="text-sm font-medium text-secondary-text">Messages Sent</h3>
							<p className="text-2xl font-semibold mt-2">
								{mockData[selectedChannel].messagesSent}
							</p>
						</Card>
						<Card className="p-6">
							<h3 className="text-sm font-medium text-secondary-text">Response Rate</h3>
							<p className="text-2xl font-semibold mt-2">
								{((mockData[selectedChannel].responses / mockData[selectedChannel].messagesSent) * 100).toFixed(1)}%
							</p>
						</Card>
						<Card className="p-6">
							<h3 className="text-sm font-medium text-secondary-text">Avg Response Time</h3>
							<p className="text-2xl font-semibold mt-2">
								{mockData[selectedChannel].avgResponseTime}
							</p>
						</Card>
						<Card className="p-6">
							<h3 className="text-sm font-medium text-secondary-text">Conversion Rate</h3>
							<p className="text-2xl font-semibold mt-2">
								{((mockData[selectedChannel].conversions / mockData[selectedChannel].messagesSent) * 100).toFixed(1)}%
							</p>
						</Card>
					</>
				)}
			</div>

			<div className="grid grid-cols-2 gap-6">
				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Engagement Over Time</h3>
					<LineChart data={[]} /> {/* Add actual data */}
				</Card>
				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
					<PieChart data={[]} /> {/* Add actual data */}
				</Card>
			</div>
		</div>
	);
};