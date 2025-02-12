import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
	MessageSquare,
	Plus,
	Edit,
	Trash2,
	ChevronRight,
	TrendingUp
} from 'lucide-react';
import { LineChart } from '../../components/charts/LineChart';

interface ScoringRule {
	id: string;
	name: string;
	description: string;
	criteria: {
		type: 'response_time' | 'sentiment' | 'keywords' | 'engagement';
		threshold: string;
		weight: number;
	}[];
	isActive: boolean;
}

const mockRules: ScoringRule[] = [
	{
		id: '1',
		name: 'Response Time Rule',
		description: 'Score based on response time to customer messages',
		criteria: [
			{
				type: 'response_time',
				threshold: '< 15 minutes',
				weight: 40
			},
			{
				type: 'engagement',
				threshold: '> 3 messages',
				weight: 60
			}
		],
		isActive: true
	},
	{
		id: '2',
		name: 'Sentiment Analysis',
		description: 'Score based on conversation sentiment and keywords',
		criteria: [
			{
				type: 'sentiment',
				threshold: '> 0.7 positive',
				weight: 50
			},
			{
				type: 'keywords',
				threshold: '> 2 product mentions',
				weight: 50
			}
		],
		isActive: true
	}
];

const scoreData = {
	labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
	datasets: [
		{
			label: 'Average Conversation Score',
			data: [75, 78, 82, 79, 85, 88],
			borderColor: '#075E54',
			backgroundColor: 'rgba(7, 94, 84, 0.1)',
		}
	],
};

export const ConversationScoring: React.FC = () => {
	return (
		<div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-semibold text-primary-text">Conversation Scoring</h1>
					<p className="text-sm text-secondary-text mt-1">
						Configure scoring rules and monitor conversation quality
					</p>
				</div>
				<Button className="w-full sm:w-auto touch-manipulation">
					<Plus className="w-5 h-5 mr-2" />
					Add Rule
				</Button>
			</div>

			{/* Score Overview */}
			<Card className="p-4 sm:p-6">
				<h2 className="text-lg font-semibold mb-4">Score Trends</h2>
				<div className="w-full overflow-x-auto">
					<div className="min-w-[500px]">
						<LineChart data={scoreData} height={300} />
					</div>
				</div>
			</Card>

			{/* Scoring Rules */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Scoring Rules</h2>
				{mockRules.map((rule) => (
					<Card key={rule.id} className="p-4 sm:p-6">
						<div className="space-y-4">
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div>
									<h3 className="font-semibold">{rule.name}</h3>
									<p className="text-sm text-secondary-text mt-1">{rule.description}</p>
								</div>
								<div className="flex items-center space-x-2 self-end sm:self-start">
									<Button variant="ghost" size="sm" className="p-2 touch-manipulation">
										<Edit className="w-5 h-5" />
									</Button>
									<Button variant="ghost" size="sm" className="p-2 touch-manipulation">
										<Trash2 className="w-5 h-5" />
									</Button>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4">
								{rule.criteria.map((criterion, index) => (
									<div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
										<div>
											<p className="font-medium capitalize">{criterion.type.replace('_', ' ')}</p>
											<p className="text-sm text-secondary-text">{criterion.threshold}</p>
										</div>
										<div className="text-right">
											<p className="font-semibold">{criterion.weight}%</p>
											<p className="text-sm text-secondary-text">Weight</p>
										</div>
									</div>
								))}
							</div>

							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-4">
								<div className="flex items-center space-x-4">
									<span className={`px-3 py-1.5 rounded-full text-sm ${
										rule.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
									}`}>
										{rule.isActive ? 'Active' : 'Inactive'}
									</span>
								</div>
								<Button variant="ghost" size="sm" className="w-full sm:w-auto touch-manipulation">
									View Details
									<ChevronRight className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};