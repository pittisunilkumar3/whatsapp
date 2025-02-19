import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/Switch';
import { 
	Users,
	Clock,
	AlertCircle,
	File,
	Volume,
	Settings,
	Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form validation schema
const campaignSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	description: z.string().optional(),
	status: z.enum(['draft', 'active', 'paused', 'completed']),
	priority: z.enum(['low', 'medium', 'high']),
	campaign_type: z.enum(['outbound', 'inbound']),
	calls_per_day: z.number().min(1).max(1000),
	calling_hours_start: z.string(),
	calling_hours_end: z.string(),
	time_zone: z.string(),
	working_days: z.array(z.string()),
	ai_voice_id: z.string(),
	ai_voice_language: z.string(),
	ai_voice_gender: z.enum(['male', 'female']),
	system_prompt: z.string(),
	script_template: z.string(),
	fallback_script: z.string(),
	max_attempts_per_lead: z.number().min(1).max(10),
	retry_delay_minutes: z.number().min(1),
	call_duration_limit: z.number().min(30),
	success_criteria: z.string(),
	expected_completion_date: z.string(),
	budget: z.number().min(0),
	cost_per_call: z.number().min(0),
	owner_id: z.number(),
	team_members: z.array(z.number()),
	tags: z.array(z.string()),
	notes: z.string().optional(),
	start_date: z.string(),
	end_date: z.string(),
	recurrence_rule: z.string(),
	company_id: z.number(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
	currentStep: number;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({ currentStep }) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);

	const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CampaignFormData>({
		resolver: zodResolver(campaignSchema),
		defaultValues: {
			name: '',
			description: '',
			status: 'draft',
			priority: 'medium',
			campaign_type: 'outbound',
			calls_per_day: 50,
			calling_hours_start: '09:00',
			calling_hours_end: '17:00',
			time_zone: 'UTC',
			working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			ai_voice_id: '',
			ai_voice_language: 'en-US',
			ai_voice_gender: 'female',
			system_prompt: '',
			script_template: '',
			fallback_script: '',
			max_attempts_per_lead: 3,
			retry_delay_minutes: 60,
			call_duration_limit: 300,
			success_criteria: '',
			expected_completion_date: '',
			budget: 1000,
			cost_per_call: 0.5,
			owner_id: 1,
			team_members: [],
			tags: [],
			notes: '',
			start_date: '',
			end_date: '',
			recurrence_rule: 'FREQ=DAILY;INTERVAL=1',
			company_id: 1,
		}
	});

	const onSubmit = async (data: CampaignFormData) => {
		setIsLoading(true);
		try {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				formData.append(key, JSON.stringify(value));
			});
			
			if (uploadedFile) {
				formData.append('leadFile', uploadedFile);
			}

			const response = await fetch('/api/voice-campaigns', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to create campaign');
			}

			navigate('/company-admin/communication/voice/campaigns');
		} catch (error) {
			console.error('Error creating campaign:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setUploadedFile(file);
		}
	};

	const handlePreviewVoice = async () => {
		if (isPlaying && previewAudio) {
			previewAudio.pause();
			setIsPlaying(false);
			return;
		}

		const text = watch('script_template');
		const voice = watch('ai_voice_id');
		
		try {
			const response = await fetch('/api/voice-preview', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, voice })
			});

			if (!response.ok) throw new Error('Failed to generate preview');

			const blob = await response.blob();
			const audio = new Audio(URL.createObjectURL(blob));
			setPreviewAudio(audio);
			audio.play();
			setIsPlaying(true);

			audio.onended = () => {
				setIsPlaying(false);
			};
		} catch (error) {
			console.error('Error generating preview:', error);
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0: // Basic Information
				return (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-6">
							<div className="space-y-2">
								<Input
									label="Campaign Name"
									error={errors.name?.message}
									{...register('name')}
									className="w-full"
								/>
							</div>
							<div className="space-y-2">
								<label className="block text-sm font-medium text-gray-700">
									Description
								</label>
								<Textarea
									{...register('description')}
									className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Enter campaign description..."
								/>
							</div>
							<div className="space-y-2">
								<Select
									label="Priority"
									{...register('priority')}
									className="w-full"
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</Select>
							</div>
						</div>
						<div className="space-y-6">
							<div className="space-y-2">
								<Select
									label="Campaign Type"
									{...register('campaign_type')}
									className="w-full"
								>
									<option value="outbound">Outbound</option>
									<option value="inbound">Inbound</option>
								</Select>
							</div>
							<div className="space-y-2">
								<Input
									type="number"
									label="Budget"
									{...register('budget')}
									className="w-full"
									placeholder="Enter campaign budget..."
								/>
							</div>
							<div className="space-y-2">
								<Input
									type="number"
									label="Cost per Call"
									step="0.01"
									{...register('cost_per_call')}
									className="w-full"
									placeholder="Enter cost per call..."
								/>
							</div>
						</div>
					</div>
				);

			case 1: // Voice Settings
				return (
					<div className="space-y-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-2">
								<Select
									label="Voice Language"
									{...register('ai_voice_language')}
									className="w-full"
								>
									<option value="en-US">English (US)</option>
									<option value="en-GB">English (UK)</option>
									<option value="es-ES">Spanish (Spain)</option>
									<option value="fr-FR">French</option>
									<option value="de-DE">German</option>
								</Select>
							</div>
							<div className="space-y-2">
								<Select
									label="Voice Gender"
									{...register('ai_voice_gender')}
									className="w-full"
								>
									<option value="male">Male</option>
									<option value="female">Female</option>
								</Select>
							</div>
						</div>
						<div className="bg-gray-50 rounded-lg p-6">
							<label className="block text-sm font-medium text-gray-700 mb-4">Voice Preview</label>
							<div className="flex items-center space-x-6">
								<Button
									type="button"
									onClick={handlePreviewVoice}
									className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
								>
									{isPlaying ? (
										<>
											<Volume className="w-5 h-5" />
											<span>Pause Preview</span>
										</>
									) : (
										<>
											<Volume className="w-5 h-5" />
											<span>Play Preview</span>
										</>
									)}
								</Button>
								<div className="text-sm text-gray-600">
									Test how your script will sound with the selected voice
								</div>
							</div>
						</div>
					</div>
				);

			case 2: // Script Builder
				return (
					<div className="space-y-6">
						<div className="space-y-4">
							<label className="block text-sm font-medium text-gray-700">
								System Prompt
							</label>
							<Textarea
								{...register('system_prompt')}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Main Script
							</label>
							<Textarea
								{...register('script_template')}
								rows={5}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								placeholder="Use {variables} for dynamic content"
							/>
						</div>
						<div className="space-y-4">
							<label className="block text-sm font-medium text-gray-700">
								Fallback Script
							</label>
							<Textarea
								{...register('fallback_script')}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								placeholder="Script to use when the customer is not interested"
							/>
						</div>
					</div>
				);

			case 3: // Schedule & Rules
				return (
					<div className="space-y-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								type="datetime-local"
								label="Start Date"
								{...register('start_date')}
							/>
							<Input
								type="datetime-local"
								label="End Date"
								{...register('end_date')}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								type="time"
								label="Calling Hours Start"
								{...register('calling_hours_start')}
							/>
							<Input
								type="time"
								label="Calling Hours End"
								{...register('calling_hours_end')}
							/>
						</div>
						<div className="bg-gray-50 rounded-lg p-6 space-y-4">
							<label className="block text-sm font-medium text-gray-700">Working Days</label>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
								{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
									<div key={day} className="flex items-center space-x-3">
										<Switch
											checked={watch('working_days').includes(day)}
											onChange={() => {
												const days = watch('working_days');
												setValue('working_days', 
													days.includes(day)
														? days.filter(d => d !== day)
														: [...days, day]
												);
											}}
										/>
										<label className="text-sm text-gray-700">
											{day}
										</label>
									</div>
								))}
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Input
								type="number"
								label="Calls Per Day"
								{...register('calls_per_day')}
							/>
							<Input
								type="number"
								label="Max Attempts Per Lead"
								{...register('max_attempts_per_lead')}
							/>
							<Input
								type="number"
								label="Retry Delay (minutes)"
								{...register('retry_delay_minutes')}
							/>
						</div>
					</div>
				);

			case 4: // Lead Management
				return (
					<div className="space-y-8">
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
							<div className="text-center space-y-6">
								<div className="mx-auto h-16 w-16 text-gray-400 flex items-center justify-center">
									<Users className="h-12 w-12" />
								</div>
								<div className="space-y-4">
									<label
										htmlFor="file-upload"
										className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
									>
										<span>Upload a file</span>
										<input
											id="file-upload"
											name="file-upload"
											type="file"
											className="sr-only"
											accept=".csv,.xlsx"
											onChange={handleFileUpload}
										/>
									</label>
									<p className="text-sm text-gray-500">
										CSV or Excel files only
									</p>
								</div>
							</div>
							{uploadedFile && (
								<div className="mt-8 bg-gray-50 rounded-lg p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div className="h-5 w-5 text-green-500 flex items-center justify-center">
												<Clock className="h-4 w-4" />
											</div>
											<span className="text-sm font-medium text-gray-900">
												{uploadedFile.name}
											</span>
										</div>
										<button
											type="button"
											className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
											onClick={() => setUploadedFile(null)}
										>
											Remove
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				);

			case 5: // Review & Launch
				return (
					<div className="space-y-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Card className="p-4">
								<h3 className="text-lg font-medium mb-4">Campaign Overview</h3>
								<dl className="space-y-2">
									<div className="flex justify-between">
										<dt className="text-gray-500">Name:</dt>
										<dd className="font-medium">{watch('name')}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">Type:</dt>
										<dd className="font-medium">{watch('campaign_type')}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">Priority:</dt>
										<dd className="font-medium">{watch('priority')}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">Budget:</dt>
										<dd className="font-medium">${watch('budget')}</dd>
									</div>
								</dl>
							</Card>
							<Card className="p-4">
								<h3 className="text-lg font-medium mb-4">Schedule Summary</h3>
								<dl className="space-y-2">
									<div className="flex justify-between">
										<dt className="text-gray-500">Start Date:</dt>
										<dd className="font-medium">{new Date(watch('start_date')).toLocaleDateString()}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">End Date:</dt>
										<dd className="font-medium">{new Date(watch('end_date')).toLocaleDateString()}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">Calling Hours:</dt>
										<dd className="font-medium">{watch('calling_hours_start')} - {watch('calling_hours_end')}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">Calls Per Day:</dt>
										<dd className="font-medium">{watch('calls_per_day')}</dd>
									</div>
								</dl>
							</Card>
						</div>
						<div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
							<div className="flex">
								<AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
								<div className="ml-4">
									<h3 className="text-base font-medium text-yellow-800">
										Before You Launch
									</h3>
									<div className="mt-4">
										<ul className="list-disc pl-5 space-y-2 text-sm text-yellow-700">
											<li>Verify all campaign settings are correct</li>
											<li>Ensure your lead list is properly formatted</li>
											<li>Check compliance with local calling regulations</li>
											<li>Test the voice and script settings</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{renderStepContent()}
		</form>
	);
};