import React from 'react';
import { motion } from 'framer-motion';

interface TimelineEvent {
	id: string;
	title: string;
	description?: string;
	timestamp: string;
	icon?: React.ReactNode;
	status?: 'success' | 'warning' | 'error' | 'info';
}

interface TimelineProps {
	events: TimelineEvent[];
	className?: string;
}

const statusConfig = {
	success: {
		dotColor: 'bg-green-500',
		lineColor: 'border-green-200',
		bgColor: 'bg-green-50',
	},
	warning: {
		dotColor: 'bg-yellow-500',
		lineColor: 'border-yellow-200',
		bgColor: 'bg-yellow-50',
	},
	error: {
		dotColor: 'bg-red-500',
		lineColor: 'border-red-200',
		bgColor: 'bg-red-50',
	},
	info: {
		dotColor: 'bg-blue-500',
		lineColor: 'border-blue-200',
		bgColor: 'bg-blue-50',
	},
};

export const Timeline: React.FC<TimelineProps> = ({
	events,
	className = '',
}) => {
	return (
		<div className={className}>
			<div className="relative">
				{/* Vertical Line */}
				<div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

				{/* Events */}
				<div className="space-y-6">
					{events.map((event, index) => {
						const status = event.status || 'info';
						const config = statusConfig[status];

						return (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="relative pl-12"
							>
								{/* Event Dot */}
								<div
									className={`
										absolute left-2.5 w-3 h-3 rounded-full
										transform -translate-x-1/2
										${config.dotColor}
									`}
								/>

								{/* Event Content */}
								<div
									className={`
										p-4 rounded-lg border
										${config.bgColor}
										hover:shadow-sm transition-shadow duration-200
									`}
								>
									<div className="flex items-start justify-between">
										<div>
											<h3 className="font-medium text-primary-text">
												{event.title}
											</h3>
											{event.description && (
												<p className="mt-1 text-sm text-secondary-text">
													{event.description}
												</p>
											)}
										</div>
										{event.icon && (
											<div className="ml-4 flex-shrink-0">
												{event.icon}
											</div>
										)}
									</div>
									<div className="mt-2 text-xs text-secondary-text">
										{new Date(event.timestamp).toLocaleString()}
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
};