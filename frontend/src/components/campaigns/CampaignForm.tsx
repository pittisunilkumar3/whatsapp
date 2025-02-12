import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChannelTemplates } from './ChannelTemplates';
import { 
	MessageSquare, 
	Phone, 
	Mail, 
	MessageCircle,
	Upload,
	X
} from 'lucide-react';

type Channel = 'whatsapp' | 'sms' | 'voice' | 'email';

interface CampaignFormData {
  name: string;
  channel: Channel;
  templateValues: {
    whatsapp: {
      messageTemplate: string;
      buttonText?: string;
    };
    sms: {
      messageText: string;
      senderId: string;
    };
    voice: {
      voiceScript: string;
      voiceType: string;
      callAttempts: number;
      retryInterval: number;
    };
    email: {
      subject: string;
      emailContent: string;
      senderName: string;
      replyTo: string;
    };
  };
  leadFile: File | null;
}

interface CampaignFormProps {
	onSubmit: (data: CampaignFormData) => void;
	onCancel: () => void;
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

export const CampaignForm: React.FC<CampaignFormProps> = ({ onSubmit, onCancel }) => {
	const [formData, setFormData] = useState<Partial<CampaignFormData>>({
		name: '',
		channel: null,
		templateValues: {
			whatsapp: { messageTemplate: '', buttonText: '' },
			sms: { messageText: '', senderId: '' },
			voice: { voiceScript: '', voiceType: '', callAttempts: 3, retryInterval: 24 },
			email: { subject: '', emailContent: '', senderName: '', replyTo: '' },
		},
		leadFile: null
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.channel) return;

		onSubmit(formData as CampaignFormData);
	};

	return (
		<Card className="p-6 max-w-2xl mx-auto">
			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>
					<Input
						label="Campaign Name"
						value={formData.name || ''}
						onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
						placeholder="Enter campaign name"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-primary-text mb-2">
						Select Channel
					</label>
					<div className="grid grid-cols-4 gap-4">
						{Object.entries(channelConfig).map(([key, config]) => {
							const Icon = config.icon;
							const isSelected = formData.channel === key;
							return (
								<button
									key={key}
									type="button"
									onClick={() => setFormData(prev => ({ ...prev, channel: key as Channel }))}
									className={`
										p-4 rounded-lg border-2 flex flex-col items-center justify-center
										transition-all duration-200
										${isSelected 
											? `border-${config.color} bg-${config.color} bg-opacity-10` 
											: 'border-gray-200 hover:border-gray-300'
										}
									`}
								>
									<Icon className={`w-6 h-6 mb-2 ${isSelected ? `text-${config.color}` : 'text-gray-500'}`} />
									<span className={`text-sm ${isSelected ? 'font-semibold' : ''}`}>
										{config.label}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{formData.channel && (
					<ChannelTemplates
						channel={formData.channel}
						onChange={(values) => setFormData(prev => ({
							...prev,
							templateValues: {
								...prev.templateValues,
								[prev.channel as Channel]: values
							}
						}))}
						values={formData.templateValues?.[formData.channel] || {}}
					/>
				)}


				<div>
					<label className="block text-sm font-medium text-primary-text mb-2">
						Import Leads
					</label>
					<div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
						{leadFile ? (
							<div className="flex items-center justify-center space-x-2">
								<span className="text-sm">{leadFile.name}</span>
								<button
									type="button"
									onClick={() => setLeadFile(null)}
									className="text-red-500 hover:text-red-600"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						) : (
							<div className="space-y-2">
								<Upload className="w-8 h-8 mx-auto text-gray-400" />
								<p className="text-sm text-secondary-text">
									Drag and drop your CSV file or click to browse
								</p>
							</div>
						)}
						<input
							type="file"
							accept=".csv"
							onChange={(e) => e.target.files?.[0] && setFormData(prev => ({ ...prev, leadFile: e.target.files?.[0] || null }))}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						/>
					</div>
				</div>

				<div className="flex justify-end space-x-4">
					<Button variant="ghost" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" disabled={!formData.channel || !formData.name}>
						Create Campaign
					</Button>
				</div>
			</form>
		</Card>
	);
};