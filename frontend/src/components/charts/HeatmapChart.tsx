import React from 'react';
import { motion } from 'framer-motion';

interface HeatmapCell {
	x: string;
	y: string;
	value: number;
}

interface HeatmapChartProps {
	data: HeatmapCell[];
	xLabels: string[];
	yLabels: string[];
	minValue?: number;
	maxValue?: number;
	colorScale?: string[];
	cellSize?: number;
	className?: string;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({
	data,
	xLabels,
	yLabels,
	minValue = 0,
	maxValue = 100,
	colorScale = ['#E3F2FD', '#075E54'],
	cellSize = 40,
	className = '',
}) => {
	const getColor = (value: number) => {
		const normalizedValue = (value - minValue) / (maxValue - minValue);
		const index = Math.floor(normalizedValue * (colorScale.length - 1));
		return colorScale[Math.min(colorScale.length - 1, Math.max(0, index))];
	};

	const getTooltipContent = (cell: HeatmapCell) => {
		return `${cell.x} - ${cell.y}: ${cell.value}`;
	};

	return (
		<div className={className}>
			<div className="flex">
				{/* Y-axis Labels */}
				<div className="flex flex-col items-end pr-4">
					{yLabels.map((label) => (
						<div
							key={label}
							style={{ height: cellSize }}
							className="flex items-center text-sm text-secondary-text"
						>
							{label}
						</div>
					))}
				</div>

				<div>
					{/* X-axis Labels */}
					<div className="flex pl-2 mb-2">
						{xLabels.map((label) => (
							<div
								key={label}
								style={{ width: cellSize }}
								className="text-sm text-secondary-text -rotate-45 origin-left"
							>
								{label}
							</div>
						))}
					</div>

					{/* Heatmap Grid */}
					<div className="grid"
						style={{
							gridTemplateColumns: `repeat(${xLabels.length}, ${cellSize}px)`,
							gap: '1px',
						}}
					>
						{yLabels.map((y) => (
							xLabels.map((x) => {
								const cell = data.find(d => d.x === x && d.y === y);
								const value = cell?.value ?? minValue;

								return (
									<motion.div
										key={`${x}-${y}`}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{
											duration: 0.3,
											delay: Math.random() * 0.5,
										}}
										className="relative group"
									>
										<div
											style={{
												width: cellSize,
												height: cellSize,
												backgroundColor: getColor(value),
											}}
											className="cursor-pointer"
										/>

										{/* Tooltip */}
										<div className="
											absolute z-10 p-2 text-sm bg-white rounded-lg shadow-lg
											opacity-0 group-hover:opacity-100 transition-opacity
											pointer-events-none
											-translate-x-1/2 -translate-y-full
											left-1/2 top-0 mt-[-8px]
										">
											{cell && getTooltipContent(cell)}
										</div>
									</motion.div>
								);
							})
						))}
					</div>
				</div>
			</div>
		</div>
	);
};