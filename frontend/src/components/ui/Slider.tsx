import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

interface SliderProps {
	value: number[];
	onValueChange: (value: number[]) => void;
	min?: number;
	max?: number;
	step?: number;
	className?: string;
}

export const Slider: React.FC<SliderProps> = ({
	value,
	onValueChange,
	min = 0,
	max = 100,
	step = 1,
	className = ''
}) => {
	return (
		<SliderPrimitive.Root
			className={`relative flex items-center select-none touch-none w-full h-5 ${className}`}
			value={value}
			onValueChange={onValueChange}
			max={max}
			min={min}
			step={step}
		>
			<SliderPrimitive.Track className="relative h-1 grow rounded-full bg-gray-200">
				<SliderPrimitive.Range className="absolute h-full rounded-full bg-whatsapp-green" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb
				className="block w-5 h-5 bg-white rounded-full border-2 border-whatsapp-green focus:outline-none focus:ring-2 focus:ring-whatsapp-green"
			/>
		</SliderPrimitive.Root>
	);
};