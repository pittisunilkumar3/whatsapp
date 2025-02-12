import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from '../../components/ui/MetricCard';
import { ChannelMetrics } from '../../components/ui/ChannelMetrics';
import { MessageSquare, Users, TrendingUp, ListChecks } from 'lucide-react';
import { type Channel, type DashboardMetric, type ChannelMetrics as ChannelMetricsType } from '../../types/dashboard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const metrics: DashboardMetric[] = [
	{
		label: 'Messages Sent Today',
		value: '85/100',
		change: '+15%',
		trend: 'up',
		icon: MessageSquare,
		color: 'text-whatsapp-green'
	},
	{
		label: 'Conversation Score',
		value: '78%',
		change: '+5%',
		trend: 'up',
		icon: TrendingUp,
		color: 'text-blue-500'
	},
	{
		label: 'Leads Converted',
		value: '12/45',
		change: '+8%',
		trend: 'up',
		icon: Users,
		color: 'text-purple-500'
	},
	{
		label: 'Tasks Completed',
		value: '15 Active',
		change: '+3',
		trend: 'up',
		icon: ListChecks,
		color: 'text-orange-500'
	}
];

const channelMetrics: Record<string, ChannelMetricsType> = {
	whatsapp: {
		messagesSent: 45,
		responseRate: 84,
		avgResponseTime: '5m',
		conversionRate: 82
	},
	sms: {
		messagesSent: 25,
		responseRate: 72,
		avgResponseTime: '15m',
		conversionRate: 75
	},
	voice: {
		callsMade: 15,
		answerRate: 80,
		avgCallDuration: '2m',
		conversionRate: 85
	},
	email: {
		emailsSent: 30,
		openRate: 66,
		clickRate: 15,
		conversionRate: 78
	}
};

export const EmployeeDashboard: React.FC = () => {
	const [selectedChannel, setSelectedChannel] = useState<Channel>('all');

	return (
		<div className="p-6 space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-2xl font-semibold text-primary-text">Dashboard</h1>
						<p className="text-secondary-text mt-1">
							Your daily performance overview
						</p>
					</div>
				</div>

				<div className="flex space-x-2 mb-6">
					{['all', 'whatsapp', 'sms', 'voice', 'email'].map((channel) => (
						<Button
							key={channel}
							variant={selectedChannel === channel ? 'default' : 'ghost'}
							onClick={() => setSelectedChannel(channel as Channel)}
						>
							{channel.charAt(0).toUpperCase() + channel.slice(1)}
						</Button>
					))}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
					{metrics.map((metric, index) => (
						<MetricCard
							key={metric.label}
							title={metric.label}
							value={metric.value}
							icon={metric.icon}
							change={metric.change}
							isPositive={metric.trend === 'up'}
							color={metric.color}
							index={index}
						/>
					))}
				</div>

				{selectedChannel !== 'all' ? (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<ChannelMetrics
							channel={selectedChannel}
							metrics={channelMetrics[selectedChannel]}
							onViewDetails={() => {}}
						/>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{Object.entries(channelMetrics).map(([channel, metrics]) => (
							<ChannelMetrics
								key={channel}
								channel={channel}
								metrics={metrics}
								onViewDetails={() => {}}
							/>
						))}
					</div>
				)}
			</motion.div>
		</div>
	);
};
