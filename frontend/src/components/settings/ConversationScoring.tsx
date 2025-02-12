import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Switch } from '../ui/Switch';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Plus, Trash2, Zap } from 'lucide-react';

interface ScoringRule {
	id: string;
	name: string;
	description: string;
	weight: number;
	isEnabled: boolean;
	aiAssisted: boolean;
	channel: 'whatsapp' | 'sms' | 'voice' | 'email' | 'all';
	criteria: {
		type: 'keyword' | 'sentiment' | 'response_time' | 'custom';
		value: string | number;
		threshold?: number;
	};
}

const defaultRules: ScoringRule[] = [
	{
		id: '1',
		name: 'Response Time',
		description: 'Score based on response time to leads',
		weight: 30,
		isEnabled: true,
		aiAssisted: true,
		channel: 'all',
		criteria: {
			type: 'response_time',
			value: 15,
			threshold: 60
		}
	},
	{
		id: '2',
		name: 'Sentiment Analysis',
		description: 'Score based on conversation sentiment',
		weight: 40,
		isEnabled: true,
		aiAssisted: true,
		channel: 'all',
		criteria: {
			type: 'sentiment',
			value: 'positive'
		}
	},
	{
		id: '3',
		name: 'Voice Clarity',
		description: 'Score based on voice call clarity and engagement',
		weight: 35,
		isEnabled: true,
		aiAssisted: true,
		channel: 'voice',
		criteria: {
			type: 'custom',
			value: 'voice_clarity'
		}
	},
	{
		id: '4',
		name: 'Email Engagement',
		description: 'Score based on email open and click rates',
		weight: 25,
		isEnabled: true,
		aiAssisted: true,
		channel: 'email',
		criteria: {
			type: 'custom',
			value: 'email_engagement'
		}
	}
];

export const ConversationScoring: React.FC = () => {
	const [rules, setRules] = useState<ScoringRule[]>(defaultRules);
	const [isCalibrating, setIsCalibrating] = useState(false);
	const [channelFilter, setChannelFilter] = useState<'all' | 'whatsapp' | 'sms' | 'voice' | 'email'>('all');

	const filteredRules = rules.filter(rule => 
		channelFilter === 'all' ? true : rule.channel === channelFilter || rule.channel === 'all'
	);

	const handleDragEnd = (result: any) => {
		if (!result.destination) return;

		const items = Array.from(rules);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setRules(items);
	};

	const handleAICalibration = async () => {
		setIsCalibrating(true);
		try {
			// Simulated AI calibration process
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Update rules with AI-suggested weights and thresholds
			const updatedRules = rules.map(rule => ({
				...rule,
				weight: rule.aiAssisted ? Math.floor(Math.random() * 40) + 20 : rule.weight,
				criteria: {
					...rule.criteria,
					threshold: rule.aiAssisted ? Math.floor(Math.random() * 50) + 30 : rule.criteria.threshold
				}
			}));
			
			setRules(updatedRules);
		} finally {
			setIsCalibrating(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-lg font-semibold">Conversation Scoring</h2>
					<p className="text-secondary-text mt-1">Configure scoring rules and AI calibration</p>
				</div>
				<div className="space-x-3">
					<Button
						variant="ghost"
						onClick={handleAICalibration}
						disabled={isCalibrating}
					>
						<Zap className="w-4 h-4 mr-2" />
						{isCalibrating ? 'Calibrating...' : 'AI Calibration'}
					</Button>
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						Add Rule
					</Button>
				</div>
			</div>

			<div className="mb-4">
				<div className="flex space-x-2">
					{['all', 'whatsapp', 'sms', 'voice', 'email'].map((channel) => (
						<Button
							key={channel}
							variant={channelFilter === channel ? 'default' : 'ghost'}
							size="sm"
							onClick={() => setChannelFilter(channel as typeof channelFilter)}
						>
							{channel.charAt(0).toUpperCase() + channel.slice(1)}
						</Button>
					))}
				</div>
			</div>

			<Card className="p-6">
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId="scoring-rules">
						{(provided) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="space-y-4"
							>
								{filteredRules.map((rule, index) => (
									<Draggable key={rule.id} draggableId={rule.id} index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												className="bg-gray-50 p-4 rounded-lg"
											>
												<div className="flex items-start space-x-4">
													<div {...provided.dragHandleProps}>
														<GripVertical className="w-5 h-5 text-gray-400" />
													</div>
													<div className="flex-1 space-y-4">
														<div className="flex justify-between">
															<div>
																<h3 className="font-medium">{rule.name}</h3>
																<p className="text-sm text-secondary-text">
																	{rule.description}
																</p>
															</div>
															<div className="flex items-center space-x-4">
																<Switch
																	checked={rule.isEnabled}
																	onChange={() => {
																		const newRules = [...rules];
																		newRules[index].isEnabled = !rule.isEnabled;
																		setRules(newRules);
																	}}
																/>
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() => {
																		const newRules = rules.filter(r => r.id !== rule.id);
																		setRules(newRules);
																	}}
																>
																	<Trash2 className="w-4 h-4 text-red-500" />
																</Button>
															</div>
														</div>
														<div className="space-y-2">
															<label className="text-sm font-medium">Weight</label>
															<Slider
																value={[rule.weight]}
																max={100}
																step={5}
																onValueChange={(value) => {
																	const newRules = [...rules];
																	newRules[index].weight = value[0];
																	setRules(newRules);
																}}
															/>
														</div>
													</div>
												</div>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</Card>
		</div>
	);
};