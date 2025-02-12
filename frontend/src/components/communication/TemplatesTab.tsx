import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Dropdown } from '../ui/Dropdown';
import { Modal } from '../ui/Modal';
import { PlusCircle, Search, Edit2, Trash2 } from 'lucide-react';

interface Template {
	id: string;
	name: string;
	content: string;
	type: 'marketing' | 'support' | 'onboarding' | 'feedback';
	status: 'active' | 'draft' | 'archived';
	lastModified: string;
}

export const TemplatesTab: React.FC<{ channel: 'whatsapp' | 'sms' | 'email' }> = ({ channel }) => {
	const [templates, setTemplates] = useState<Template[]>([
		{
			id: '1',
			name: 'Welcome Message',
			content: 'Hello {{name}}, welcome to our service!',
			type: 'onboarding',
			status: 'active',
			lastModified: '2024-02-15'
		},
		{
			id: '2',
			name: 'Support Follow-up',
			content: 'Hi {{name}}, how was your experience with our support team?',
			type: 'support',
			status: 'active',
			lastModified: '2024-02-14'
		}
	]);
	const [showNewTemplate, setShowNewTemplate] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');

	const filteredTemplates = templates.filter(template => {
		const searchMatch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
		const typeMatch = typeFilter === 'all' || template.type === typeFilter;
		return searchMatch && typeMatch;
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
					<div className="relative w-full sm:w-64">
						<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Search templates..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Dropdown
						value={typeFilter}
						onChange={setTypeFilter}
						options={[
							{ label: 'All Types', value: 'all' },
							{ label: 'Marketing', value: 'marketing' },
							{ label: 'Support', value: 'support' },
							{ label: 'Onboarding', value: 'onboarding' },
							{ label: 'Feedback', value: 'feedback' }
						]}
						className="w-full sm:w-40"
					/>
				</div>
				<Button onClick={() => setShowNewTemplate(true)} className="w-full sm:w-auto">
					<PlusCircle className="w-4 h-4 mr-2" />
					New Template
				</Button>
			</div>

			<div className="grid gap-4">
				{filteredTemplates.map((template) => (
					<Card key={template.id} className="p-4">
						<div className="flex flex-col sm:flex-row justify-between gap-4">
							<div>
								<h3 className="font-semibold">{template.name}</h3>
								<p className="text-sm text-gray-600 mt-1">{template.content}</p>
								<div className="flex items-center gap-3 mt-2">
									<span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{template.type}</span>
									<span className="text-xs text-gray-500">Last modified: {template.lastModified}</span>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="sm">
									<Edit2 className="w-4 h-4" />
								</Button>
								<Button variant="ghost" size="sm" className="text-red-500">
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>

			<Modal
				isOpen={showNewTemplate}
				onClose={() => setShowNewTemplate(false)}
				title="Create New Template"
			>
				<div className="space-y-4">
					<Input label="Template Name" placeholder="Enter template name" />
					<Dropdown
						label="Template Type"
						value=""
						onChange={() => {}}
						options={[
							{ label: 'Marketing', value: 'marketing' },
							{ label: 'Support', value: 'support' },
							{ label: 'Onboarding', value: 'onboarding' },
							{ label: 'Feedback', value: 'feedback' }
						]}
					/>
					<div>
						<label className="block text-sm font-medium mb-1">Template Content</label>
						<textarea
							className="w-full h-32 resize-none border rounded-lg p-2"
							placeholder={`Enter your ${channel} template content...`}
						/>
					</div>
					<div className="flex justify-end space-x-3 mt-6">
						<Button variant="outline" onClick={() => setShowNewTemplate(false)}>
							Cancel
						</Button>
						<Button>Create Template</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};