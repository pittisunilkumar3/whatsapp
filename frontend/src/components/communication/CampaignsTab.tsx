import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Dropdown } from '../ui/Dropdown';
import { Modal } from '../ui/Modal';
import { PlusCircle, Search, Play, Pause, BarChart2, Calendar, Users, Clock } from 'lucide-react';

interface Campaign {
	id: string;
	name: string;
	status: 'active' | 'paused' | 'completed' | 'scheduled';
	type: 'promotional' | 'transactional' | 'automated';
	audience: number;
	reached: number;
	engagement: number;
	startDate: string;
	endDate?: string;
}


export const CampaignsTab: React.FC<{ channel: 'whatsapp' | 'sms' | 'email' }> = ({ channel }) => {
	const [campaigns, setCampaigns] = useState<Campaign[]>([
		{
			id: '1',
			name: 'Spring Sale Promotion',
			status: 'active',
			type: 'promotional',
			audience: 5000,
			reached: 3500,
			engagement: 65,
			startDate: '2024-02-15',
			endDate: '2024-03-15'
		},
		{
			id: '2',
			name: 'Welcome Series',
			status: 'active',
			type: 'automated',
			audience: 1000,
			reached: 800,
			engagement: 78,
			startDate: '2024-01-01'
		}
	]);

	const [showNewCampaign, setShowNewCampaign] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	const filteredCampaigns = campaigns.filter(campaign => {
		const searchMatch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
		const statusMatch = statusFilter === 'all' || campaign.status === statusFilter;
		return searchMatch && statusMatch;
	});

	const getStatusColor = (status: Campaign['status']) => {
		const colors = {
			active: 'bg-green-100 text-green-800',
			paused: 'bg-yellow-100 text-yellow-800',
			completed: 'bg-gray-100 text-gray-800',
			scheduled: 'bg-blue-100 text-blue-800'
		};
		return colors[status];
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
					<div className="relative w-full sm:w-64">
						<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<Input
							placeholder="Search campaigns..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Dropdown
						value={statusFilter}
						onChange={setStatusFilter}
						options={[
							{ label: 'All Status', value: 'all' },
							{ label: 'Active', value: 'active' },
							{ label: 'Paused', value: 'paused' },
							{ label: 'Completed', value: 'completed' },
							{ label: 'Scheduled', value: 'scheduled' }
						]}
						className="w-full sm:w-40"
					/>
				</div>
				<Button onClick={() => setShowNewCampaign(true)} className="w-full sm:w-auto">
					<PlusCircle className="w-4 h-4 mr-2" />
					New Campaign
				</Button>
			</div>

			<div className="grid gap-4">
				{filteredCampaigns.map((campaign) => (
					<Card key={campaign.id} className="p-4">
						<div className="flex flex-col sm:flex-row justify-between gap-4">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<h3 className="font-semibold">{campaign.name}</h3>
									<span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
										{campaign.status}
									</span>
								</div>
								<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
									<div className="flex items-center gap-1">
										<Users className="w-4 h-4" />
										<span>{campaign.audience.toLocaleString()} recipients</span>
									</div>
									<div className="flex items-center gap-1">
										<BarChart2 className="w-4 h-4" />
										<span>{campaign.engagement}% engagement</span>
									</div>
									<div className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										<span>{campaign.startDate}</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{campaign.status === 'active' ? (
									<Button variant="ghost" size="sm">
										<Pause className="w-4 h-4 mr-2" />
										Pause
									</Button>
								) : campaign.status === 'paused' ? (
									<Button variant="ghost" size="sm">
										<Play className="w-4 h-4 mr-2" />
										Resume
									</Button>
								) : null}
								<Button variant="outline" size="sm">
									View Details
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>

			<Modal
				isOpen={showNewCampaign}
				onClose={() => setShowNewCampaign(false)}
				title="Create New Campaign"
			>
				<div className="space-y-4">
					<Input label="Campaign Name" placeholder="Enter campaign name" />
					<Dropdown
						label="Campaign Type"
						value=""
						onChange={() => {}}
						options={[
							{ label: 'Promotional', value: 'promotional' },
							{ label: 'Transactional', value: 'transactional' },
							{ label: 'Automated', value: 'automated' }
						]}
					/>
					<div className="grid grid-cols-2 gap-4">
						<Input
							type="datetime-local"
							label="Start Date"
						/>
						<Input
							type="datetime-local"
							label="End Date"
						/>
					</div>
					<div className="flex justify-end space-x-3 mt-6">
						<Button variant="outline" onClick={() => setShowNewCampaign(false)}>
							Cancel
						</Button>
						<Button>Create Campaign</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};