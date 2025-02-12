import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
	src?: string;
	alt?: string;
	name?: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const sizeConfig = {
	sm: 'w-8 h-8 text-xs',
	md: 'w-10 h-10 text-sm',
	lg: 'w-12 h-12 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({
	src,
	alt,
	name,
	size = 'md',
	className = '',
}) => {
	const sizeClass = sizeConfig[size];
	const initials = name
		? name.split(' ')
				.map(part => part[0])
				.join('')
				.toUpperCase()
				.slice(0, 2)
		: '';

	if (src) {
		return (
			<img
				src={src}
				alt={alt || name || 'Avatar'}
				className={`${sizeClass} rounded-full object-cover ${className}`}
			/>
		);
	}

	if (initials) {
		return (
			<div
				className={`
					${sizeClass} rounded-full
					bg-whatsapp-green bg-opacity-10
					text-whatsapp-green font-medium
					flex items-center justify-center
					${className}
				`}
			>
				{initials}
			</div>
		);
	}

	return (
		<div
			className={`
				${sizeClass} rounded-full
				bg-gray-100
				flex items-center justify-center
				${className}
			`}
		>
			<User className="w-1/2 h-1/2 text-gray-400" />
		</div>
	);
};