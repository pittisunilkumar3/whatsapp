import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs } from '../../components/ui/Tabs';
import { ChannelSettings } from '../../components/settings/ChannelSettings';
import { PromptSettings } from '../../components/settings/PromptSettings';
import { ConversationScoring } from '../../components/settings/ConversationScoring';
import { CompanyProfile } from '../../components/settings/CompanyProfile';
import { UserManagement } from '../../components/settings/UserManagement';
import { Building, MessageSquare, Sliders, Users } from 'lucide-react';

export const CompanySettings: React.FC = () => {
	const [activeTab, setActiveTab] = useState('profile');

	const tabs = [
		{
			id: 'profile',
			label: 'Company Profile',
			icon: Building,
			component: CompanyProfile
		},
		{
			id: 'channels',
			label: 'Channel Settings',
			icon: MessageSquare,
			component: ChannelSettings
		},
		{
			id: 'prompts',
			label: 'Prompt Settings',
			icon: Sliders,
			component: PromptSettings
		},
		{
			id: 'scoring',
			label: 'Conversation Scoring',
			icon: Sliders,
			component: ConversationScoring
		},
		{
			id: 'users',
			label: 'User Management',
			icon: Users,
			component: UserManagement
		}
	];

	return (
		<div className="space-y-4">
			<div className="px-3 sm:px-6">
				<h1 className="text-lg sm:text-2xl font-semibold text-primary-text">Settings</h1>
				<p className="text-sm text-secondary-text mt-1">
					Manage your company settings and preferences
				</p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="overflow-x-auto scrollbar-hide"
			>
				<div className="min-w-max px-3 sm:px-6">
					<Tabs 
						tabs={tabs} 
						activeTab={activeTab} 
						onChange={setActiveTab}
						className="text-sm touch-manipulation"
					/>
				</div>
			</motion.div>

			<motion.div
				key={activeTab}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3 }}
				className="px-3 sm:px-6 pb-6"
			>
				{tabs.map(tab => (
					activeTab === tab.id && <tab.component key={tab.id} />
				))}
			</motion.div>
		</div>
	);
};