import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { FunnelChart } from '../charts/FunnelChart';
import { SankeyChart } from '../charts/SankeyChart';
import { Dropdown } from '../ui/Dropdown';

interface TouchPoint {
	channel: string;
	contribution: number;
	conversions: number;
}

const mockData = {
	firstTouch: [
		{ channel: 'WhatsApp', contribution: 35, conversions: 150 },
		{ channel: 'SMS', contribution: 25, conversions: 100 },
		{ channel: 'Voice', contribution: 20, conversions: 80 },
		{ channel: 'Email', contribution: 20, conversions: 70 }
	],
	lastTouch: [
		{ channel: 'WhatsApp', contribution: 40, conversions: 180 },
		{ channel: 'SMS', contribution: 20, conversions: 90 },
		{ channel: 'Voice', contribution: 25, conversions: 110 },
		{ channel: 'Email', contribution: 15, conversions: 60 }
	],
	multiTouch: [
		{ channel: 'WhatsApp', contribution: 38, conversions: 160 },
		{ channel: 'SMS', contribution: 22, conversions: 95 },
		{ channel: 'Voice', contribution: 23, conversions: 100 },
		{ channel: 'Email', contribution: 17, conversions: 65 }
	]
};

export const AttributionModeling: React.FC = () => {
	const [modelType, setModelType] = useState('multiTouch');
	const [timeRange, setTimeRange] = useState('30d');

	const models = [
		{ label: 'First Touch', value: 'firstTouch' },
		{ label: 'Last Touch', value: 'lastTouch' },
		{ label: 'Multi-Touch', value: 'multiTouch' }
	];

	const timeRanges = [
		{ label: 'Last 7 Days', value: '7d' },
		{ label: 'Last 30 Days', value: '30d' },
		{ label: 'Last 90 Days', value: '90d' }
	];

	const currentData = mockData[modelType as keyof typeof mockData];

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold">Attribution Modeling</h2>
				<div className="flex space-x-4">
					<Dropdown
						value={modelType}
						onChange={setModelType}
						options={models}
						label="Model Type"
					/>
					<Dropdown
						value={timeRange}
						onChange={setTimeRange}
						options={timeRanges}
						label="Time Range"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-6">
				<Card className="p-6">
					<h3 className="font-medium mb-4">Channel Attribution</h3>
					<div className="h-64">
						<FunnelChart
							data={currentData.map(item => ({
								label: item.channel,
								value: item.contribution
							}))}
						/>
					</div>
				</Card>

				<Card className="p-6">
					<h3 className="font-medium mb-4">Conversion Path Analysis</h3>
					<div className="h-64">
						<SankeyChart
							data={currentData.map(item => ({
								from: 'Lead',
								to: item.channel,
								value: item.conversions
							}))}
						/>
					</div>
				</Card>
			</div>

			<Card className="p-6">
				<h3 className="font-medium mb-4">Channel Performance</h3>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Channel
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Attribution %
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Conversions
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Value
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{currentData.map(item => (
								<tr key={item.channel}>
									<td className="px-6 py-4 whitespace-nowrap">
										{item.channel}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{item.contribution}%
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{item.conversions}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										${(item.conversions * 100).toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
};