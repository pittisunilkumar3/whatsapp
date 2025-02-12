import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
	progress: number;
	showPercentage?: boolean;
	size?: 'sm' | 'md' | 'lg';
	color?: 'default' | 'success' | 'warning' | 'error';
	className?: string;
	animated?: boolean;
}

const sizeConfig = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3',
};

const colorConfig = {
	default: {
		base: 'bg-whatsapp-green',
		background: 'bg-gray-100',
		text: 'text-whatsapp-green',
	},
	success: {
		base: 'bg-green-500',
		background: 'bg-green-100',
		text: 'text-green-500',
	},
	warning: {
		base: 'bg-yellow-500',
		background: 'bg-yellow-100',
		text: 'text-yellow-500',
	},
	error: {
		base: 'bg-red-500',
		background: 'bg-red-100',
		text: 'text-red-500',
	},
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
	progress,
	showPercentage = false,
	size = 'md',
	color = 'default',
	className = '',
	animated = true,
}) => {
	// Ensure progress is between 0 and 100
	const normalizedProgress = Math.min(Math.max(progress, 0), 100);
	const colors = colorConfig[color];

	return (
		<div className={className}>
			<div className={`w-full ${sizeConfig[size]} ${colors.background} rounded-full overflow-hidden`}>
				<motion.div
					className={`${colors.base} h-full rounded-full`}
					initial={animated ? { width: 0 } : false}
					animate={{ width: `${normalizedProgress}%` }}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 30,
					}}
				>
					{/* Gradient overlay for WhatsApp-style effect */}
					<div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
				</motion.div>
			</div>
			{showPercentage && (
				<div className={`mt-1 text-sm font-medium ${colors.text}`}>
					{normalizedProgress}%
				</div>
			)}
		</div>
	);
};