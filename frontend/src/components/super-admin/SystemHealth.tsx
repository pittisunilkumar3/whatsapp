import React from 'react';
import { Card } from '../ui/Card';
import { StatusPill } from '../ui/StatusPill';
import { LineChart } from '../charts/LineChart';
import { Server, Database, MessageSquare, Globe, Cpu, HardDrive } from 'lucide-react';

const systemMetrics = {
	uptime: '99.99%',
	responseTime: '245ms',
	errorRate: '0.02%',
	activeUsers: '1,234',
	cpuUsage: '42%',
	memoryUsage: '68%',
	services: [
		{ name: 'API Gateway', status: 'active', icon: Server },
		{ name: 'Database Cluster', status: 'active', icon: Database },
		{ name: 'Message Queue', status: 'active', icon: MessageSquare },
		{ name: 'CDN', status: 'active', icon: Globe }
	],
	performanceData: {
		labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
		datasets: [
			{
				label: 'CPU Usage',
				data: [35, 38, 45, 52, 48, 42],
				borderColor: '#4CAF50'
			},
			{
				label: 'Memory Usage',
				data: [62, 65, 70, 68, 65, 68],
				borderColor: '#2196F3'
			}
		]
	}
};

export const SystemHealth: React.FC = () => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-3 gap-6">
				<Card className="p-6">
					<div className="flex items-center space-x-3">
						<Cpu className="w-6 h-6 text-whatsapp-green" />
						<div>
							<h3 className="text-secondary-text text-sm">CPU Usage</h3>
							<p className="text-2xl font-semibold mt-1">{systemMetrics.cpuUsage}</p>
						</div>
					</div>
				</Card>
				<Card className="p-6">
					<div className="flex items-center space-x-3">
						<HardDrive className="w-6 h-6 text-blue-500" />
						<div>
							<h3 className="text-secondary-text text-sm">Memory Usage</h3>
							<p className="text-2xl font-semibold mt-1">{systemMetrics.memoryUsage}</p>
						</div>
					</div>
				</Card>
				<Card className="p-6">
					<div className="flex items-center space-x-3">
						<Globe className="w-6 h-6 text-purple-500" />
						<div>
							<h3 className="text-secondary-text text-sm">Active Users</h3>
							<p className="text-2xl font-semibold mt-1">{systemMetrics.activeUsers}</p>
						</div>
					</div>
				</Card>
			</div>

			<div className="grid grid-cols-2 gap-6">
				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Service Status</h3>
					<div className="space-y-4">
						{systemMetrics.services.map((service) => (
							<div key={service.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center space-x-3">
									<service.icon className="w-5 h-5 text-secondary-text" />
									<span className="font-medium">{service.name}</span>
								</div>
								<StatusPill status={service.status} />
							</div>
						))}
					</div>
				</Card>

				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">System Performance</h3>
					<LineChart
						labels={systemMetrics.performanceData.labels}
						datasets={systemMetrics.performanceData.datasets}
					/>
				</Card>
			</div>
		</div>
	);
};