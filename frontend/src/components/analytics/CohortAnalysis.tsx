import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { HeatmapChart } from '../charts/HeatmapChart';
import { DateRangePicker } from '../ui/DateRangePicker';
import { Dropdown } from '../ui/Dropdown';

interface CohortData {
	weeks: string[];
	retention: number[][];
	totalUsers: number[];
}

const mockData: CohortData = {
	weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
	retention: [
		[100, 80, 70, 65, 60],
		[100, 75, 65, 60, 0],
		[100, 72, 63, 0, 0],
		[100, 70, 0, 0, 0],
		[100, 0, 0, 0, 0]
	],
	totalUsers: [500, 450, 400, 350, 300]
};

export const CohortAnalysis: React.FC = () => {
	const [metric, setMetric] = useState('retention');
	const [cohortSize, setCohortSize] = useState('week');

	const metrics = [
		{ label: 'Retention Rate', value: 'retention' },
		{ label: 'Conversion Rate', value: 'conversion' },
		{ label: 'Response Rate', value: 'response' }
	];

	const cohortSizes = [
		{ label: 'Weekly', value: 'week' },
		{ label: 'Monthly', value: 'month' },
		{ label: 'Quarterly', value: 'quarter' }
	];

	return (
		<Card className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-semibold">Cohort Analysis</h2>
				<div className="flex space-x-4">
					<Dropdown
						value={metric}
						onChange={setMetric}
						options={metrics}
						label="Metric"
					/>
					<Dropdown
						value={cohortSize}
						onChange={setCohortSize}
						options={cohortSizes}
						label="Cohort Size"
					/>
					<DateRangePicker
						onChange={(range) => console.log('Date range:', range)}
					/>
				</div>
			</div>

			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-6">
					<div>
						<h3 className="text-sm font-medium text-secondary-text mb-2">
							Total Users in Cohort
						</h3>
						<div className="text-2xl font-semibold">
							{mockData.totalUsers.reduce((a, b) => a + b, 0)}
						</div>
					</div>
					<div>
						<h3 className="text-sm font-medium text-secondary-text mb-2">
							Average Retention
						</h3>
						<div className="text-2xl font-semibold">
							{Math.round(
								mockData.retention[0].reduce((a, b) => a + b, 0) /
									mockData.retention[0].length
							)}%
						</div>
					</div>
				</div>

				<div className="h-96">
					<HeatmapChart
						data={mockData.retention}
						xLabels={mockData.weeks}
						yLabels={mockData.weeks}
						colors={['#f7fafc', '#25D366']}
					/>
				</div>

				<div className="grid grid-cols-3 gap-6 mt-6">
					{mockData.weeks.map((week, index) => (
						<Card key={week} className="p-4">
							<h4 className="text-sm font-medium text-secondary-text">
								{week} Cohort
							</h4>
							<div className="text-lg font-semibold mt-1">
								{mockData.totalUsers[index]} users
							</div>
							<div className="text-sm text-secondary-text">
								{mockData.retention[index][0]}% retention
							</div>
						</Card>
					))}
				</div>
			</div>
		</Card>
	);
};