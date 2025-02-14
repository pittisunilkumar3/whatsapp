import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const EmailIntegration = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const [activeTab, setActiveTab] = useState<'config' | 'test'>('config');
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
					<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
						<div className="space-y-1">
							<h3 className="font-medium text-gray-900">Email Service Status</h3>
							<p className="text-sm text-gray-500">Enable or disable all mailing services</p>
						</div>
						<div className="flex items-center gap-3">
							<span className={`text-sm ${isEnabled ? 'text-green-600' : 'text-gray-600'}`}>
								{isEnabled ? 'Active' : 'Inactive'}
							</span>
							<Switch checked={isEnabled} onChange={setIsEnabled} />
						</div>
					</div>

					<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
						<div className="space-y-1">
							<h3 className="text-lg font-medium text-gray-900">Mail Server Configuration</h3>
							<p className="text-sm text-gray-500">Configure your email server settings</p>
						</div>

						<div className="space-y-6">
							<Input
								label="Mailer Name"
								value={config.mailerName}
								placeholder="Enter mailer name"
								className="max-w-md"
								onChange={(e) => setConfig(prev => ({ ...prev, mailerName: e.target.value }))}
							/>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<Input
									label="Host"
									value={config.host}
									placeholder="mail.example.com"
									onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
								/>
								<Input
									label="Driver"
									value={config.driver}
									placeholder="SMTP"
									onChange={(e) => setConfig(prev => ({ ...prev, driver: e.target.value }))}
								/>
								<Input
									label="Port"
									value={config.port}
									placeholder="587"
									onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
								/>
							</div>

							<div className="space-y-6">
								<Input
									label="Username"
									value={config.username}
									placeholder="username@example.com"
									className="max-w-md"
									onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
								/>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<Input
										label="Email ID"
										value={config.emailId}
										placeholder="email@example.com"
										onChange={(e) => setConfig(prev => ({ ...prev, emailId: e.target.value }))}
									/>
									<Input
										label="Encryption"
										value={config.encryption}
										placeholder="TLS/SSL"
										onChange={(e) => setConfig(prev => ({ ...prev, encryption: e.target.value }))}
									/>
									<Input
										label="Password"
										type="password"
										value={config.password}
										placeholder="••••••••"
										onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-end gap-4 pt-6 border-t">
							<Button 
								variant="secondary" 
								className="px-6"
							>
								Reset
							</Button>
							<Button 
								onClick={handleSave} 
								className="px-6 bg-blue-600 hover:bg-blue-700"
							>
								Save Changes
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
				<div className="space-y-1">
					<h2 className="text-lg font-medium text-gray-900">Send Test Email</h2>
					<p className="text-sm text-gray-500">Verify your email configuration by sending a test email</p>
				</div>

				<div className="space-y-6 max-w-2xl">
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
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">Message</label>
						<textarea
							className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
							value={testEmail.message}
							onChange={(e) => setTestEmail(prev => ({ ...prev, message: e.target.value }))}
							placeholder="Enter your test message here..."
						/>
					</div>
				</div>

				<div className="flex justify-end pt-6 border-t">
					<Button 
						onClick={handleTestEmail} 
						className="px-6 bg-blue-600 hover:bg-blue-700"
					>
						Send Test Email
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 md:p-8">
			<div className="max-w-[1200px] mx-auto space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-center gap-6">
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