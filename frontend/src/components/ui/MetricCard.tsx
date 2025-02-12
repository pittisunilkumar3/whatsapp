import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: React.ElementType;
	change?: string;
	isPositive?: boolean;
	color?: string;
	index?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
	title,
	value,
	icon: Icon,
	change,
	isPositive = true,
	color = 'text-blue-600',
	index = 0
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
		>
			<Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
				<div className="flex justify-between items-start">
					<div className="space-y-1 sm:space-y-2">
						<p className="text-sm text-secondary-text">{title}</p>
						<h3 className="text-lg sm:text-2xl font-semibold">{value}</h3>
						{change && (
							<div className="flex items-center space-x-1 sm:space-x-2">
								{isPositive ? (
									<ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
								) : (
									<ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
								)}
								<span className={`text-xs sm:text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
									{change} from last month
								</span>
							</div>
						)}
					</div>
					<div className={`p-3 sm:p-4 rounded-full bg-gray-50 ${color}`}>
						<Icon className="w-5 h-5 sm:w-6 sm:h-6" />
					</div>
				</div>
			</Card>
		</motion.div>
	);
};