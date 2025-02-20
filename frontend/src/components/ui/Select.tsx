import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
	label,
	error,
	helperText,
	className = '',
	children,
	...props
}, ref) => {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-medium text-gray-600 mb-1.5">
					{label}
				</label>
			)}
			<select
				ref={ref}
				className={`
					w-full px-4 py-2.5 rounded-md border
					text-gray-800 bg-white
					focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
					disabled:bg-gray-50 disabled:cursor-not-allowed
					transition-all duration-200
					${error ? 'border-red-500' : 'border-gray-300'}
					${className}
				`}
				{...props}
			>
				{children}
			</select>
			{error && (
				<p className="mt-1.5 text-sm text-red-500">{error}</p>
			)}
			{helperText && !error && (
				<p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
			)}
		</div>
	);
});