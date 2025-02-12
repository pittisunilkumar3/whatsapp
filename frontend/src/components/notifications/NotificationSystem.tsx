import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, Phone, Mail, X } from 'lucide-react';
import { NotificationToast } from '../ui/NotificationToast';

interface Notification {
	id: string;
	type: 'message' | 'lead' | 'campaign' | 'system';
	channel?: 'whatsapp' | 'sms' | 'voice' | 'email';
	title: string;
	message: string;
	timestamp: Date;
	read: boolean;
}

const mockNotifications: Notification[] = [
	{
		id: '1',
		type: 'message',
		channel: 'whatsapp',
		title: 'New Message',
		message: 'John Smith replied to your message',
		timestamp: new Date(),
		read: false
	},
	{
		id: '2',
		type: 'lead',
		title: 'Lead Update',
		message: 'New lead assigned to you',
		timestamp: new Date(),
		read: false
	}
];

export const NotificationSystem: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
	const [showDropdown, setShowDropdown] = useState(false);
	const [lastToast, setLastToast] = useState<Notification | null>(null);

	useEffect(() => {
		// Simulate WebSocket connection
		const ws = {
			onmessage: (event: any) => {
				const notification: Notification = {
					id: Date.now().toString(),
					type: 'message',
					channel: 'whatsapp',
					title: 'Real-time Update',
					message: 'New activity detected',
					timestamp: new Date(),
					read: false
				};
				handleNewNotification(notification);
			}
		};

		// Simulate incoming notifications
		const interval = setInterval(() => {
			ws.onmessage({ data: 'new_message' });
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	const handleNewNotification = (notification: Notification) => {
		setNotifications(prev => [notification, ...prev]);
		setLastToast(notification);
		setTimeout(() => setLastToast(null), 5000);
	};

	const getChannelIcon = (channel?: string) => {
		switch (channel) {
			case 'whatsapp':
				return <MessageSquare className="w-4 h-4 text-whatsapp-green" />;
			case 'sms':
				return <MessageSquare className="w-4 h-4 text-blue-500" />;
			case 'voice':
				return <Phone className="w-4 h-4 text-orange-500" />;
			case 'email':
				return <Mail className="w-4 h-4 text-purple-500" />;
			default:
				return null;
		}
	};

	return (
		<>
			<div className="relative">
				<button
					className="relative p-2 rounded-full hover:bg-gray-100"
					onClick={() => setShowDropdown(!showDropdown)}
				>
					<Bell className="w-6 h-6" />
					{notifications.some(n => !n.read) && (
						<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
					)}
				</button>

				<AnimatePresence>
					{showDropdown && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
						>
							<div className="p-4 border-b">
								<h3 className="font-medium">Notifications</h3>
							</div>
							<div className="max-h-96 overflow-y-auto">
								{notifications.map(notification => (
									<div
										key={notification.id}
										className={`p-4 border-b hover:bg-gray-50 ${
											!notification.read ? 'bg-gray-50' : ''
										}`}
									>
										<div className="flex items-start">
											{getChannelIcon(notification.channel)}
											<div className="ml-3 flex-1">
												<p className="font-medium text-sm">{notification.title}</p>
												<p className="text-secondary-text text-sm">
													{notification.message}
												</p>
												<p className="text-xs text-gray-400 mt-1">
													{notification.timestamp.toLocaleTimeString()}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{lastToast && (
					<NotificationToast
						title={lastToast.title}
						message={lastToast.message}
						icon={getChannelIcon(lastToast.channel)}
						onClose={() => setLastToast(null)}
					/>
				)}
			</AnimatePresence>
		</>
	);
};