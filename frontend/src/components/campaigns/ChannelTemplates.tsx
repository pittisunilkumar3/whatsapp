import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface ChannelTemplatesProps {
	channel: 'whatsapp' | 'sms' | 'voice' | 'email';
	onChange: (data: any) => void;
	values: any;
}

export const ChannelTemplates: React.FC<ChannelTemplatesProps> = ({
	channel,
	onChange,
	values,
}) => {
	const renderWhatsAppTemplate = () => (
		<div className="space-y-4">
			<Input
				label="Message Template"
				value={values.messageTemplate}
				onChange={(e) => onChange({ ...values, messageTemplate: e.target.value })}
				placeholder="Enter your WhatsApp message template"
				helperText="Use {name} for recipient's name"
			/>
			<Input
				label="Button Text (Optional)"
				value={values.buttonText}
				onChange={(e) => onChange({ ...values, buttonText: e.target.value })}
				placeholder="e.g., Learn More"
			/>
		</div>
	);

	const renderSMSTemplate = () => (
		<div className="space-y-4">
			<Input
				label="Message Text"
				value={values.messageText}
				onChange={(e) => onChange({ ...values, messageText: e.target.value })}
				placeholder="Enter your SMS message"
				helperText="Character limit: 160"
			/>
			<Input
				label="Sender ID"
				value={values.senderId}
				onChange={(e) => onChange({ ...values, senderId: e.target.value })}
				placeholder="e.g., BUTTERFLY"
				maxLength={11}
			/>
		</div>
	);

	const renderVoiceTemplate = () => (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-primary-text mb-2">
					Voice Script
				</label>
				<textarea
					value={values.voiceScript}
					onChange={(e) => onChange({ ...values, voiceScript: e.target.value })}
					className="w-full h-32 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
					placeholder="Enter your voice call script..."
				/>
			</div>
			<Input
				label="Voice Type"
				value={values.voiceType}
				onChange={(e) => onChange({ ...values, voiceType: e.target.value })}
				placeholder="e.g., Female, Natural"
			/>
			<div className="flex space-x-4">
				<Input
					label="Call Attempts"
					type="number"
					value={values.callAttempts}
					onChange={(e) => onChange({ ...values, callAttempts: e.target.value })}
					placeholder="3"
				/>
				<Input
					label="Retry Interval (hours)"
					type="number"
					value={values.retryInterval}
					onChange={(e) => onChange({ ...values, retryInterval: e.target.value })}
					placeholder="24"
				/>
			</div>
		</div>
	);

	const renderEmailTemplate = () => (
		<div className="space-y-4">
			<Input
				label="Subject Line"
				value={values.subject}
				onChange={(e) => onChange({ ...values, subject: e.target.value })}
				placeholder="Enter email subject"
			/>
			<div>
				<label className="block text-sm font-medium text-primary-text mb-2">
					Email Content
				</label>
				<textarea
					value={values.emailContent}
					onChange={(e) => onChange({ ...values, emailContent: e.target.value })}
					className="w-full h-64 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
					placeholder="Enter your email content..."
				/>
			</div>
			<Input
				label="Sender Name"
				value={values.senderName}
				onChange={(e) => onChange({ ...values, senderName: e.target.value })}
				placeholder="e.g., John from Butterfly CRM"
			/>
			<Input
				label="Reply-To Email"
				type="email"
				value={values.replyTo}
				onChange={(e) => onChange({ ...values, replyTo: e.target.value })}
				placeholder="support@butterflycrm.com"
			/>
		</div>
	);

	const templates = {
		whatsapp: renderWhatsAppTemplate,
		sms: renderSMSTemplate,
		voice: renderVoiceTemplate,
		email: renderEmailTemplate,
	};

	return (
		<Card className="p-6">
			<h3 className="text-lg font-semibold mb-4">
				{channel.charAt(0).toUpperCase() + channel.slice(1)} Template
			</h3>
			{templates[channel]()}
		</Card>
	);
};