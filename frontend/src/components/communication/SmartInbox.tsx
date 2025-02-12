import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { MessageBubble } from '../ui/MessageBubble';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { MessageSquare, Phone, Mail, Search, Star, Clock, AlertTriangle } from 'lucide-react';

interface Conversation {
	id: string;
	contact: {
		name: string;
		channel: 'whatsapp' | 'sms' | 'voice' | 'email';
		status: 'online' | 'offline';
	};
	lastMessage: {
		content: string;
		timestamp: string;
		isRead: boolean;
	};
	priority: 'high' | 'medium' | 'low';
	sentiment: 'positive' | 'neutral' | 'negative';
}

const mockConversations: Conversation[] = [
	{
		id: '1',
		contact: {
			name: 'John Smith',
			channel: 'whatsapp',
			status: 'online'
		},
		lastMessage: {
			content: 'I\'m interested in learning more about your services.',
			timestamp: '10:30 AM',
			isRead: false
		},
		priority: 'high',
		sentiment: 'positive'
	},
	{
		id: '2',
		contact: {
			name: 'Sarah Johnson',
			channel: 'email',
			status: 'offline'
		},
		lastMessage: {
			content: 'Could you please provide pricing details?',
			timestamp: '9:45 AM',
			isRead: true
		},
		priority: 'medium',
		sentiment: 'neutral'
	}
];

const SmartFolders = [
	{ id: 'hot', name: 'Hot Leads', icon: Star, count: 5 },
	{ id: 'urgent', name: 'Urgent Replies', icon: AlertTriangle, count: 3 },
	{ id: 'followup', name: 'Follow-up', icon: Clock, count: 8 }
];

const SentimentIndicator = ({ sentiment }: { sentiment: Conversation['sentiment'] }) => {
	const colors = {
		positive: 'bg-green-100 text-green-800',
		neutral: 'bg-gray-100 text-gray-800',
		negative: 'bg-red-100 text-red-800'
	};
	
	return (
		<span className={`px-2 py-1 rounded-full text-xs ${colors[sentiment]}`}>
			{sentiment}
		</span>
	);
};

const ChannelIcon = ({ channel }: { channel: Conversation['contact']['channel'] }) => {
	const icons = {
		whatsapp: <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-whatsapp-green" />,
		sms: <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />,
		voice: <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />,
		email: <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
	};
	return icons[channel];
};

export const SmartInbox: React.FC = () => {
	const [selectedFolder, setSelectedFolder] = useState('all');
	const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
	const [selectedChannel, setSelectedChannel] = useState<'all' | 'whatsapp' | 'sms' | 'voice' | 'email'>('all');

	return (
		<div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)]">
			{/* Smart Folders - Hidden on mobile, shown in sidebar on larger screens */}
			<div className="hidden lg:block w-64 border-r p-4 space-y-4">
				<div className="relative">
					<Input
						placeholder="Search..."
						className="pl-10 text-sm"
					/>
					<Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
				</div>

				<div className="flex gap-2 mt-4 mb-2 overflow-x-auto pb-2">
					{['all', 'whatsapp', 'sms', 'voice', 'email'].map((channel) => (
						<Button
							key={channel}
							size="sm"
							variant={selectedChannel === channel ? 'default' : 'ghost'}
							onClick={() => setSelectedChannel(channel as typeof selectedChannel)}
							className="whitespace-nowrap text-xs"
						>
							{channel !== 'all' && <ChannelIcon channel={channel as Conversation['contact']['channel']} />}
							{channel === 'all' && <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />}
						</Button>
					))}
				</div>

				<div className="space-y-2">
					{SmartFolders.map((folder) => (
						<button
							key={folder.id}
							className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 text-sm ${
								selectedFolder === folder.id ? 'bg-gray-100' : ''
							}`}
							onClick={() => setSelectedFolder(folder.id)}
						>
							<div className="flex items-center">
								<folder.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
								<span>{folder.name}</span>
							</div>
							<span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
								{folder.count}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Mobile Channel Filter */}
			<div className="lg:hidden p-4 border-b">
				<div className="flex gap-2 overflow-x-auto pb-2">
					{['all', 'whatsapp', 'sms', 'voice', 'email'].map((channel) => (
						<Button
							key={channel}
							size="sm"
							variant={selectedChannel === channel ? 'default' : 'ghost'}
							onClick={() => setSelectedChannel(channel as typeof selectedChannel)}
							className="whitespace-nowrap text-xs"
						>
							{channel !== 'all' && <ChannelIcon channel={channel as Conversation['contact']['channel']} />}
							{channel === 'all' && <MessageSquare className="w-3 h-3" />}
						</Button>
					))}
				</div>
			</div>

			{/* Conversation List - Full width on mobile, fixed width on desktop */}
			<div className={`${selectedConversation ? 'hidden' : 'block'} lg:block lg:w-96 border-r`}>
				<div className="p-4 space-y-2">
					{mockConversations
						.filter(conv => selectedChannel === 'all' || conv.contact.channel === selectedChannel)
						.map((conversation) => (
							<Card
								key={conversation.id}
								className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 ${
									selectedConversation === conversation.id ? 'bg-gray-50' : ''
								}`}
								onClick={() => setSelectedConversation(conversation.id)}
							>
								<div className="flex justify-between items-start gap-2">
									<div className="flex items-center min-w-0">
										<ChannelIcon channel={conversation.contact.channel} />
										<div className="ml-3 min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<h3 className="font-medium text-sm sm:text-base">{conversation.contact.name}</h3>
												<SentimentIndicator sentiment={conversation.sentiment} />
											</div>
											<p className="text-xs sm:text-sm text-gray-500 truncate">
												{conversation.lastMessage.content}
											</p>
										</div>
									</div>
									<span className="text-xs text-gray-400 whitespace-nowrap">
										{conversation.lastMessage.timestamp}
									</span>
								</div>
							</Card>
						))}
				</div>
			</div>

			{/* Conversation View - Hidden on mobile when no conversation selected */}
			<div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
				{selectedConversation ? (
					<>
						<div className="p-3 sm:p-4 border-b flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									className="lg:hidden"
									onClick={() => setSelectedConversation(null)}
								>
									Back
								</Button>
								<h2 className="font-semibold text-sm sm:text-base">
									{mockConversations.find(c => c.id === selectedConversation)?.contact.name}
								</h2>
							</div>
						</div>
						<div className="flex-1 p-3 sm:p-4 overflow-auto">
							{/* Messages would go here */}
						</div>
						<div className="p-3 sm:p-4 border-t">
							<div className="flex gap-2">
								<Input
									placeholder="Type a message..."
									className="flex-1 text-sm"
								/>
								<Button size="sm">Send</Button>
							</div>
						</div>
					</>
				) : (
					<div className="flex-1 hidden lg:flex items-center justify-center text-gray-400 text-sm">
						Select a conversation to start messaging
					</div>
				)}
			</div>
		</div>
	);
};