import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
	MessageSquare,
	Phone,
	Mail,
	MessageCircle,
	Plus,
	ExternalLink,
	Check,
	AlertCircle,
	RefreshCw
} from 'lucide-react';

interface Integration {
	id: string;
	name: string;
	type: 'messaging' | 'crm' | 'analytics';
	provider: string;
	status: 'connected' | 'disconnected' | 'error';
	lastSync: string;
	description: string;
	icon: any;
}

const mockIntegrations: Integration[] = [
	{
		id: '1',
		name: 'WhatsApp Business',
		type: 'messaging',
		provider: 'Meta',
		status: 'connected',
		lastSync: '2024-02-15T10:30:00Z',
		description: 'Send and receive WhatsApp messages',
		icon: MessageSquare
	},
	{
		id: '2',
		name: 'Twilio',
		type: 'messaging',
		provider: 'Twilio',
		status: 'connected',
		lastSync: '2024-02-15T10:30:00Z',
		description: 'SMS and voice call integration',
		icon: Phone
	},
	{
		id: '3',
		name: 'SendGrid',
		type: 'messaging',
		provider: 'Twilio',
		status: 'connected',
		lastSync: '2024-02-15T10:30:00Z',
		description: 'Email service integration',
		icon: Mail
	}
];

const statusConfig = {
	connected: {
		icon: Check,
		color: 'text-green-500',
		bgColor: 'bg-green-50',
		label: 'Connected'
	},
	disconnected: {
		icon: AlertCircle,
		color: 'text-gray-500',
		bgColor: 'bg-gray-50',
		label: 'Disconnected'
	},
	error: {
		icon: AlertCircle,
		color: 'text-red-500',
		bgColor: 'bg-red-50',
		label: 'Error'
	}
};

export const Integrations: React.FC = () => {
	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-semibold text-primary-text">Integrations</h1>
					<p className="text-secondary-text mt-1">
						Manage your external service integrations
					</p>
				</div>
				<Button>
					<Plus className="w-5 h-5 mr-2" />
					Add Integration
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{mockIntegrations.map((integration) => {
					const status = statusConfig[integration.status];
					const Icon = integration.icon;
					return (
						<Card key={integration.id} className="p-6">
							<div className="space-y-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center space-x-3">
										<div className="p-2 rounded-lg bg-whatsapp-green bg-opacity-10">
											<Icon className="w-6 h-6 text-whatsapp-green" />
										</div>
										<div>
											<h3 className="font-semibold">{integration.name}</h3>
											<p className="text-sm text-secondary-text">
												by {integration.provider}
											</p>
										</div>
									</div>
									<div className={`px-2 py-1 rounded-full text-sm flex items-center ${status.bgColor} ${status.color}`}>
										<status.icon className="w-4 h-4 mr-1" />
										{status.label}
									</div>
								</div>

								<p className="text-secondary-text">
									{integration.description}
								</p>

								<div className="flex items-center justify-between pt-4 border-t">
									<div className="text-sm text-secondary-text">
										Last synced: {new Date(integration.lastSync).toLocaleString()}
									</div>
									<div className="flex items-center space-x-2">
										<Button variant="ghost" size="sm">
											<RefreshCw className="w-4 h-4 mr-1" />
											Sync
										</Button>
										<Button variant="ghost" size="sm">
											<ExternalLink className="w-4 h-4 mr-1" />
											Configure
										</Button>
									</div>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
};