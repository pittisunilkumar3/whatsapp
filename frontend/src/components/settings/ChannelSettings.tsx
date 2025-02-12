import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { MessageSquare, Phone, Mail } from 'lucide-react';

interface IntegrationConfig {
	apiKey: string;
	apiSecret?: string;
	accountSid?: string;
	fromNumber?: string;
	emailDomain?: string;
	smtpHost?: string;
	smtpPort?: string;
	smtpUsername?: string;
	smtpPassword?: string;
	senderName?: string;
	senderEmail?: string;
}

const channels = [
	{
		id: 'whatsapp',
		label: 'WhatsApp',
		icon: MessageSquare,
		color: 'text-whatsapp-green',
		fields: ['apiKey', 'fromNumber']
	},
	{
		id: 'sms',
		label: 'SMS',
		icon: MessageSquare,
		color: 'text-blue-500',
		fields: ['accountSid', 'apiKey', 'fromNumber']
	},
	{
		id: 'voice',
		label: 'Voice',
		icon: Phone,
		color: 'text-orange-500',
		fields: ['accountSid', 'apiKey', 'fromNumber']
	},
	{
		id: 'email',
		label: 'Email',
		icon: Mail,
		color: 'text-purple-500',
		fields: [
			'apiKey',
			'emailDomain',
			'smtpHost',
			'smtpPort',
			'smtpUsername',
			'smtpPassword',
			'senderName',
			'senderEmail'
		]
	}
];

export const ChannelSettings: React.FC = () => {
	const [activeChannel, setActiveChannel] = React.useState('whatsapp');
	const [config, setConfig] = React.useState<Record<string, IntegrationConfig>>({
		whatsapp: { apiKey: '', fromNumber: '' },
		sms: { accountSid: '', apiKey: '', fromNumber: '' },
		voice: { accountSid: '', apiKey: '', fromNumber: '' },
		email: {
			apiKey: '',
			emailDomain: '',
			smtpHost: '',
			smtpPort: '',
			smtpUsername: '',
			smtpPassword: '',
			senderName: '',
			senderEmail: ''
		}
	});

	const handleTestEmailConnection = async () => {
		try {
			// Simulate sending test email
			await new Promise(resolve => setTimeout(resolve, 1000));
			// Show success toast
			console.log('Email connection test successful');
		} catch (error) {
			// Show error toast
			console.error('Email connection test failed');
		}
	};

	const handleTestConnection = (channel: string) => {
		if (channel === 'email') {
			handleTestEmailConnection();
		} else {
			// Existing test connection logic
			console.log(`Testing ${channel} connection...`);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold">Channel Integrations</h2>
			</div>

			<Tabs
				tabs={channels.map(c => ({
					id: c.id,
					label: c.label,
					icon: <c.icon className={`w-5 h-5 ${c.color}`} />
				}))}
				activeTab={activeChannel}
				onChange={setActiveChannel}
			/>

			<Card className="p-6">
				{channels.map(channel => (
					channel.id === activeChannel && (
						<div key={channel.id} className="space-y-6">
							{channel.fields.map(field => (
								<div key={field} className="space-y-2">
									<label className="block text-sm font-medium text-gray-700">
										{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
									</label>
									<Input
										type={field.includes('key') || field.includes('secret') ? 'password' : 'text'}
										value={config[channel.id][field as keyof IntegrationConfig] || ''}
										onChange={(e) => setConfig(prev => ({
											...prev,
											[channel.id]: {
												...prev[channel.id],
												[field]: e.target.value
											}
										}))}
										placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
									/>
								</div>
							))}
							<div className="flex justify-end space-x-3">
								<Button variant="ghost">Reset</Button>
								<Button onClick={() => handleTestConnection(channel.id)}>
									Test Connection
								</Button>
								<Button>Save Changes</Button>
							</div>
						</div>
					)
				))}
			</Card>
		</div>
	);
};