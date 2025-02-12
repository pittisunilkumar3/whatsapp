import React from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { MoreVertical, Plus } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface KanbanItem {
	id: string;
	title: string;
	description?: string;
	tags?: string[];
	status: string;
}

interface KanbanColumn {
	id: string;
	title: string;
	items: KanbanItem[];
	color?: string;
}

interface KanbanBoardProps {
	columns: KanbanColumn[];
	onItemMove: (itemId: string, sourceColumn: string, targetColumn: string) => void;
	onAddItem?: (columnId: string) => void;
	className?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
	columns,
	onItemMove,
	onAddItem,
	className = '',
}) => {
	return (
		<div className={`flex space-x-6 overflow-x-auto pb-4 ${className}`}>
			{columns.map((column) => (
				<div
					key={column.id}
					className="flex-shrink-0 w-80"
				>
					{/* Column Header */}
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-2">
							<div
								className={`w-3 h-3 rounded-full ${column.color || 'bg-gray-400'}`}
							/>
							<h3 className="font-medium text-primary-text">
								{column.title}
							</h3>
							<span className="text-sm text-secondary-text">
								({column.items.length})
							</span>
						</div>
						{onAddItem && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onAddItem(column.id)}
							>
								<Plus className="w-4 h-4" />
							</Button>
						)}
					</div>

					{/* Column Content */}
					<Reorder.Group
						axis="y"
						values={column.items}
						onReorder={(items) => {
							// Handle reorder within the same column
						}}
						className="space-y-3"
					>
						{column.items.map((item) => (
							<Reorder.Item
								key={item.id}
								value={item}
								dragListener={false}
								dragControls={useDragControls()}
							>
								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Card className="p-4">
										<div className="flex items-start justify-between">
											<div>
												<h4 className="font-medium text-primary-text">
													{item.title}
												</h4>
												{item.description && (
													<p className="mt-1 text-sm text-secondary-text">
														{item.description}
													</p>
												)}
												{item.tags && item.tags.length > 0 && (
													<div className="mt-2 flex flex-wrap gap-1">
														{item.tags.map((tag) => (
															<span
																key={tag}
																className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-secondary-text"
															>
																{tag}
															</span>
														))}
													</div>
												)}
											</div>
											<button className="p-1 hover:bg-gray-100 rounded">
												<MoreVertical className="w-4 h-4 text-secondary-text" />
											</button>
										</div>
									</Card>
								</motion.div>
							</Reorder.Item>
						))}
					</Reorder.Group>
				</div>
			))}
		</div>
	);
};