import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
	label,
	error,
	helperText,
	className = '',
	children,
	...props
}) => {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-medium text-primary-text mb-1">
					{label}
				</label>
			)}
			<select
				className={`
					w-full px-4 py-2 rounded-lg border
					text-primary-text bg-white
					focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
					disabled:bg-gray-100 disabled:cursor-not-allowed
					transition-all duration-200
					${error ? 'border-red-500' : 'border-gray-200'}
					${className}
				`}
				{...props}
			>
				{children}
			</select>
			{error && (
				<p className="mt-1 text-sm text-red-500">{error}</p>
			)}
			{helperText && !error && (
				<p className="mt-1 text-sm text-secondary-text">{helperText}</p>
			)}
		</div>
	);
};