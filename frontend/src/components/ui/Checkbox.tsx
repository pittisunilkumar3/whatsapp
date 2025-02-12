import React from 'react';
import { CheckIcon } from 'lucide-react';

interface CheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	checked,
	onChange,
	className = ''
}) => {
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		onChange(!checked);
	};

	return (
		<div
			role="checkbox"
			aria-checked={checked}
			className={`${className} cursor-pointer select-none relative group`}
			onClick={handleClick}
		>
			<div
				className={`
					w-4 h-4 rounded border-2 flex items-center justify-center
					transition-all duration-300 ease-in-out
					transform hover:scale-105
					${checked
						? 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600'
						: 'bg-white border-gray-300 hover:border-emerald-400 group-hover:shadow-sm'
					}
				`}
			>
				<CheckIcon 
					className={`
						w-3 h-3 text-white
						transition-all duration-300 ease-in-out
						${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
					`}
				/>
			</div>
		</div>
	);
};


