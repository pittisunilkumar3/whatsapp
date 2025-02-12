import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { PromptEditor } from '../ui/PromptEditor';
import { VariableList } from '../ui/VariableList';
import { MessageSquare, Phone, Mail, Calendar, Users, Wand2 } from 'lucide-react';

interface CampaignStep {
	id: string;
	title: string;
	description: string;
}

const steps: CampaignStep[] = [
	{
		id: 'channel',
		title: 'Select Channel',
		description: 'Choose your communication channel'
	},
	{
		id: 'audience',
		title: 'Target Audience',
		description: 'Define your target audience'
	},
	{
		id: 'message',
		title: 'Campaign Message',
		description: 'Craft your message'
	},
	{
		id: 'schedule',
		title: 'Schedule',
		description: 'Set campaign schedule'
	},
	{
		id: 'review',
		title: 'Review',
		description: 'Review and launch'
	}
];

const channels = [
	{ id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'text-whatsapp-green' },
	{ id: 'sms', name: 'SMS', icon: MessageSquare, color: 'text-blue-500' },
	{ id: 'voice', name: 'Voice', icon: Phone, color: 'text-orange-500' },
	{ id: 'email', name: 'Email', icon: Mail, color: 'text-purple-500' }
];

export const CampaignCreation: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedChannel, setSelectedChannel] = useState('');
	interface ChannelSettings {
		whatsapp: {
			template: string;
			buttonText?: string;
		};
		sms: {
			messageText: string;
			senderId: string;
		};
		voice: {
			script: string;
			voiceType: string;
			callAttempts: number;
			retryInterval: number;
		};
		email: {
			subject: string;
			content: string;
			senderName: string;
			replyTo: string;
		};
	}

	const [campaignData, setCampaignData] = useState({
		name: '',
		audience: [],
		message: '',
		schedule: {
			startDate: '',
			endDate: '',
			staggered: false
		}
	});

	const [channelSettings, setChannelSettings] = useState<ChannelSettings>({
		whatsapp: { template: '', buttonText: '' },
		sms: { messageText: '', senderId: '' },
		voice: { script: '', voiceType: 'female', callAttempts: 3, retryInterval: 24 },
		email: { subject: '', content: '', senderName: '', replyTo: '' }
	});

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(prev => prev + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(prev => prev - 1);
		}
	};

	const handleAIOptimize = async () => {
		try {
			// Simulate AI optimization
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const optimizedSettings = {
				whatsapp: {
					template: 'Hi {{lead.name}}, I noticed you showed interest in our services. Would you like to learn more?',
					buttonText: 'Learn More'
				},
				sms: {
					messageText: 'Hi {{lead.name}}, thanks for your interest! Click here to learn more: {{link}}',
					senderId: 'BUTTERFLY'
				},
				voice: {
					script: 'Hello {{lead.name}}, this is {{agent.name}} from {{company.name}}. I'm calling to follow up on your interest...',
					voiceType: 'female',
					callAttempts: 3,
					retryInterval: 24
				},
				email: {
					subject: '{{lead.name}}, let's discuss how we can help',
					content: 'Dear {{lead.name}},\n\nI noticed you recently expressed interest...',
					senderName: '{{agent.name}}',
					replyTo: 'support@butterflycrm.com'
				}
			};

			setChannelSettings(optimizedSettings);
		} catch (error) {
			console.error('AI optimization failed:', error);
		}
	};

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>
				Create Campaign
			</Button>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title={steps[currentStep].title}
				size="lg"
			>
				<div className="space-y-6">
					<ProgressBar
						progress={(currentStep / (steps.length - 1)) * 100}
						className="mb-8"
					/>

					{currentStep === 0 && (
						<div className="grid grid-cols-2 gap-4">
							{channels.map(channel => (
								<Card
									key={channel.id}
									className={`p-6 cursor-pointer hover:border-whatsapp-green transition-colors ${
										selectedChannel === channel.id ? 'border-whatsapp-green' : ''
									}`}
									onClick={() => setSelectedChannel(channel.id)}
								>
									<div className="flex items-center space-x-3">
										<channel.icon className={`w-6 h-6 ${channel.color}`} />
										<span className="font-medium">{channel.name}</span>
									</div>
								</Card>
							))}
						</div>
					)}

					{currentStep === 1 && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<h3 className="font-medium">Target Audience</h3>
								<Button onClick={handleAIOptimize}>
									<Wand2 className="w-4 h-4 mr-2" />
									AI Suggestions
								</Button>
							</div>
							{/* Audience selection UI */}
						</div>
					)}

					{currentStep === 2 && (
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<h3 className="font-medium">Campaign Message</h3>
								<Button onClick={handleAIOptimize}>
									<Wand2 className="w-4 h-4 mr-2" />
									Optimize Message
								</Button>
							</div>
							<PromptEditor
								value={campaignData.message}
								onChange={(value) => setCampaignData(prev => ({ ...prev, message: value }))}
							/>
							<VariableList
								variables={['{{lead.name}}', '{{company.name}}', '{{agent.name}}']}
							/>
						</div>
					)}

					{currentStep === 3 && (
						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Start Date
									</label>
									<Input
										type="datetime-local"
										value={campaignData.schedule.startDate}
										onChange={(e) => setCampaignData(prev => ({
											...prev,
											schedule: { ...prev.schedule, startDate: e.target.value }
										}))}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										End Date
									</label>
									<Input
										type="datetime-local"
										value={campaignData.schedule.endDate}
										onChange={(e) => setCampaignData(prev => ({
											...prev,
											schedule: { ...prev.schedule, endDate: e.target.value }
										}))}
									/>
								</div>
							</div>
						</div>
					)}

					{currentStep === 4 && (
						<div className="space-y-6">
							<h3 className="font-medium">Campaign Summary</h3>
							{/* Campaign summary UI */}
						</div>
					)}

					<div className="flex justify-between mt-8">
						<Button
							variant="ghost"
							onClick={handleBack}
							disabled={currentStep === 0}
						>
							Back
						</Button>
						<div className="space-x-3">
							<Button variant="ghost" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							{currentStep === steps.length - 1 ? (
								<Button onClick={() => setIsOpen(false)}>
									Launch Campaign
								</Button>
							) : (
								<Button onClick={handleNext}>
									Continue
								</Button>
							)}
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};