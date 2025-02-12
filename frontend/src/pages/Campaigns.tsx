import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusPill } from '../components/ui/StatusPill';
import { 
	MessageSquare, 
	Phone, 
	Mail, 
	MessageCircle,
	Plus,
	MoreVertical,
	Play,
	Pause,
	Trash2
} from 'lucide-react';

interface Campaign {
	id: string;
	name: string;
	channel: 'whatsapp' | 'sms' | 'voice' | 'email';
	status: 'active' | 'paused' | 'completed';
	leads: number;
	responses: number;
	conversions: number;
	lastUpdated: string;
}

const mockCampaigns: Campaign[] = [
	{
		id: '1',
		name: 'Spring Sale Follow-up',
		channel: 'whatsapp',
		status: 'active',
		leads: 1250,
		responses: 425,
		conversions: 89,
		lastUpdated: '2024-02-15T10:30:00Z'
	},
	{
		id: '2',
		name: 'Product Demo Invitation',
		channel: 'email',
		status: 'paused',
		leads: 850,
		responses: 234,
		conversions: 45,
		lastUpdated: '2024-02-14T15:45:00Z'
	},
	// Add more mock campaigns...
];

const channelIcons = {
	whatsapp: MessageSquare,
	sms: MessageCircle,
	voice: Phone,
	email: Mail,
};

export const Campaigns: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState('');

	const handleCreateCampaign = () => {
		// TODO: Implement campaign creation
		console.log('Creating new campaign...');
	};

	const handleCampaignAction = (campaignId: string, action: 'start' | 'pause' | 'delete') => {
		// TODO: Implement campaign actions
		console.log(`${action} campaign ${campaignId}`);
	};

	const filteredCampaigns = mockCampaigns.filter(campaign =>
		campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h1 className="text-xl sm:text-2xl font-semibold text-primary-text">Campaigns</h1>
				<Button onClick={handleCreateCampaign} className="w-full sm:w-auto">
					<Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
					Create Campaign
				</Button>
			</div>

			<Card className="p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<Input
						placeholder="Search campaigns..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full sm:max-w-md"
					/>
					<div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
						{Object.entries(channelIcons).map(([channel, Icon]) => (
							<Button
								key={channel}
								variant="ghost"
								className="px-3 whitespace-nowrap"
							>
								<Icon className="w-4 h-4 sm:w-5 sm:h-5" />
							</Button>
						))}
					</div>
				</div>
			</Card>

			<div className="space-y-4">
				{filteredCampaigns.map((campaign) => {
					const Icon = channelIcons[campaign.channel];
					return (
						<Card key={campaign.id} className="p-4 sm:p-6">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="flex items-start sm:items-center gap-4">
									<div className={`p-2 rounded-lg ${
										campaign.channel === 'whatsapp' ? 'bg-whatsapp-green' : 
										campaign.channel === 'email' ? 'bg-blue-500' :
										campaign.channel === 'sms' ? 'bg-purple-500' : 'bg-orange-500'
									} bg-opacity-10`}>
										<Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
											campaign.channel === 'whatsapp' ? 'text-whatsapp-green' :
											campaign.channel === 'email' ? 'text-blue-500' :
											campaign.channel === 'sms' ? 'text-purple-500' : 'text-orange-500'
										}`} />
									</div>
									<div>
										<h3 className="font-semibold text-sm sm:text-base">{campaign.name}</h3>
										<div className="flex items-center gap-2 mt-1">
											<StatusPill status={campaign.status} />
											<span className="text-xs sm:text-sm text-secondary-text">
												{new Date(campaign.lastUpdated).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
									<div className="grid grid-cols-3 gap-4 sm:gap-8 w-full sm:mr-8">
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-semibold">{campaign.leads}</div>
											<div className="text-xs sm:text-sm text-secondary-text">Leads</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-semibold">{campaign.responses}</div>
											<div className="text-xs sm:text-sm text-secondary-text">Responses</div>
										</div>
										<div className="text-center">
											<div className="text-lg sm:text-2xl font-semibold">{campaign.conversions}</div>
											<div className="text-xs sm:text-sm text-secondary-text">Conversions</div>
										</div>
									</div>

									<div className="flex items-center gap-2 w-full sm:w-auto justify-end">
										{campaign.status === 'paused' ? (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleCampaignAction(campaign.id, 'start')}
												className="flex-1 sm:flex-none"
											>
												<Play className="w-4 h-4" />
											</Button>
										) : (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleCampaignAction(campaign.id, 'pause')}
												className="flex-1 sm:flex-none"
											>
												<Pause className="w-4 h-4" />
											</Button>
										)}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleCampaignAction(campaign.id, 'delete')}
											className="flex-1 sm:flex-none"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
};