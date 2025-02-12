import React from 'react';
import { 
	MessageSquare,
	Phone,
	Mail,
	MessageCircle
} from 'lucide-react';

type Channel = 'whatsapp' | 'sms' | 'voice' | 'email';

interface ChannelIconProps {
	channel: Channel;
	size?: 'sm' | 'md' | 'lg';
	showLabel?: boolean;
	className?: string;
}

const channelConfig = {
	whatsapp: {
		icon: MessageSquare,
		label: 'WhatsApp',
		color: 'whatsapp-green',
	},
	sms: {
		icon: MessageCircle,
		label: 'SMS',
		color: 'purple-500',
	},
	voice: {
		icon: Phone,
		label: 'Voice',
		color: 'orange-500',
	},
	email: {
		icon: Mail,
		label: 'Email',
		color: 'blue-500',
	},
};

const sizeConfig = {
	sm: {
		icon: 'w-4 h-4',
		container: 'p-1',
		text: 'text-xs',
	},
	md: {
		icon: 'w-5 h-5',
		container: 'p-2',
		text: 'text-sm',
	},
	lg: {
		icon: 'w-6 h-6',
		container: 'p-3',
		text: 'text-base',
	},
};

export const ChannelIcon: React.FC<ChannelIconProps> = ({
	channel,
	size = 'md',
	showLabel = false,
	className = '',
}) => {
	const config = channelConfig[channel];
	const sizeClasses = sizeConfig[size];
	const Icon = config.icon;

	return (
		<div className={`inline-flex items-center ${className}`}>
			<div
				className={`
					rounded-lg ${sizeClasses.container}
					bg-${config.color} bg-opacity-10
				`}
			>
				<Icon className={`${sizeClasses.icon} text-${config.color}`} />
			</div>
			{showLabel && (
				<span className={`ml-2 font-medium ${sizeClasses.text} text-primary-text`}>
					{config.label}
				</span>
			)}
		</div>
	);
};