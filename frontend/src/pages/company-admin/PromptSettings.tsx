import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
	MessageSquare,
	Phone,
	Mail,
	MessageCircle,
	Plus,
	Save,
	Copy,
	Trash2
} from 'lucide-react';

interface PromptTemplate {
	id: string;
	name: string;
	channel: 'whatsapp' | 'sms' | 'voice' | 'email';
	content: string;
	variables: string[];
	isActive: boolean;
	lastUpdated: string;
}

const mockTemplates: PromptTemplate[] = [
	{
		id: '1',
		name: 'Initial Follow-up',
		channel: 'whatsapp',
		content: 'Hi {name}, thank you for your interest in {product}. Would you like to learn more about our special offers?',
		variables: ['name', 'product'],
		isActive: true,
		lastUpdated: '2024-02-15T10:30:00Z'
	},
	{
		id: '2',
		name: 'Meeting Reminder',
		channel: 'email',
		content: 'Dear {name},\n\nThis is a reminder about our scheduled meeting on {date} at {time}.\n\nBest regards,\n{sender}',
		variables: ['name', 'date', 'time', 'sender'],
		isActive: true,
		lastUpdated: '2024-02-14T15:45:00Z'
	},
];

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

export const PromptSettings: React.FC = () => {
	const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

	return (
		<div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
		  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
			<div>
			  <h1 className="text-xl sm:text-2xl font-semibold text-primary-text">Prompt Settings</h1>
			  <p className="text-sm text-secondary-text mt-1">
				Manage message templates and conversation prompts
			  </p>
			</div>
			<Button className="w-full sm:w-auto touch-manipulation">
			  <Plus className="w-5 h-5 mr-2" />
			  Create Template
			</Button>
		  </div>

		  {/* Channel Filter */}
		  <Card className="p-3 sm:p-4">
			<div className="overflow-x-auto scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
			  <div className="flex space-x-3 min-w-max">
				{Object.entries(channelConfig).map(([key, config]) => {
				  const Icon = config.icon;
				  const isSelected = selectedChannel === key;
				  return (
					<Button
					  key={key}
					  variant={isSelected ? 'primary' : 'ghost'}
					  onClick={() => setSelectedChannel(isSelected ? null : key)}
					  className={`px-3 sm:px-4 py-2 touch-manipulation whitespace-nowrap ${isSelected ? `bg-${config.color}` : ''}`}
					>
					  <Icon className="w-5 h-5 mr-2" />
					  {config.label}
					</Button>
				  );
				})}
			  </div>
			</div>
		  </Card>

		  {/* Templates List */}
		  <div className="space-y-4">
			{mockTemplates
			  .filter(template => !selectedChannel || template.channel === selectedChannel)
			  .map((template) => {
				const channel = channelConfig[template.channel];
				const Icon = channel.icon;
				return (
				  <Card key={template.id} className="p-4 sm:p-6">
					<div className="space-y-4">
					  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
						<div className="flex items-center space-x-4">
						  <div className={`p-2 rounded-lg bg-${channel.color} bg-opacity-10 flex-shrink-0`}>
							<Icon className={`w-6 h-6 text-${channel.color}`} />
						  </div>
						  <div>
							<h3 className="font-semibold">{template.name}</h3>
							<p className="text-sm text-secondary-text">
							  Last updated: {new Date(template.lastUpdated).toLocaleDateString()}
							</p>
						  </div>
						</div>
						<div className="flex items-center space-x-2 self-end sm:self-start">
						  <Button variant="ghost" size="sm" className="p-2 touch-manipulation">
							<Copy className="w-5 h-5" />
						  </Button>
						  <Button variant="ghost" size="sm" className="p-2 touch-manipulation">
							<Trash2 className="w-5 h-5" />
						  </Button>
						</div>
					  </div>

					  <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
						<pre className="text-sm whitespace-pre-wrap break-words">{template.content}</pre>
					  </div>

					  <div className="flex flex-wrap gap-2">
						{template.variables.map((variable) => (
						  <span
							key={variable}
							className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-secondary-text"
						  >
							{`{${variable}}`}
						  </span>
						))}
					  </div>
					</div>
				  </Card>
				);
			  })}
		  </div>
		</div>
	);
};