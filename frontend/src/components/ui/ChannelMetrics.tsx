import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Tooltip } from './Tooltip';
import { MessageSquare, Phone, Mail } from 'lucide-react';
import { type ChannelMetrics as ChannelMetricsType } from '../../types/dashboard';

interface ChannelMetricsProps {
	channel: string;
	metrics: ChannelMetricsType;
	onViewDetails?: () => void;
}

const channelIcons = {
	whatsapp: MessageSquare,
	sms: MessageSquare,
	voice: Phone,
	email: Mail
};

const channelColors = {
	whatsapp: 'whatsapp-green',
	sms: 'blue-500',
	voice: 'purple-500',
	email: 'emerald-500'
};

export const ChannelMetrics: React.FC<ChannelMetricsProps> = ({
	channel,
	metrics,
	onViewDetails
}) => {
	const Icon = channelIcons[channel as keyof typeof channelIcons] || MessageSquare;
	const color = channelColors[channel as keyof typeof channelColors] || 'blue-500';

	const getMetricItems = () => {
		if (channel === 'voice') {
			return [
				{ label: 'Calls Made', value: metrics.callsMade },
				{ label: 'Answer Rate', value: `${metrics.answerRate}%` },
				{ label: 'Avg Duration', value: metrics.avgCallDuration }
			];
		} else if (channel === 'email') {
			return [
				{ label: 'Sent', value: metrics.emailsSent },
				{ label: 'Open Rate', value: `${metrics.openRate}%` },
				{ label: 'Click Rate', value: `${metrics.clickRate}%` }
			];
		} else {
			return [
				{ label: 'Sent', value: metrics.messagesSent },
				{ label: 'Response Rate', value: `${metrics.responseRate}%` },
				{ label: 'Avg Response', value: metrics.avgResponseTime }
			];
		}
	};

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
					<div className={`p-2 rounded-lg bg-${color} bg-opacity-10 mr-3`}>
						<Icon className={`w-5 h-5 text-${color}`} />
					</div>
					<h3 className="font-semibold text-primary-text">
						{channel.charAt(0).toUpperCase() + channel.slice(1)}
					</h3>
				</div>
				{onViewDetails && (
					<Tooltip content="View details">
						<Button variant="ghost" size="sm" onClick={onViewDetails}>
							View
						</Button>
					</Tooltip>
				)}
			</div>
			<div className="space-y-3">
				{getMetricItems().map((item) => (
					<div key={item.label} className="flex justify-between items-center">
						<span className="text-secondary-text">{item.label}</span>
						<span className="font-semibold">{item.value?.toLocaleString()}</span>
					</div>
				))}
			</div>
		</Card>
	);
};