import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Switch } from '../../../components/ui/Switch';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const EmailIntegration = () => {
	const [activeTab, setActiveTab] = useState<'config' | 'test'>('config');
	const [isEnabled, setIsEnabled] = useState(false);
	const [config, setConfig] = useState({
		mailerName: 'SVEats',
		host: 'sveats.cyberdetox.in',
		driver: 'SMTP',
		port: '465',
		username: 'info@sveats.cyberdetox.in',
		emailId: 'info@sveats.cyberdetox.in',
		encryption: 'SSL',
		password: 'Renangiyamini@143'
	});

	const [testEmail, setTestEmail] = useState({
		to: '',
		subject: '',
		message: ''
	});

	const handleSave = () => {
		console.log('Saving configuration:', config);
	};

	const handleTestEmail = () => {
		console.log('Sending test email:', testEmail);
	};

	const renderContent = () => {
		if (activeTab === 'config') {
			return (
				<div className="space-y-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<span className="text-gray-600">Turn OFF</span>
							<Switch checked={isEnabled} onChange={setIsEnabled} />
						</div>
					</div>
					
					<p className="text-sm text-gray-500 mb-8">*By Turning OFF mail configuration all your mailing services will be off.</p>

					<div className="space-y-6">
						<Input
							label="Mailer name"
							value={config.mailerName}
							onChange={(e) => setConfig(prev => ({ ...prev, mailerName: e.target.value }))}
						/>

						<div className="grid grid-cols-3 gap-6">
							<Input
								label="Host"
								value={config.host}
								onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
							/>
							<Input
								label="Driver"
								value={config.driver}
								onChange={(e) => setConfig(prev => ({ ...prev, driver: e.target.value }))}
							/>
							<Input
								label="Port"
								value={config.port}
								onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
							/>
						</div>

						<Input
							label="Username"
							value={config.username}
							onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
						/>

						<div className="grid grid-cols-3 gap-6">
							<Input
								label="Email id"
								value={config.emailId}
								onChange={(e) => setConfig(prev => ({ ...prev, emailId: e.target.value }))}
							/>
							<Input
								label="Encryption"
								value={config.encryption}
								onChange={(e) => setConfig(prev => ({ ...prev, encryption: e.target.value }))}
							/>
							<Input
								label="Password"
								type="password"
								value={config.password}
								onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
							/>
						</div>
					</div>

					<div className="flex justify-end gap-4 mt-8">
						<Button variant="secondary" className="px-8">Reset</Button>
						<Button onClick={handleSave} className="px-8 bg-blue-600 hover:bg-blue-700">Save</Button>
					</div>
				</div>
			);
		}

		return (
			<div className="space-y-6">
				<h2 className="text-lg font-semibold">Send Test Email</h2>
				<div className="space-y-4">
					<Input
						label="To"
						value={testEmail.to}
						onChange={(e) => setTestEmail(prev => ({ ...prev, to: e.target.value }))}
						placeholder="recipient@example.com"
					/>
					<Input
						label="Subject"
						value={testEmail.subject}
						onChange={(e) => setTestEmail(prev => ({ ...prev, subject: e.target.value }))}
						placeholder="Test Email Subject"
					/>
					<div>
						<label className="block text-sm font-medium mb-2">Message</label>
						<textarea
							className="w-full p-2 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={testEmail.message}
							onChange={(e) => setTestEmail(prev => ({ ...prev, message: e.target.value }))}
							placeholder="Enter your test message here..."
						/>
					</div>
				</div>
				<div className="flex justify-end pt-4">
					<Button onClick={handleTestEmail} className="px-8 bg-blue-600 hover:bg-blue-700">Send Test Email</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="w-full min-h-screen bg-gray-50 p-8">
			<div className="max-w-[1200px] mx-auto">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-8">
						<button 
							className={`flex items-center gap-2 ${activeTab === 'config' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'} pb-1`}
							onClick={() => setActiveTab('config')}
						>
							<span className="text-xl">🔧</span>
							<span className="text-lg font-medium">Mail Config</span>
						</button>
						<button 
							className={`flex items-center gap-2 ${activeTab === 'test' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'} pb-1`}
							onClick={() => setActiveTab('test')}
						>
							<span className="text-xl">✉️</span>
							<span className="text-lg">Send Test Mail</span>
						</button>
					</div>
					<button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
						<span>How it Works</span>
						<InformationCircleIcon className="w-5 h-5" />
					</button>
				</div>

				<Card className="w-full bg-white shadow-sm">
					<div className="p-8">
						{renderContent()}
					</div>
				</Card>
			</div>
		</div>
	);
};

export default EmailIntegration;



