import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	MessageSquare,
	Phone,
	Mail,
	MessageCircle,
	Star,
	Clock,
	Filter,
	Search,
	MoreVertical
} from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { StatusPill } from './StatusPill';

interface Message {
	id: string;
	channel: 'whatsapp' | 'sms' | 'voice' | 'email';
	sender: {
		name: string;
		avatar?: string;
	};
	content: string;
	timestamp: string;
	status: 'unread' | 'read' | 'replied' | 'archived';
	priority?: 'high' | 'medium' | 'low';
}

interface SmartInboxProps {
	messages: Message[];
	onMessageSelect: (message: Message) => void;
	onMessageAction: (message: Message, action: string) => void;
	selectedMessageId?: string;
	className?: string;
}

const channelIcons = {
	whatsapp: MessageSquare,
	sms: MessageCircle,
	voice: Phone,
	email: Mail,
};

const channelColors = {
	whatsapp: 'whatsapp-green',
	sms: 'purple-500',
	voice: 'orange-500',
	email: 'blue-500',
};

export const SmartInbox: React.FC<SmartInboxProps> = ({
	messages,
	onMessageSelect,
	onMessageAction,
	selectedMessageId,
	className = '',
}) => {
	const [searchQuery, setSearchQuery] = React.useState('');
	const [filter, setFilter] = React.useState<string | null>(null);

	const filteredMessages = messages.filter(message => {
		const matchesSearch = message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			message.sender.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter = !filter || message.channel === filter;
		return matchesSearch && matchesFilter;
	});

	return (
		<div className={`flex flex-col h-full ${className}`}>
			{/* Header */}
			<div className="p-4 border-b">
				<div className="flex items-center space-x-4">
					<div className="relative flex-1">
						<Input
							placeholder="Search messages..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
						<Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
					</div>
					<Button variant="ghost">
						<Filter className="w-5 h-5" />
					</Button>
				</div>

				{/* Channel Filters */}
				<div className="flex space-x-2 mt-4">
					{Object.entries(channelIcons).map(([channel, Icon]) => (
						<Button
							key={channel}
							variant={filter === channel ? 'primary' : 'ghost'}
							onClick={() => setFilter(filter === channel ? null : channel)}
							className="px-3"
						>
							<Icon className="w-5 h-5 mr-2" />
							{channel.charAt(0).toUpperCase() + channel.slice(1)}
						</Button>
					))}
				</div>
			</div>

			{/* Message List */}
			<div className="flex-1 overflow-y-auto">
				<AnimatePresence>
					{filteredMessages.map((message) => {
						const Icon = channelIcons[message.channel];
						const color = channelColors[message.channel];

						return (
							<motion.div
								key={message.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className={`
									p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors
									${selectedMessageId === message.id ? 'bg-gray-50' : ''}
								`}
								onClick={() => onMessageSelect(message)}
							>
								<div className="flex items-start space-x-4">
									{message.sender.avatar ? (
										<img
											src={message.sender.avatar}
											alt={message.sender.name}
											className="w-10 h-10 rounded-full"
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
											{message.sender.name.charAt(0)}
										</div>
									)}
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<span className="font-medium">{message.sender.name}</span>
												<Icon className={`w-4 h-4 text-${color}`} />
											</div>
											<div className="flex items-center space-x-2">
												{message.priority === 'high' && (
													<Star className="w-4 h-4 text-yellow-500" />
												)}
												<span className="text-sm text-secondary-text">
													{new Date(message.timestamp).toLocaleTimeString()}
												</span>
											</div>
										</div>
										<p className="mt-1 text-sm text-secondary-text truncate">
											{message.content}
										</p>
										<div className="mt-2 flex items-center justify-between">
											<StatusPill status={message.status} />
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													onMessageAction(message, 'more');
												}}
											>
												<MoreVertical className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
};