import React from 'react';
import { motion } from 'framer-motion';

interface GaugeChartProps {
	value: number;
	min?: number;
	max?: number;
	label?: string;
	color?: string;
	size?: number;
	thickness?: number;
	className?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
	value,
	min = 0,
	max = 100,
	label,
	color = '#075E54',
	size = 200,
	thickness = 20,
	className = '',
}) => {
	// Normalize value between 0 and 1
	const normalizedValue = Math.min(Math.max((value - min) / (max - min), 0), 1);
	const angle = normalizedValue * 180; // Convert to degrees (half circle)

	// Calculate SVG parameters
	const radius = (size - thickness) / 2;
	const circumference = radius * Math.PI;
	const strokeDashoffset = circumference - (normalizedValue * circumference);

	return (
		<div className={`relative ${className}`} style={{ width: size, height: size / 2 }}>
			{/* Background Arc */}
			<svg
				width={size}
				height={size / 2}
				className="transform -rotate-90"
			>
				<path
					d={`
						M ${thickness / 2},${size / 2}
						A ${radius},${radius} 0 0,1 ${size - thickness / 2},${size / 2}
					`}
					fill="none"
					stroke="#F0F0F0"
					strokeWidth={thickness}
				/>

				{/* Value Arc */}
				<motion.path
					d={`
						M ${thickness / 2},${size / 2}
						A ${radius},${radius} 0 0,1 ${size - thickness / 2},${size / 2}
					`}
					fill="none"
					stroke={color}
					strokeWidth={thickness}
					strokeDasharray={circumference}
					initial={{ strokeDashoffset: circumference }}
					animate={{ strokeDashoffset }}
					transition={{ duration: 1, ease: "easeOut" }}
				/>
			</svg>

			{/* Value Display */}
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="text-3xl font-semibold text-primary-text"
				>
					{value}%
				</motion.div>
				{label && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.7 }}
						className="text-sm text-secondary-text mt-1"
					>
						{label}
					</motion.div>
				)}
			</div>

			{/* Min/Max Labels */}
			<div className="absolute bottom-0 w-full flex justify-between text-sm text-secondary-text px-2">
				<span>{min}</span>
				<span>{max}</span>
			</div>
		</div>
	);
};