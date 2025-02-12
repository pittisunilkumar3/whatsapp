import React from 'react';
import { Card } from '../ui/Card';
import { BarChart } from '../charts/BarChart';
import { PieChart } from '../charts/PieChart';

const subscriptionData = {
	plans: {
		labels: ['Enterprise', 'Business', 'Professional', 'Starter'],
		data: [35, 45, 60, 20],
		colors: ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800']
	},
	revenue: {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
		data: [45000, 52000, 49000, 60000, 55000, 65000]
	},
	metrics: [
		{
			label: 'Monthly Recurring Revenue',
			value: '$65,000',
			change: '+8.5%',
			isPositive: true
		},
		{
			label: 'Average Revenue Per User',
			value: '$199',
			change: '+5.2%',
			isPositive: true
		},
		{
			label: 'Churn Rate',
			value: '2.1%',
			change: '-0.5%',
			isPositive: true
		}
	]
};

export const SubscriptionAnalytics: React.FC = () => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-3 gap-6">
				{subscriptionData.metrics.map((metric) => (
					<Card key={metric.label} className="p-6">
						<h3 className="text-secondary-text text-sm">{metric.label}</h3>
						<div className="mt-2 flex items-baseline">
							<p className="text-2xl font-semibold">{metric.value}</p>
							<span className={`ml-2 text-sm ${
								metric.isPositive ? 'text-green-600' : 'text-red-600'
							}`}>
								{metric.change}
							</span>
						</div>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-2 gap-6">
				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Subscription Distribution</h3>
					<PieChart
						labels={subscriptionData.plans.labels}
						data={subscriptionData.plans.data}
						colors={subscriptionData.plans.colors}
					/>
				</Card>

				<Card className="p-6">
					<h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
					<BarChart
						labels={subscriptionData.revenue.labels}
						data={subscriptionData.revenue.data}
						label="Revenue"
					/>
				</Card>
			</div>
		</div>
	);
};