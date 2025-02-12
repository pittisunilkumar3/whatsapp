import { type FC, useState } from 'react';
import { Settings, MessageSquare, Bell, Shield, Mail, Phone, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Card } from '../../components/ui/Card';

interface SettingsSection {
	id: string;
	title: string;
	icon: any;
}

const settingsSections: SettingsSection[] = [
	{ id: 'general', title: 'General Settings', icon: Settings },
	{ id: 'notifications', title: 'Notification Settings', icon: Bell },
	{ id: 'security', title: 'Security Settings', icon: Shield },
	{ id: 'communication', title: 'Communication Settings', icon: MessageSquare },
];

export const SettingsPage: FC = () => {
	const [activeSection, setActiveSection] = useState('general');
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [smsNotifications, setSmsNotifications] = useState(false);
	const [systemUpdates, setSystemUpdates] = useState(true);
	const [securityAlerts, setSecurityAlerts] = useState(true);

	const handleSaveSettings = () => {
		// Implement settings save logic
		console.log('Settings saved');
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-semibold text-primary-text">System Settings</h1>
					<p className="text-secondary-text mt-1">
						Manage your system preferences and configurations
					</p>
				</div>
				<Button onClick={handleSaveSettings}>
					<Save className="w-4 h-4 mr-2" />
					Save Changes
				</Button>
			</div>

			<div className="grid grid-cols-12 gap-6">
				{/* Settings Navigation */}
				<Card className="col-span-3 p-4">
					<nav className="space-y-2">
						{settingsSections.map((section) => (
							<button
								key={section.id}
								onClick={() => setActiveSection(section.id)}
								className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
									${activeSection === section.id
										? 'bg-primary text-white'
										: 'hover:bg-gray-100'
									}`}
							>
								<section.icon className="w-5 h-5" />
								<span>{section.title}</span>
							</button>
						))}
					</nav>
				</Card>

				{/* Settings Content */}
				<Card className="col-span-9 p-6">
					{activeSection === 'general' && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold mb-4">General Settings</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										System Name
									</label>
									<Input
										placeholder="Enter system name"
										defaultValue="Enterprise CRM"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Default Language
									</label>
									<Select defaultValue="en">
										<option value="en">English</option>
										<option value="es">Spanish</option>
										<option value="fr">French</option>
									</Select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Time Zone
									</label>
									<Select defaultValue="utc">
										<option value="utc">UTC</option>
										<option value="est">EST</option>
										<option value="pst">PST</option>
									</Select>
								</div>
							</div>
						</div>
					)}

					{activeSection === 'notifications' && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium">Email Notifications</h3>
										<p className="text-sm text-secondary-text">
											Receive system notifications via email
										</p>
									</div>
									<Switch
										checked={emailNotifications}
										onChange={setEmailNotifications}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium">SMS Notifications</h3>
										<p className="text-sm text-secondary-text">
											Receive system notifications via SMS
										</p>
									</div>
									<Switch
										checked={smsNotifications}
										onChange={setSmsNotifications}
									/>
								</div>
							</div>
						</div>
					)}

					{activeSection === 'security' && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold mb-4">Security Settings</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Session Timeout (minutes)
									</label>
									<Input type="number" defaultValue="30" />
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Password Policy
									</label>
									<Select defaultValue="strong">
										<option value="basic">Basic</option>
										<option value="strong">Strong</option>
										<option value="custom">Custom</option>
									</Select>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium">Two-Factor Authentication</h3>
										<p className="text-sm text-secondary-text">
											Require 2FA for all admin accounts
										</p>
									</div>
									<Switch checked={true} disabled />
								</div>
							</div>
						</div>
					)}

					{activeSection === 'communication' && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold mb-4">Communication Settings</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										SMTP Server
									</label>
									<Input placeholder="smtp.example.com" />
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										SMTP Port
									</label>
									<Input type="number" defaultValue="587" />
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										SMS Gateway
									</label>
									<Select defaultValue="twilio">
										<option value="twilio">Twilio</option>
										<option value="aws">AWS SNS</option>
										<option value="custom">Custom Gateway</option>
									</Select>
								</div>
							</div>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};