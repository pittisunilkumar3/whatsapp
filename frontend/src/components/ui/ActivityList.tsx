import React from 'react';
import { Card } from './Card';
import { StatusPill } from './StatusPill';
import { format } from 'date-fns';
import { ActivityItem } from '../../types/dashboard';
import { Button } from './Button';

interface ActivityListProps {
	activities: ActivityItem[];
	title?: string;
	showViewAll?: boolean;
	onViewAll?: () => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
	activities,
	title = 'Recent Activity',
	showViewAll = true,
	onViewAll
}) => {
	return (
		<Card className="p-6">
			<h2 className="text-lg font-semibold mb-4">{title}</h2>
			<div className="space-y-4">
				{activities.map((activity) => (
					<div
						key={activity.id}
						className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
					>
						<div className="flex items-center space-x-4">
							<div className="flex-shrink-0">
								<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
									{(activity.agent || activity.leadName)?.charAt(0)}
								</div>
							</div>
							<div>
								<p className="font-medium text-primary-text">
									{activity.agent || activity.leadName}
								</p>
								<p className="text-sm text-secondary-text">{activity.action}</p>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<StatusPill status={activity.status} />
							<span className="text-sm text-secondary-text">
								{typeof activity.time === 'string' && activity.time.includes('T')
									? format(new Date(activity.time), 'h:mm a')
									: activity.time}
							</span>
						</div>
					</div>
				))}
			</div>
			{showViewAll && (
				<div className="mt-4 text-center">
					<Button variant="ghost" onClick={onViewAll}>
						View All Activity
					</Button>
				</div>
			)}
		</Card>
	);
};