import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PromptEditor } from '../ui/PromptEditor';
import { ProgressBar } from '../ui/ProgressBar';
import { LineChart } from '../charts/LineChart';
import { Beaker, Play, Pause, BarChart2 } from 'lucide-react';

type Channel = 'whatsapp' | 'sms' | 'voice' | 'email';

interface TestVariant {
	id: string;
	name: string;
	content: string;
	channel: Channel;
	metrics: {
		responseRate: number;
		conversionRate: number;
		avgScore: number;
		sentCount: number;
		avgResponseTime: string;
		sentiment: {
			positive: number;
			neutral: number;
			negative: number;
		};
	};
}

interface TestConfig {
	sampleSize: number;
	duration: number;
	targetMetric: 'responseRate' | 'conversionRate' | 'avgScore';
	confidenceLevel: 0.90 | 0.95 | 0.99;
}

const mockVariants: TestVariant[] = [
	{
		id: 'A',
		name: 'Original',
		channel: 'whatsapp',
		content: 'Hi {{lead.name}}, interested in our services?',
		metrics: {
			responseRate: 45,
			conversionRate: 12,
			avgScore: 78,
			sentCount: 500,
			avgResponseTime: '5m',
			sentiment: { positive: 60, neutral: 30, negative: 10 }
		}
	},
	{
		id: 'B',
		name: 'Personalized',
		channel: 'whatsapp',
		content: 'Hi {{lead.name}}, saw you're interested in {{lead.interest}}. Would you like to learn more?',
		metrics: {
			responseRate: 52,
			conversionRate: 15,
			avgScore: 82,
			sentCount: 500,
			avgResponseTime: '4m',
			sentiment: { positive: 70, neutral: 25, negative: 5 }
		}
	}
];

export const ABTestingManager: React.FC = () => {
	const [isRunning, setIsRunning] = useState(false);
	const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
	const [selectedChannel, setSelectedChannel] = useState<Channel>('whatsapp');
	const [testConfig, setTestConfig] = useState<TestConfig>({
		sampleSize: 1000,
		duration: 7,
		targetMetric: 'responseRate',
		confidenceLevel: 0.95
	});

	const performanceData = {
		labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
		datasets: [
			{
				label: 'Variant A',
				data: [45, 47, 46, 45, 45],
				borderColor: '#4CAF50'
			},
			{
				label: 'Variant B',
				data: [48, 50, 51, 52, 52],
				borderColor: '#2196F3'
			}
		]
	};

	return (
		<div className="space-y-6">
			<div className="flex space-x-2 mb-6">
				{['whatsapp', 'sms', 'voice', 'email'].map((channel) => (
					<Button
						key={channel}
						variant={selectedChannel === channel ? 'default' : 'ghost'}
						onClick={() => setSelectedChannel(channel as Channel)}
					>
						{channel.charAt(0).toUpperCase() + channel.slice(1)}
					</Button>
				))}
			</div>

			<Card className="p-6 mb-6">
				<h3 className="font-medium mb-4">Test Configuration</h3>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="text-sm font-medium">Sample Size</label>
						<input
							type="number"
							value={testConfig.sampleSize}
							onChange={(e) => setTestConfig(prev => ({
								...prev,
								sampleSize: Number(e.target.value)
							}))}
							className="mt-1 block w-full rounded-md border-gray-300"
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Duration (days)</label>
						<input
							type="number"
							value={testConfig.duration}
							onChange={(e) => setTestConfig(prev => ({
								...prev,
								duration: Number(e.target.value)
							}))}
							className="mt-1 block w-full rounded-md border-gray-300"
						/>
					</div>
					<div>
						<label className="text-sm font-medium">Target Metric</label>
						<select
							value={testConfig.targetMetric}
							onChange={(e) => setTestConfig(prev => ({
								...prev,
								targetMetric: e.target.value as TestConfig['targetMetric']
							}))}
							className="mt-1 block w-full rounded-md border-gray-300"
						>
							<option value="responseRate">Response Rate</option>
							<option value="conversionRate">Conversion Rate</option>
							<option value="avgScore">Average Score</option>
						</select>
					</div>
					<div>
						<label className="text-sm font-medium">Confidence Level</label>
						<select
							value={testConfig.confidenceLevel}
							onChange={(e) => setTestConfig(prev => ({
								...prev,
								confidenceLevel: Number(e.target.value) as TestConfig['confidenceLevel']
							}))}
							className="mt-1 block w-full rounded-md border-gray-300"
						>
							<option value="0.90">90%</option>
							<option value="0.95">95%</option>
							<option value="0.99">99%</option>
						</select>
					</div>
				</div>
			</Card>

			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-lg font-semibold">A/B Testing</h2>
					<p className="text-secondary-text mt-1">
						Test and optimize your prompt variations
					</p>
				</div>
				<Button
					onClick={() => setIsRunning(!isRunning)}
					variant={isRunning ? 'default' : 'ghost'}
				>
					{isRunning ? (
						<>
							<Pause className="w-4 h-4 mr-2" />
							Stop Test
						</>
					) : (
						<>
							<Play className="w-4 h-4 mr-2" />
							Start Test
						</>
					)}
				</Button>
			</div>

			<div className="grid grid-cols-2 gap-6">
				{mockVariants.map(variant => (
					<Card
						key={variant.id}
						className={`p-6 cursor-pointer hover:border-whatsapp-green transition-colors ${
							selectedVariant === variant.id ? 'border-whatsapp-green' : ''
						}`}
						onClick={() => setSelectedVariant(variant.id)}
					>
						<div className="flex justify-between items-start mb-4">
							<div>
								<h3 className="font-medium">Variant {variant.id}</h3>
								<p className="text-sm text-secondary-text">{variant.name}</p>
							</div>
							<Beaker className="w-5 h-5 text-whatsapp-green" />
						</div>
						<PromptEditor
							value={variant.content}
							onChange={() => {}}
							readOnly
							minHeight="100px"
						/>
						<div className="grid grid-cols-2 gap-4 mt-4">
							<div>
								<p className="text-sm text-secondary-text">Response Rate</p>
								<p className="text-lg font-semibold">{variant.metrics.responseRate}%</p>
							</div>
							<div>
								<p className="text-sm text-secondary-text">Conversion Rate</p>
								<p className="text-lg font-semibold">{variant.metrics.conversionRate}%</p>
							</div>
						</div>
					</Card>
				))}
			</div>

			<Card className="p-6">
				<div className="flex justify-between items-center mb-6">
					<h3 className="font-medium">Performance Comparison</h3>
					<div className="flex items-center space-x-2">
						<BarChart2 className="w-5 h-5 text-secondary-text" />
						<span className="text-sm text-secondary-text">Response Rate Over Time</span>
					</div>
				</div>
				<div className="h-64">
					<LineChart
						labels={performanceData.labels}
						datasets={performanceData.datasets}
					/>
				</div>
			</Card>

			{isRunning && (
				<Card className="p-6">
					<h3 className="font-medium mb-4">Test Progress</h3>
					<ProgressBar progress={65} />
					<p className="text-sm text-secondary-text mt-2">
						650/1000 messages sent - 35% remaining
					</p>
				</Card>
			)}

			<Card className="p-6 mt-6">
				<h3 className="font-medium mb-4">Sentiment Analysis</h3>
				<div className="grid grid-cols-2 gap-4">
					{mockVariants.map(variant => (
						<div key={variant.id} className="space-y-2">
							<h4 className="text-sm font-medium">Variant {variant.id}</h4>
							<div className="flex h-4 rounded-full overflow-hidden">
								<div 
									style={{ width: `${variant.metrics.sentiment.positive}%` }}
									className="bg-green-500"
								/>
								<div 
									style={{ width: `${variant.metrics.sentiment.neutral}%` }}
									className="bg-gray-300"
								/>
								<div 
									style={{ width: `${variant.metrics.sentiment.negative}%` }}
									className="bg-red-500"
								/>
							</div>
							<div className="flex justify-between text-xs text-secondary-text">
								<span>Positive: {variant.metrics.sentiment.positive}%</span>
								<span>Neutral: {variant.metrics.sentiment.neutral}%</span>
								<span>Negative: {variant.metrics.sentiment.negative}%</span>
							</div>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
};