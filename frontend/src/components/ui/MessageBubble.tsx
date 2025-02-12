import React from 'react';
import { Check } from 'lucide-react';

interface MessageBubbleProps {
	message: string;
	timestamp: string;
	isOutgoing: boolean;
	status?: 'sent' | 'delivered' | 'read';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
	message,
	timestamp,
	isOutgoing,
	status = 'sent'
}) => {
	return (
		<div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
			<div className={`
				max-w-[70%] rounded-lg p-3 relative
				${isOutgoing 
					? 'bg-whatsapp-green text-white' 
					: 'bg-white text-primary-text'
				}
			`}>
				<p className="text-sm">{message}</p>
				<div className="flex items-center justify-end mt-1 space-x-1">
					<span className="text-xs opacity-70">{timestamp}</span>
					{isOutgoing && (
						<div className="flex">
							<Check className={`w-3 h-3 ${status === 'read' ? 'text-blue-400' : 'text-gray-200'}`} />
							<Check className={`w-3 h-3 -ml-1 ${status === 'read' ? 'text-blue-400' : 'text-gray-200'}`} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};