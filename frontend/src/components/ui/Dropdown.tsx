import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
}

interface DropdownProps {
	options: DropdownOption[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
	options,
	value,
	onChange,
	placeholder = 'Select an option',
	label,
	error,
	disabled,
	className = '',
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const selectedOption = options.find(option => option.value === value);

	return (
		<div className="w-full" ref={dropdownRef}>
			{label && (
				<label className="block text-sm font-medium text-primary-text mb-1">
					{label}
				</label>
			)}
			<div className="relative">
				<button
					type="button"
					onClick={() => !disabled && setIsOpen(!isOpen)}
					className={`
						w-full px-4 py-2 text-left bg-white rounded-lg border
						focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent
						transition-all duration-200
						${error ? 'border-red-500' : 'border-gray-200'}
						${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}
						${className}
					`}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					disabled={disabled}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							{selectedOption?.icon}
							<span className={!selectedOption ? 'text-gray-400' : ''}>
								{selectedOption ? selectedOption.label : placeholder}
							</span>
						</div>
						<ChevronDown
							className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
								isOpen ? 'transform rotate-180' : ''
							}`}
						/>
					</div>
				</button>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200"
							role="listbox"
						>
							{options.map((option) => (
								<motion.button
									key={option.value}
									type="button"
									className={`
										w-full px-4 py-2 text-left flex items-center space-x-2
										hover:bg-gray-50 transition-colors duration-150
										${option.value === value ? 'bg-gray-50' : ''}
									`}
									onClick={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
									role="option"
									aria-selected={option.value === value}
								>
									{option.icon}
									<span>{option.label}</span>
								</motion.button>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			{error && (
				<p className="mt-1 text-sm text-red-500">{error}</p>
			)}
		</div>
	);
};