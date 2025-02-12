import React from 'react';
import { motion } from 'framer-motion';

interface FunnelStage {
	label: string;
	value: number;
	color?: string;
}

interface FunnelChartProps {
	data?: FunnelStage[];
	height?: number;
	className?: string;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
	data = [],
	height = 400,
	className = '',
}) => {
	if (!data || data.length === 0) {
		return (
			<div className={`flex items-center justify-center ${className}`} style={{ height }}>
				<p className="text-gray-500">No data available</p>
			</div>
		);
	}

	const maxValue = Math.max(...data.map(stage => stage.value));
	const stageHeight = height / data.length;

	return (
		<div className={`relative ${className}`} style={{ height }}>
			{data.map((stage, index) => {
				const width = (stage.value / maxValue) * 100;
				const marginLeft = (100 - width) / 2;
				const color = stage.color || '#075E54';
				const prevWidth = index > 0 ? (data[index - 1].value / maxValue) * 100 : width;
				const prevMarginLeft = (100 - prevWidth) / 2;

				return (
					<div
						key={stage.label}
						className="absolute w-full"
						style={{
							height: stageHeight,
							top: index * stageHeight,
						}}
					>
						{/* Stage Bar */}
						<motion.div
							initial={{ width: '0%', marginLeft: '50%' }}
							animate={{
								width: `${width}%`,
								marginLeft: `${marginLeft}%`,
							}}
							transition={{
								duration: 0.5,
								delay: index * 0.1,
								ease: "easeOut"
							}}
							className="relative h-full"
						>
							{/* Connecting Shape */}
							{index > 0 && (
								<div
									className="absolute -top-[2px] w-full"
									style={{
										height: '4px',
										background: color,
										clipPath: `polygon(
											0 0,
											100% 0,
											${(width / prevWidth) * 100}% 100%,
											${((prevMarginLeft - marginLeft) / width) * 100}% 100%
										)`,
										marginLeft: `${((prevMarginLeft - marginLeft) / width) * 100}%`,
										width: `${(prevWidth / width) * 100}%`,
									}}
								/>
							)}

							{/* Stage Content */}
							<div
								className="h-full px-4 flex items-center justify-between text-white"
								style={{ backgroundColor: color }}
							>
								<span className="font-medium">{stage.label}</span>
								<span>{stage.value.toLocaleString()}</span>
							</div>
						</motion.div>
					</div>
				);
			})}
		</div>
	);
};