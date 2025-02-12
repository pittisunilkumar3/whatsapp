import React from 'react';
import { motion } from 'framer-motion';
import { GaugeChart } from '../charts/GaugeChart';
import { Card } from './Card';
import { 
	MessageSquare,
	Clock,
	TrendingUp,
	Users,
	ThumbsUp,
	AlertTriangle
} from 'lucide-react';

interface ConversationMetrics {
	score: number;
	responseTime: string;
	engagementRate: number;
	sentimentScore: number;
	keywordMatches: number;
	flags?: string[];
}

interface ConversationScoreDisplayProps {
	metrics: ConversationMetrics;
	className?: string;
}

export const ConversationScoreDisplay: React.FC<ConversationScoreDisplayProps> = ({
	metrics,
	className = '',
}) => {
	const getScoreColor = (score: number) => {
		if (score >= 80) return '#4CAF50';
		if (score >= 60) return '#FFC107';
		return '#F44336';
	};

	const getSentimentColor = (score: number) => {
		if (score >= 0.7) return '#4CAF50';
		if (score >= 0.4) return '#FFC107';
		return '#F44336';
	};

	return (
		<div className={className}>
			{/* Main Score */}
			<div className="flex justify-center mb-8">
				<GaugeChart
					value={metrics.score}
					color={getScoreColor(metrics.score)}
					label="Conversation Score"
					size={240}
				/>
			</div>

			{/* Metrics Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card className="p-4">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-lg bg-blue-50">
							<Clock className="w-5 h-5 text-blue-500" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-primary-text">Response Time</h3>
							<p className="text-2xl font-semibold mt-1">{metrics.responseTime}</p>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-lg bg-green-50">
							<TrendingUp className="w-5 h-5 text-green-500" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-primary-text">Engagement Rate</h3>
							<p className="text-2xl font-semibold mt-1">{metrics.engagementRate}%</p>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-lg bg-purple-50">
							<ThumbsUp className="w-5 h-5 text-purple-500" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-primary-text">Sentiment Score</h3>
							<div className="flex items-center mt-1">
								<span className="text-2xl font-semibold">{(metrics.sentimentScore * 100).toFixed()}%</span>
								<div
									className="ml-2 w-2 h-2 rounded-full"
									style={{ backgroundColor: getSentimentColor(metrics.sentimentScore) }}
								/>
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-lg bg-orange-50">
							<MessageSquare className="w-5 h-5 text-orange-500" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-primary-text">Keyword Matches</h3>
							<p className="text-2xl font-semibold mt-1">{metrics.keywordMatches}</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Flags */}
			{metrics.flags && metrics.flags.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mt-6"
				>
					<Card className="p-4 border-yellow-200 bg-yellow-50">
						<div className="flex items-start space-x-3">
							<AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
							<div>
								<h3 className="font-medium text-yellow-800">Attention Required</h3>
								<ul className="mt-2 space-y-1">
									{metrics.flags.map((flag, index) => (
										<li key={index} className="text-sm text-yellow-700">
											• {flag}
										</li>
									))}
								</ul>
							</div>
						</div>
					</Card>
				</motion.div>
			)}
		</div>
	);
};