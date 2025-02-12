import React from 'react';
import { motion } from 'framer-motion';

interface RadioOption {
	value: string;
	label: string;
	description?: string;
}

interface RadioButtonProps {
	options: RadioOption[];
	value: string;
	onChange: (value: string) => void;
	name: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
	options,
	value,
	onChange,
	name,
	label,
	error,
	disabled,
	className = '',
}) => {
	return (
		<div className={className}>
			{label && (
				<label className="block text-sm font-medium text-primary-text mb-2">
					{label}
				</label>
			)}
			<div className="space-y-3">
				{options.map((option) => {
					const id = `${name}-${option.value}`;
					const isChecked = value === option.value;

					return (
						<div key={option.value} className="relative flex items-start">
							<div className="flex items-center h-5">
								<input
									type="radio"
									id={id}
									name={name}
									value={option.value}
									checked={isChecked}
									onChange={(e) => onChange(e.target.value)}
									disabled={disabled}
									className="sr-only"
								/>
								<motion.div
									className={`
										w-5 h-5 rounded-full border-2 flex items-center justify-center
										transition-colors duration-200
										${disabled
											? 'bg-gray-100 border-gray-300 cursor-not-allowed'
											: isChecked
												? 'border-whatsapp-green cursor-pointer'
												: 'border-gray-300 cursor-pointer hover:border-whatsapp-green'
										}
										${error ? 'border-red-500' : ''}
									`}
									whileHover={!disabled && !isChecked ? { scale: 1.05 } : {}}
									whileTap={!disabled ? { scale: 0.95 } : {}}
								>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: isChecked ? 1 : 0 }}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 20,
											duration: 0.2
										}}
										className="w-2.5 h-2.5 rounded-full bg-whatsapp-green"
									/>
								</motion.div>
							</div>
							<div className="ml-3">
								<label
									htmlFor={id}
									className={`
										text-sm font-medium
										${disabled ? 'text-gray-400' : 'text-primary-text'}
										${error ? 'text-red-500' : ''}
									`}
								>
									{option.label}
								</label>
								{option.description && (
									<p className="mt-1 text-sm text-secondary-text">
										{option.description}
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
			{error && (
				<p className="mt-2 text-sm text-red-500">{error}</p>
			)}
		</div>
	);
};