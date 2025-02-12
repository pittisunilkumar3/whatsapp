import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DataTable } from '../ui/DataTable';
import { StatusPill } from '../ui/StatusPill';
import { Wand2, Clock, Send } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Switch } from '../ui/Switch';

interface ChannelSettings {
	enabled: boolean;
	threshold: number;
	template: string;
}

interface UnresponsiveLead {
	id: string;
	name: string;
	lastContact: string;
	daysInactive: number;
	channel: 'whatsapp' | 'sms' | 'voice' | 'email';
	status: 'unresponsive' | 're-engaging' | 'converted';
}

const mockLeads: UnresponsiveLead[] = [
	{
		id: '1',
		name: 'John Smith',
		lastContact: '2024-02-01',
		daysInactive: 15,
		channel: 'whatsapp',
		status: 'unresponsive'
	},
	{
		id: '2',
		name: 'Sarah Johnson',
		lastContact: '2024-02-05',
		daysInactive: 11,
		channel: 'email',
		status: 're-engaging'
	}
];

export const UnresponsiveLeadHandler: React.FC = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [autoReengagement, setAutoReengagement] = useState(true);
	const [inactivityThreshold, setInactivityThreshold] = useState(10);
	const [channelSettings, setChannelSettings] = useState<Record<string, ChannelSettings>>({
		whatsapp: { enabled: true, threshold: 10, template: 'Hi {{lead.name}}, we noticed you haven\'t responded...' },
		sms: { enabled: true, threshold: 12, template: 'Hi {{lead.name}}, following up on our conversation...' },
		voice: { enabled: false, threshold: 15, template: 'Hello {{lead.name}}, this is {{agent.name}} from...' },
		email: { enabled: true, threshold: 14, template: 'Dear {{lead.name}}, I hope this email finds you well...' }
	});

	const handleAIReengagement = async (leadId: string) => {
		const lead = mockLeads.find(l => l.id === leadId);
		if (!lead) return;

		try {
			// Simulate AI analysis and re-engagement
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Update lead status
			const updatedLeads = mockLeads.map(l => 
				l.id === leadId ? { ...l, status: 're-engaging' as const } : l
			);
			// Update leads state here
		} catch (error) {
			console.error('AI re-engagement failed:', error);
		}
	};

	const columns = [
		{
			header: 'Name',
			accessorKey: 'name'
		},
		{
			header: 'Last Contact',
			accessorKey: 'lastContact'
		},
		{
			header: 'Days Inactive',
			accessorKey: 'daysInactive',
			cell: (info: any) => (
				<span className={info.getValue() > inactivityThreshold ? 'text-red-500' : ''}>
					{info.getValue()} days
				</span>
			)
		},
		{
			header: 'Status',
			accessorKey: 'status',
			cell: (info: any) => <StatusPill status={info.getValue()} />
		},
		{
			header: 'Actions',
			cell: () => (
				<Button size="sm">
					<Send className="w-4 h-4 mr-2" />
					Re-engage
				</Button>
			)
		}
	];

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-lg font-semibold">Unresponsive Leads</h2>
					<p className="text-secondary-text mt-1">
						Manage and re-engage inactive leads
					</p>
				</div>
				<div className="space-x-3">
					<Button variant="ghost" onClick={() => setIsSettingsOpen(true)}>
						<Clock className="w-4 h-4 mr-2" />
						Configure
					</Button>
					<Button>
						<Wand2 className="w-4 h-4 mr-2" />
						AI Re-engagement
					</Button>
				</div>
			</div>

			<Card className="p-6">
				<DataTable
					columns={columns}
					data={mockLeads}
					pagination
				/>
			</Card>

			<Modal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				title="Re-engagement Settings"
			>
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Automatic Re-engagement</p>
							<p className="text-sm text-secondary-text">
								Automatically start re-engagement campaigns
							</p>
						</div>
						<Switch checked={autoReengagement} onChange={setAutoReengagement} />
					</div>

					<div className="space-y-4">
						<h3 className="font-medium">Channel Settings</h3>
						{Object.entries(channelSettings).map(([channel, settings]) => (
							<div key={channel} className="space-y-2 border-b pb-4">
								<div className="flex items-center justify-between">
									<p className="capitalize">{channel}</p>
									<Switch
										checked={settings.enabled}
										onChange={(checked) => setChannelSettings(prev => ({
											...prev,
											[channel]: { ...prev[channel], enabled: checked }
										}))}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="text-sm">Threshold (Days)</label>
										<input
											type="number"
											value={settings.threshold}
											onChange={(e) => setChannelSettings(prev => ({
												...prev,
												[channel]: { ...prev[channel], threshold: Number(e.target.value) }
											}))}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-whatsapp-green focus:ring-whatsapp-green sm:text-sm"
											min="1"
											max="30"
										/>
									</div>
									<div>
										<label className="text-sm">Template</label>
										<textarea
											value={settings.template}
											onChange={(e) => setChannelSettings(prev => ({
												...prev,
												[channel]: { ...prev[channel], template: e.target.value }
											}))}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-whatsapp-green focus:ring-whatsapp-green sm:text-sm"
											rows={2}
										/>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="flex justify-end space-x-3">
						<Button variant="ghost" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
						<Button onClick={() => setIsSettingsOpen(false)}>Save Changes</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};