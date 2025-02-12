import React from 'react';
import { motion } from 'framer-motion';
import { Tabs } from '../../components/ui/Tabs';
import { LeadsTab } from '../../components/communication/LeadsTab';
import { CampaignsTab } from '../../components/communication/CampaignsTab';
import { SmartInbox } from '../../components/communication/SmartInbox';
import { MessageSquare, Users, Inbox } from 'lucide-react';

export const EmployeeCommunicationHub: React.FC = () => {
	const [activeTab, setActiveTab] = React.useState('leads');

	const tabs = [
		{ id: 'leads', label: 'Assigned Leads', icon: Users },
		{ id: 'campaigns', label: 'Active Campaigns', icon: MessageSquare },
		{ id: 'inbox', label: 'Inbox', icon: Inbox }
	];

	return (
		<div className="p-6 space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-primary-text">Communication Hub</h1>
					<p className="text-secondary-text mt-1">
						Manage your assigned leads and conversations
					</p>
				</div>

				<Tabs
					tabs={tabs}
					activeTab={activeTab}
					onChange={setActiveTab}
					className="mb-6"
				/>

				<div className="mt-6">
					{activeTab === 'leads' && (
						<LeadsTab 
							readOnly={true}
							showAssignedOnly={true}
						/>
					)}
					{activeTab === 'campaigns' && (
						<CampaignsTab 
							readOnly={true}
							showParticipatingOnly={true}
						/>
					)}
					{activeTab === 'inbox' && (
						<SmartInbox 
							showAssignedOnly={true}
						/>
					)}
				</div>
			</motion.div>
		</div>
	);
};