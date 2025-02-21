import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/Switch';
import { 
	Users,
	Clock,
	FileText,
	VolumeX,
	Cog,
	CheckCircle,
	Download,
	Info,
	AlertCircle,
	AlertTriangle,
	X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { useAuthStore } from '~/store/authStore';

type CampaignFormData = {
	name: string;
	description?: string;
	status: 'draft' | 'active' | 'paused' | 'completed';
	priority: 'low' | 'medium' | 'high';
	campaign_type: 'outbound' | 'inbound';
	calls_per_day: number;
	calling_hours_start: string;
	calling_hours_end: string;
	time_zone: string;
	working_days: string[];
	ai_voice_language: string;
	ai_voice_gender: 'male' | 'female';
	system_prompt: string;
	script_template: string;
	fallback_script?: string;
	max_attempts_per_lead: number;
	retry_delay_minutes: number;
	call_duration_limit: number;
	success_criteria: 'call_completed' | 'positive_response' | 'appointment_scheduled' | 'sale_made';
	expected_completion_date: string;
	budget: number;
	cost_per_call: number;
	owner_id: number;
	team_members: number[];
	tags: string[];
	notes?: string;
	start_date: string;
	end_date: string;
	recurrence_rule: string;
	company_id: number;
};

type Employee = {
	id: number;
	name: string;
	email: string;
	employee_id: string;
	department: number;
	designation: number;
};

const campaignSchema = z.object({
	name: z.string()
		.min(3, 'Campaign name must be at least 3 characters')
		.max(100, 'Campaign name cannot exceed 100 characters'),
	description: z.string().optional(),
	status: z.enum(['draft', 'active', 'paused', 'completed']),
	priority: z.enum(['low', 'medium', 'high']),
	campaign_type: z.enum(['outbound', 'inbound']),
	calls_per_day: z.coerce.number()
		.int('Must be a whole number')
		.min(1, 'Must make at least 1 call per day')
		.max(1000, 'Maximum 1000 calls per day'),
	calling_hours_start: z.string()
		.min(1, 'Start time is required')
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
	calling_hours_end: z.string()
		.min(1, 'End time is required')
		.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
	time_zone: z.string().min(1, 'Time zone is required'),
	working_days: z.array(z.string()).min(1, 'Select at least one working day'),
	ai_voice_language: z.string().min(1, 'Language is required'),
	ai_voice_gender: z.enum(['male', 'female']),
	system_prompt: z.string().min(1, 'System prompt is required'),
	script_template: z.string().min(1, 'Script template is required'),
	fallback_script: z.string().optional(),
	max_attempts_per_lead: z.coerce.number()
		.int('Must be a whole number')
		.min(1, 'Minimum 1 attempt')
		.max(10, 'Maximum 10 attempts'),
	retry_delay_minutes: z.coerce.number()
		.int('Must be a whole number')
		.min(1, 'Minimum 1 minute'),
	call_duration_limit: z.coerce.number()
		.int('Must be a whole number')
		.min(30, 'Minimum 30 seconds'),
	success_criteria: z.enum(['call_completed', 'positive_response', 'appointment_scheduled', 'sale_made']),
	expected_completion_date: z.string().min(1, 'Completion date is required'),
	budget: z.coerce.number().min(0, 'Budget must be positive'),
	cost_per_call: z.coerce.number().min(0, 'Cost per call must be positive'),
	owner_id: z.number(),
	team_members: z.array(z.number()),
	tags: z.array(z.string()),
	notes: z.string().optional(),
	start_date: z.string().min(1, 'Start date is required'),
	end_date: z.string().min(1, 'End date is required'),
	recurrence_rule: z.string(),
	company_id: z.number(),
});

interface CampaignFormProps {
	currentStep: number;
}

const STORAGE_KEY = 'campaign_form_data';

const employees: Employee[] = [];

export const CampaignForm = forwardRef<{
	submitForm: () => Promise<void>;
	trigger: (fields?: string[]) => Promise<boolean>;
	formState: { errors: any };
	getValues: () => any;
}, CampaignFormProps>(({ currentStep }, ref) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [parsedLeads, setParsedLeads] = useState<any[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [campaignId, setCampaignId] = useState<number | null>(null);

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				const companyId = 1; // Replace with actual company ID from your context/state
				const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/company-employees/company/${companyId}`);
				const result = await response.json();
				if (result.data) {
					setEmployees(result.data.map((emp: any) => ({
						id: emp.id,
						name: `${emp.name} ${emp.surname}`,
						email: emp.email,
						employee_id: emp.employee_id,
						department: emp.department,
						designation: emp.designation
					})));
				}
			} catch (error) {
				console.error('Error fetching employees:', error);
				toast.error('Failed to load employees');
			}
		};

		fetchEmployees();
	}, []);

	// Initialize form with stored data if available
	const storedData = localStorage.getItem(STORAGE_KEY);
	const initialData = {
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
		ai_voice_language: 'en-US',
		ai_voice_gender: 'female',
		system_prompt: '',
		script_template: '',
		fallback_script: '',
		max_attempts_per_lead: 3,
		retry_delay_minutes: 60,
		call_duration_limit: 300,
		success_criteria: 'call_completed',
		expected_completion_date: new Date().toISOString().split('T')[0],
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
		...(storedData ? JSON.parse(storedData) : {})
	};

	const { 
		control,
		register, 
		handleSubmit, 
		formState: { errors, isValid }, 
		watch, 
		setValue,
		trigger,
		getValues
	} = useForm<CampaignFormData>({
		resolver: zodResolver(campaignSchema),
		defaultValues: initialData,
		mode: 'onChange'
	});

	interface CampaignResponse {
		message: string;
		data: {
			id: number;
			name: string;
			status: string;
			// ... other fields
		};
	}

	const onSubmit = async (data: CampaignFormData) => {
		setIsLoading(true);
		try {
			// Format the data according to API requirements
			const formattedData = {
				name: data.name,
				description: data.description || '',
				status: data.status,
				priority: data.priority,
				campaign_type: data.campaign_type,
				calls_per_day: Number(data.calls_per_day),
				calling_hours_start: `${data.calling_hours_start}:00`,
				calling_hours_end: `${data.calling_hours_end}:00`,
				time_zone: data.time_zone,
				working_days: data.working_days,
				ai_voice_id: 'voice-123',
				ai_voice_language: data.ai_voice_language,
				ai_voice_gender: data.ai_voice_gender,
				system_prompt: data.system_prompt,
				script_template: data.script_template,
				fallback_script: data.fallback_script || '',
				max_attempts_per_lead: Number(data.max_attempts_per_lead),
				retry_delay_minutes: Number(data.retry_delay_minutes),
				call_duration_limit: Number(data.call_duration_limit),
				success_criteria: data.success_criteria,
				expected_completion_date: data.expected_completion_date,
				budget: Number(data.budget),
				cost_per_call: Number(data.cost_per_call),
				owner_id: Number(data.owner_id),
				team_members: [], // Always send empty array
				tags: data.tags || [],
				notes: data.notes || '',
				start_date: `${data.start_date} 09:00:00`,
				end_date: `${data.end_date} 17:00:00`,
				recurrence_rule: data.recurrence_rule,
				company_id: data.company_id
			};

			console.log('Creating campaign:', formattedData);

			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/voice-campaigns`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formattedData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Campaign creation error:', errorData);
				throw new Error(errorData.message || 'Error creating voice campaign');
			}

			const responseData: CampaignResponse = await response.json();
			console.log('Campaign created successfully:', responseData);
			
			// Store the campaign ID
			if (responseData.data.id) {
				setCampaignId(responseData.data.id);
				toast.success(responseData.message || 'Campaign created successfully!');

				// If there's an uploaded file, process it with the new campaign ID
				if (uploadedFile) {
					await importLeads(responseData.data.id);
				} else {
					// No file to process, navigate away
					navigate('/company-admin/communication/voice/campaigns');
				}
			} else {
				throw new Error('Campaign ID not received in response');
			}

			// Clear stored form data
			localStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.error('Error in campaign creation:', error);
			if (error instanceof Error) {
				toast.error(`Failed to create campaign: ${error.message}`);
			} else {
				toast.error('Failed to create campaign. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const formatToE164 = (phone: string | undefined | null): string => {
		if (!phone) {
			throw new Error('Phone number is required');
		}

		// Remove all non-digit characters except '+'
		let cleaned = phone.toString().replace(/[^\d+]/g, '');
		
		// If number doesn't start with +, check if it has a country code
		if (!cleaned.startsWith('+')) {
			// Assume it's a 10-digit number and add +1 (US/Canada)
			// If it's longer, it probably includes a country code already
			if (cleaned.length === 10) {
				cleaned = '+1' + cleaned;
			} else if (cleaned.length > 10) {
				cleaned = '+' + cleaned;
			} else {
				throw new Error(`Invalid phone number: ${phone} (must be at least 10 digits with optional country code)`);
			}
		}
		
		// Ensure there's at least 10 digits after the country code
		const digitsAfterPlus = cleaned.substring(1).replace(/\D/g, '');
		if (digitsAfterPlus.length < 10) {
			throw new Error(`Invalid phone number: ${phone} (must have at least 10 digits after country code)`);
		}
		
		return cleaned;
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = event.target.files?.[0];
			if (!file) return;

			setUploadedFile(file);
			const reader = new FileReader();

			reader.onload = async (e) => {
				const csvData = e.target?.result as string;
				
				Papa.parse(csvData, {
					header: true,
					skipEmptyLines: true,
					complete: (results) => {
						try {
							const leads = results.data.map((row: any, index: number) => {
								try {
									if (!row.phone) {
										throw new Error('Phone number is required');
									}

									console.log(`Processing row ${index + 1}, phone:`, row.phone);
									const formattedPhone = formatToE164(row.phone);
									console.log(`Formatted phone for row ${index + 1}:`, formattedPhone);

									return {
										first_name: row.first_name || '',
										last_name: row.last_name || '',
										phone: formattedPhone,
										email: row.email || '',
										company_name: row.company_name || '',
										job_title: row.job_title || '',
										industry: row.industry || '',
										priority: parseInt(row.priority) || 1,
										lead_score: parseInt(row.lead_score) || 0,
										interest_level: ['low', 'medium', 'high'].includes(row.interest_level?.toLowerCase()) 
											? row.interest_level.toLowerCase() 
											: 'medium',
										tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : []
									};
								} catch (error) {
									throw new Error(`Row ${index + 1}: ${error.message}`);
								}
							});

							setParsedLeads(leads);
							toast.success(`CSV file processed: ${leads.length} leads ready to import`);
						} catch (error) {
							console.error('Error processing CSV data:', error);
							toast.error(error instanceof Error ? error.message : 'Failed to process CSV file');
							setParsedLeads([]);
							setUploadedFile(null);
						}
					},
					error: (error) => {
						console.error('CSV parsing error:', error);
						toast.error('Failed to parse CSV file');
						setParsedLeads([]);
						setUploadedFile(null);
					}
				});
			};

			reader.onerror = () => {
				console.error('File reading error:', reader.error);
				toast.error('Failed to read file');
				setParsedLeads([]);
				setUploadedFile(null);
			};

			reader.readAsText(file);
		} catch (error) {
			console.error('Error handling file upload:', error);
			toast.error('Failed to process file');
			setParsedLeads([]);
			setUploadedFile(null);
		}
	};

	const importLeads = async (campaignId: number) => {
		try {
			if (parsedLeads.length === 0) {
				toast.error('No leads to import');
				return;
			}

			const user = useAuthStore.getState().user;
			const companyId = user?.company?.id;

			if (!companyId) {
				toast.error('Company ID not found. Please try logging in again.');
				return;
			}

			// Validate all phone numbers before sending
			const validatedLeads = parsedLeads.map((lead, index) => {
				try {
					if (!lead.phone) {
						throw new Error('Phone number is required');
					}

					console.log(`Validating lead ${index + 1}, phone:`, lead.phone);
					const formattedPhone = formatToE164(lead.phone);
					console.log(`Formatted phone for lead ${index + 1}:`, formattedPhone);

					return {
						...lead,
						phone: formattedPhone
					};
				} catch (error) {
					const name = lead.first_name || lead.last_name ? 
						`${lead.first_name} ${lead.last_name}`.trim() : 
						`Lead #${index + 1}`;
					throw new Error(`${name}: ${error.message}`);
				}
			});

			const payload = {
				campaign_id: campaignId,
				leads: validatedLeads.map(lead => ({
					first_name: lead.first_name,
					last_name: lead.last_name,
					phone: lead.phone, // Already validated
					email: lead.email,
					company_name: lead.company_name,
					job_title: lead.job_title,
					industry: lead.industry,
					priority: lead.priority,
					lead_score: lead.lead_score,
					interest_level: lead.interest_level,
					custom_fields: {
						tags: lead.tags
					}
				})),
				default_values: {
					status: 'pending',
					source: 'api_import',
					timezone: watch('time_zone') || 'UTC'
				}
			};

			console.log('Importing leads with payload:', {
				...payload,
				leads: payload.leads.slice(0, 2) // Log first 2 leads for debugging
			});

			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/company/voice-leads/company/${companyId}/import-json`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const contentType = response.headers.get('content-type');
			if (!contentType?.includes('application/json')) {
				console.error('Received non-JSON response:', await response.text());
				throw new Error('Server returned non-JSON response');
			}

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Lead import error response:', errorData);
				throw new Error(errorData.message || errorData.error || 'Error importing leads');
			}

			const result = await response.json();
			console.log('Lead import success response:', result);
			toast.success(`Successfully imported ${validatedLeads.length} leads`);
			
			// Clear the stored leads after successful import
			setParsedLeads([]);
			setUploadedFile(null);
			
			// Navigate to the specific campaign page
			navigate(`/company-admin/communication/voice/campaigns/${campaignId}`);
		} catch (error) {
			console.error('Error importing leads:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to import leads');
		}
	};

	const handleTeamMembersClick = async () => {
		if (campaignId) {
			await importLeads(campaignId);
		} else {
			toast.error('Campaign ID not available. Please save the campaign first.');
		}
	};

	const renderRequiredLabel = (label: string, isRequired: boolean = true) => (
		<div className="flex items-center gap-1">
			<span>{label}</span>
			{isRequired && <span className="text-red-500">*</span>}
		</div>
	);

	const renderFieldError = (error?: { message?: string }) => {
		if (!error?.message) return null;
		return <p className="text-sm text-red-500 mt-1">{error.message}</p>;
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0: // Basic Information
				return (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-6">
							<div className="space-y-2">
								<Controller
									name="name"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Campaign Name')}
											</label>
											<input
												{...field}
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.name ? 'border-red-500' : 'border-gray-300'}`}
											/>
											{errors.name && (
												<p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
											)}
										</div>
									)}
								/>
							</div>
							<div className="space-y-2">
								<Controller
									name="description"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-700">
												{renderRequiredLabel('Description', false)}
											</label>
											<textarea
												{...field}
												className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter campaign description..."
											/>
											{errors.description && (
												<p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>
											)}
										</div>
									)}
								/>
							</div>
							<div className="space-y-2">
								<Controller
									name="priority"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Priority')}
											</label>
											<select
												{...field}
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.priority ? 'border-red-500' : 'border-gray-300'}`}
											>
												<option value="low">Low</option>
												<option value="medium">Medium</option>
												<option value="high">High</option>
											</select>
											{errors.priority && (
												<p className="mt-1.5 text-sm text-red-500">{errors.priority.message}</p>
											)}
										</div>
									)}
								/>
							</div>
							<div className="space-y-2">
								<Controller
									name="owner_id"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Campaign Owner')}
											</label>
											<select
												{...field}
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.owner_id ? 'border-red-500' : 'border-gray-300'}`}
												onChange={(e) => {
													field.onChange(parseInt(e.target.value));
												}}
											>
												<option value="">Select campaign owner</option>
												{employees.map((employee) => (
													<option 
														key={employee.id} 
														value={employee.id}
													>
														{employee.name} - {employee.email}
													</option>
												))}
											</select>
											{errors.owner_id && (
												<p className="mt-1.5 text-sm text-red-500">{errors.owner_id.message}</p>
											)}
										</div>
									)}
								/>
							</div>
						</div>
						<div className="space-y-6">
							<div className="space-y-2">
								<Controller
									name="campaign_type"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Campaign Type')}
											</label>
											<select
												{...field}
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.campaign_type ? 'border-red-500' : 'border-gray-300'}`}
											>
												<option value="outbound">Outbound</option>
												<option value="inbound">Inbound</option>
											</select>
											{errors.campaign_type && (
												<p className="mt-1.5 text-sm text-red-500">{errors.campaign_type.message}</p>
											)}
										</div>
									)}
								/>
							</div>
							<div className="space-y-2">
								<Controller
									name="budget"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Budget')}
											</label>
											<input
												{...field}
												type="number"
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.budget ? 'border-red-500' : 'border-gray-300'}`}
												placeholder="Enter campaign budget..."
												min="0"
												step="0.01"
											/>
											{errors.budget && (
												<p className="mt-1.5 text-sm text-red-500">{errors.budget.message}</p>
											)}
										</div>
									)}
								/>
							</div>
							<div className="space-y-2">
								<Controller
									name="cost_per_call"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Cost per Call')}
											</label>
											<input
												{...field}
												type="number"
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.cost_per_call ? 'border-red-500' : 'border-gray-300'}`}
												placeholder="Enter cost per call..."
												min="0"
												step="0.01"
											/>
											{errors.cost_per_call && (
												<p className="mt-1.5 text-sm text-red-500">{errors.cost_per_call.message}</p>
											)}
										</div>
									)}
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
								<Controller
									name="ai_voice_language"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Voice Language')}
											</label>
											<select
												{...field}
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.ai_voice_language ? 'border-red-500' : 'border-gray-300'}`}
											>
												<option value="">Select Language</option>
												<option value="en-US">English (US)</option>
												<option value="en-GB">English (UK)</option>
												<option value="es-ES">Spanish (Spain)</option>
												<option value="fr-FR">French</option>
												<option value="de-DE">German</option>
											</select>
											{errors.ai_voice_language && (
												<p className="mt-1.5 text-sm text-red-500">{errors.ai_voice_language.message}</p>
											)}
										</div>
									)}
								/>
							</div>
							<div className="space-y-2">
								<Controller
									name="ai_voice_gender"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Voice Gender')}
											</label>
											<select
												{...field}
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.ai_voice_gender ? 'border-red-500' : 'border-gray-300'}`}
											>
												<option value="">Select Gender</option>
												<option value="male">Male</option>
												<option value="female">Female</option>
											</select>
											{errors.ai_voice_gender && (
												<p className="mt-1.5 text-sm text-red-500">{errors.ai_voice_gender.message}</p>
											)}
										</div>
									)}
								/>
							</div>
						</div>
						<div className="bg-gray-50 rounded-lg p-6">
							<div className="flex items-start">
								<AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
								<div className="ml-3">
									<h3 className="text-sm font-medium text-gray-900">Voice Configuration</h3>
									<p className="mt-2 text-sm text-gray-600">
										Select the language and gender for your AI voice. The selected voice will be used for all calls in this campaign.
										Make sure to test your script with the selected voice configuration before launching the campaign.
									</p>
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
								className={`w-full px-3 py-2 border border-gray-300 rounded-md ${errors.system_prompt ? 'border-red-500' : ''}`}
							/>
							{renderFieldError(errors.system_prompt)}
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">
								Main Script
							</label>
							<Textarea
								{...register('script_template')}
								rows={5}
								className={`w-full px-3 py-2 border border-gray-300 rounded-md ${errors.script_template ? 'border-red-500' : ''}`}
								placeholder="Use {variables} for dynamic content"
							/>
							{renderFieldError(errors.script_template)}
						</div>
						<div className="space-y-4">
							<label className="block text-sm font-medium text-gray-700">
								Fallback Script
							</label>
							<Textarea
								{...register('fallback_script')}
								rows={3}
								className={`w-full px-3 py-2 border border-gray-300 rounded-md ${errors.fallback_script ? 'border-red-500' : ''}`}
								placeholder="Script to use when the customer is not interested"
							/>
							{renderFieldError(errors.fallback_script)}
						</div>
					</div>
				);

			case 3: // Schedule & Rules
				return (
					<div className="space-y-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								type="datetime-local"
								label={renderRequiredLabel('Start Date')}
								{...register('start_date')}
							/>
							{renderFieldError(errors.start_date)}
							<Input
								type="datetime-local"
								label={renderRequiredLabel('End Date')}
								{...register('end_date')}
							/>
							{renderFieldError(errors.end_date)}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								type="time"
								label={renderRequiredLabel('Calling Hours Start')}
								{...register('calling_hours_start')}
							/>
							{renderFieldError(errors.calling_hours_start)}
							<Input
								type="time"
								label={renderRequiredLabel('Calling Hours End')}
								{...register('calling_hours_end')}
							/>
							{renderFieldError(errors.calling_hours_end)}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Input
								type="date"
								label={renderRequiredLabel('Expected Completion Date')}
								{...register('expected_completion_date')}
							/>
							{renderFieldError(errors.expected_completion_date)}
							<div className="space-y-2">
								<Controller
									name="success_criteria"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-600 mb-1.5">
												{renderRequiredLabel('Success Criteria')}
											</label>
											<select
												{...field}
												className={`w-full px-4 py-2.5 rounded-md border
												text-gray-800 bg-white
												focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
												disabled:bg-gray-50 disabled:cursor-not-allowed
												transition-all duration-200
												${errors.success_criteria ? 'border-red-500' : 'border-gray-300'}`}
											>
												<option value="">Select Success Criteria</option>
												<option value="call_completed">Call Completed</option>
												<option value="positive_response">Positive Response</option>
												<option value="appointment_scheduled">Appointment Scheduled</option>
												<option value="sale_made">Sale Made</option>
											</select>
											{errors.success_criteria && (
												<p className="mt-1.5 text-sm text-red-500">{errors.success_criteria.message}</p>
											)}
										</div>
									)}
								/>
							</div>
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
								label={renderRequiredLabel('Calls Per Day')}
								{...register('calls_per_day')}
							/>
							{renderFieldError(errors.calls_per_day)}
							<Input
								type="number"
								label={renderRequiredLabel('Max Attempts Per Lead')}
								{...register('max_attempts_per_lead')}
							/>
							{renderFieldError(errors.max_attempts_per_lead)}
							<Input
								type="number"
								label={renderRequiredLabel('Retry Delay (minutes)')}
								{...register('retry_delay_minutes')}
							/>
							{renderFieldError(errors.retry_delay_minutes)}
						</div>
					</div>
				);

			case 4: // Lead Management
				return (
					<div className="space-y-8">
						<div className="space-y-6">
							<div>
								<h2 className="text-base font-semibold leading-7 text-gray-900">
									Upload Leads
								</h2>
								<p className="mt-1 text-sm leading-6 text-gray-600">
									Upload your leads CSV file. Make sure it contains the required fields.
								</p>
							</div>

							<div className="col-span-full">
								<div className="mt-2 flex flex-col items-start space-y-4">
									<a
										href="/sample-leads.csv"
										download
										className="inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
									>
										<Download className="-ml-0.5 h-5 w-5" aria-hidden="true" />
										Download Sample CSV
									</a>
									
									<div className="w-full">
										<label
											htmlFor="file-upload"
											className="block text-sm font-medium leading-6 text-gray-900"
										>
											CSV File
										</label>
										<div className="mt-2 flex items-center justify-between gap-x-3">
											<input
												type="file"
												id="file-upload"
												name="file-upload"
												accept=".csv"
												onChange={handleFileUpload}
												className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											/>
										</div>
									</div>

									{uploadedFile && (
										<div className="mt-4 flex items-center space-x-2">
											<CheckCircle className="h-5 w-5 text-green-500" />
											<span className="text-sm text-gray-600">
												File uploaded: {uploadedFile.name}
											</span>
											<button
												type="button"
												onClick={() => setUploadedFile(null)}
												className="ml-2 text-gray-400 hover:text-gray-500"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									)}
								</div>
							</div>

							<div className="rounded-md bg-blue-50 p-4">
								<div className="flex">
									<div className="flex-shrink-0">
										<Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-blue-800">CSV Format Requirements</h3>
										<div className="mt-2 text-sm text-blue-700">
											<p>Your CSV file should include the following columns:</p>
											<ul className="mt-1 list-disc list-inside space-y-1">
												<li>first_name - Contact's first name</li>
												<li>last_name - Contact's last name</li>
												<li>phone - Phone number in E.164 format (e.g., +14155552671)</li>
												<li>email - Contact's email address</li>
												<li>company_name - Company name</li>
												<li>job_title - Job title</li>
												<li>industry - Industry</li>
												<li>priority - Priority level (1-3)</li>
												<li>lead_score - Lead score (0-100)</li>
												<li>interest_level - Interest level (low/medium/high)</li>
												<li>tags - Comma-separated tags</li>
											</ul>
										</div>
									</div>
								</div>
							</div>

							{parsedLeads.length > 0 && (
								<div className="rounded-md bg-green-50 p-4">
									<div className="flex">
										<div className="flex-shrink-0">
											<CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
										</div>
										<div className="ml-3">
											<h3 className="text-sm font-medium text-green-800">
												{parsedLeads.length} leads ready to import
											</h3>
											<div className="mt-2 text-sm text-green-700">
												<p>Your leads have been validated and are ready to be imported.</p>
											</div>
										</div>
									</div>
								</div>
							)}

							{errors.file && (
								<div className="rounded-md bg-red-50 p-4">
									<div className="flex">
										<div className="flex-shrink-0">
											<AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
										</div>
										<div className="ml-3">
											<h3 className="text-sm font-medium text-red-800">Upload Error</h3>
											<div className="mt-2 text-sm text-red-700">
												<p>{errors.file.message}</p>
											</div>
										</div>
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

	useImperativeHandle(ref, () => ({
		submitForm: handleSubmit(onSubmit),
		trigger,
		formState: { errors },
		getValues
	}), [handleSubmit, onSubmit, trigger, errors, getValues]);

	// Save form data to localStorage whenever it changes
	const formData = watch();
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [formData]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{renderStepContent()}
			{Object.keys(errors).length > 0 && (
				<div className="text-red-500">
					Please fix the errors above to continue.
				</div>
			)}
		</form>
	);
});