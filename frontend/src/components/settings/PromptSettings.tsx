import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PromptEditor } from '../ui/PromptEditor';
import { VariableList } from '../ui/VariableList';
import { PromptVariationManager } from '../ui/PromptVariationManager';
import { MessageSquare, Phone, Mail, Play, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface AICalibrationResult {
	suggestedContent: string;
	confidence: number;
	improvements: string[];
}

interface PromptVariation {
	id: string;
	name: string;
	content: string;
	isDefault: boolean;
}

interface ChannelPrompt {
	variations: PromptVariation[];
	variables: string[];
}

const channels = [
	{
		id: 'whatsapp',
		label: 'WhatsApp',
		icon: MessageSquare,
		color: 'text-whatsapp-green'
	},
	{
		id: 'sms',
		label: 'SMS',
		icon: MessageSquare,
		color: 'text-blue-500'
	},
	{
		id: 'voice',
		label: 'Voice',
		icon: Phone,
		color: 'text-orange-500'
	},
	{
		id: 'email',
		label: 'Email',
		icon: Mail,
		color: 'text-purple-500'
	}
];

const defaultVariables = [
	'{{lead.name}}',
	'{{lead.company}}',
	'{{company.name}}',
	'{{agent.name}}'
];

export const PromptSettings: React.FC = () => {
	const [activeChannel, setActiveChannel] = useState('whatsapp');
	const [isTestModalOpen, setIsTestModalOpen] = useState(false);
	const [isCalibrating, setIsCalibrating] = useState(false);
	const [calibrationResults, setCalibrationResults] = useState<Record<string, AICalibrationResult>>({});
	const [prompts, setPrompts] = useState<Record<string, ChannelPrompt>>({
		whatsapp: { variations: [], variables: defaultVariables },
		sms: { variations: [], variables: defaultVariables },
		voice: { variations: [], variables: defaultVariables },
		email: { variations: [], variables: defaultVariables }
	});

	const handleTestPrompt = () => {
		setIsTestModalOpen(true);
	};

	const handleAICalibration = async () => {
		setIsCalibrating(true);
		try {
			// Simulated AI calibration
			await new Promise(resolve => setTimeout(resolve, 2000));
			const result: AICalibrationResult = {
				suggestedContent: `Hi {{lead.name}}, this is {{agent.name}} from {{company.name}}. I noticed you've shown interest in our services.`,
				confidence: 0.85,
				improvements: [
					'More personalized greeting',
					'Clear value proposition',
					'Strong call to action'
				]
			};
			setCalibrationResults(prev => ({
				...prev,
				[activeChannel]: result
			}));
		} finally {
			setIsCalibrating(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold">Prompt Settings</h2>
				<div className="space-x-3">
					<Button 
						variant="ghost"
						onClick={handleAICalibration}
						disabled={isCalibrating}
					>
						{isCalibrating ? 'Calibrating...' : 'AI Calibrate'}
					</Button>
					<Button onClick={handleTestPrompt}>
						<Play className="w-4 h-4 mr-2" />
						Test Prompt
					</Button>
				</div>
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

			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-2 space-y-6">
					<Card className="p-6">
						<PromptEditor
							value={prompts[activeChannel].variations.find(v => v.isDefault)?.content || ''}
							onChange={(content) => {
								// Handle prompt content change
							}}
						/>
					</Card>

					<Card className="p-6">
						<h3 className="text-lg font-semibold mb-4">Preview</h3>
						<div className="bg-gray-50 p-4 rounded-lg">
							{/* Preview content */}
						</div>
					</Card>
				</div>

				<div className="space-y-6">
					<Card className="p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="font-semibold">Variations</h3>
							<Button size="sm">
								<Plus className="w-4 h-4 mr-2" />
								Add Variation
							</Button>
						</div>
						<PromptVariationManager
							variations={prompts[activeChannel].variations}
							onUpdate={(variations) => {
								setPrompts(prev => ({
									...prev,
									[activeChannel]: {
										...prev[activeChannel],
										variations
									}
								}));
							}}
						/>
					</Card>

					<Card className="p-6">
						<h3 className="font-semibold mb-4">Available Variables</h3>
						<VariableList variables={prompts[activeChannel].variables} />
					</Card>
				</div>
			</div>

			<Modal
				isOpen={isTestModalOpen}
				onClose={() => setIsTestModalOpen(false)}
				title={`Test ${channels.find(c => c.id === activeChannel)?.label} Prompt`}
			>
				<div className="space-y-4">
					{activeChannel === 'email' ? (
						<>
							<Input
								label="Email Addresses"
								placeholder="Enter email addresses (comma-separated)"
								type="text"
							/>
							<Input
								label="Subject Line"
								placeholder="Enter email subject"
								type="text"
							/>
						</>
					) : activeChannel === 'voice' ? (
						<>
							<Input
								label="Phone Numbers"
								placeholder="Enter phone numbers (comma-separated)"
								type="tel"
							/>
							<div className="flex items-center space-x-2">
								<Input
									label="Voice Type"
									placeholder="e.g., Female, Natural"
									type="text"
								/>
								<Input
									label="Speaking Rate"
									placeholder="1.0"
									type="number"
									min="0.5"
									max="2.0"
									step="0.1"
								/>
							</div>
						</>
					) : (
						<Input
							label={`${activeChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'} Numbers`}
							placeholder="Enter phone numbers (comma-separated)"
							type="tel"
						/>
					)}
					<div className="flex justify-end space-x-3">
						<Button variant="ghost" onClick={() => setIsTestModalOpen(false)}>
							Cancel
						</Button>
						<Button>Send Test</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};