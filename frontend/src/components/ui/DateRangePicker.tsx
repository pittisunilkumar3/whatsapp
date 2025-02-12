import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Button } from './Button';
import { Popover } from '@radix-ui/react-popover';

interface DateRangePickerProps {
	startDate: string;
	endDate: string;
	onChange: (range: { start: string; end: string }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
	startDate,
	endDate,
	onChange
}) => {
	const presets = [
		{ label: 'Last 7 days', days: 7 },
		{ label: 'Last 30 days', days: 30 },
		{ label: 'Last 90 days', days: 90 }
	];

	const handlePresetClick = (days: number) => {
		const end = new Date();
		const start = new Date();
		start.setDate(start.getDate() - days);
		
		onChange({
			start: format(start, 'yyyy-MM-dd'),
			end: format(end, 'yyyy-MM-dd')
		});
	};

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<Button variant="outline" className="min-w-[240px]">
					<Calendar className="w-4 h-4 mr-2" />
					{startDate && endDate
						? `${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}`
						: 'Select date range'}
				</Button>
			</Popover.Trigger>
			
			<Popover.Content className="bg-white p-4 rounded-lg shadow-lg border w-[280px]">
				<div className="space-y-4">
					<div className="space-y-2">
						{presets.map(preset => (
							<Button
								key={preset.days}
								variant="ghost"
								className="w-full justify-start"
								onClick={() => handlePresetClick(preset.days)}
							>
								{preset.label}
							</Button>
						))}
					</div>
					
					<div className="border-t pt-4">
						<div className="grid grid-cols-2 gap-2">
							<input
								type="date"
								value={startDate}
								onChange={(e) => onChange({ start: e.target.value, end: endDate })}
								className="px-2 py-1 border rounded"
							/>
							<input
								type="date"
								value={endDate}
								onChange={(e) => onChange({ start: startDate, end: e.target.value })}
								className="px-2 py-1 border rounded"
							/>
						</div>
					</div>
				</div>
			</Popover.Content>
		</Popover.Root>
	);
};