import React, { useState } from 'react';
import { MessageSquare, Users, Inbox, BarChart2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { LeadsTab } from './LeadsTab';
import { CampaignsTab } from './CampaignsTab';
import { SmartInbox } from './SmartInbox';
import { CommunicationAnalytics } from './CommunicationAnalytics';

interface TabProps {
	children: React.ReactNode;
	value: string;
}

const TabContent: React.FC<TabProps> = ({ children }) => (
	<div className="mt-4">{children}</div>
);

export const CommunicationTabs: React.FC = () => {
	const [activeTab, setActiveTab] = useState('leads');

	const tabs = [
		{ id: 'leads', label: 'Leads', icon: <Users size={16} /> },
		{ id: 'campaigns', label: 'Campaigns', icon: <MessageSquare size={16} /> },
		{ id: 'inbox', label: 'Smart Inbox', icon: <Inbox size={16} /> },
		{ id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} /> }
	];

	const channelTabs = [
		{ id: 'all', label: 'All Channels' },
		{ id: 'whatsapp', label: 'WhatsApp' },
		{ id: 'sms', label: 'SMS' },
		{ id: 'voice', label: 'Voice' },
		{ id: 'email', label: 'Email' }
	];

	return (
		<div className="space-y-6 overflow-hidden">
			<Tabs
				tabs={tabs}
				activeTab={activeTab}
				onChange={setActiveTab}
				className="mb-6 overflow-x-auto"
			/>

			{activeTab !== 'inbox' && (
				<div className="flex flex-wrap gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2">
					{channelTabs.map((tab) => (
						<button
							key={tab.id}
							className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
								${tab.id === 'all'
									? 'bg-primary text-white shadow-sm'
									: 'text-gray-600 hover:bg-gray-100 hover:text-primary'}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			)}

			<Card className="p-4 sm:p-6">
				<TabContent value={activeTab}>
					{activeTab === 'leads' && <LeadsTab />}
					{activeTab === 'campaigns' && <CampaignsTab />}
					{activeTab === 'inbox' && <SmartInbox />}
					{activeTab === 'analytics' && <CommunicationAnalytics />}
				</TabContent>
			</Card>
		</div>
	);
};