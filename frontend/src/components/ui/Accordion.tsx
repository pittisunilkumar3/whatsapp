import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
	id: string;
	title: string;
	content: React.ReactNode;
	icon?: React.ReactNode;
	disabled?: boolean;
}

interface AccordionProps {
	items: AccordionItem[];
	expandedItems?: string[];
	onChange?: (expandedItems: string[]) => void;
	allowMultiple?: boolean;
	className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
	items,
	expandedItems = [],
	onChange,
	allowMultiple = false,
	className = '',
}) => {
	const [internalExpanded, setInternalExpanded] = React.useState<string[]>(expandedItems);

	const isControlled = onChange !== undefined;
	const expanded = isControlled ? expandedItems : internalExpanded;

	const handleItemClick = (itemId: string) => {
		const newExpanded = allowMultiple
			? expanded.includes(itemId)
				? expanded.filter(id => id !== itemId)
				: [...expanded, itemId]
			: expanded.includes(itemId)
				? []
				: [itemId];

		if (!isControlled) {
			setInternalExpanded(newExpanded);
		}
		onChange?.(newExpanded);
	};

	return (
		<div className={`space-y-2 ${className}`}>
			{items.map((item) => {
				const isExpanded = expanded.includes(item.id);

				return (
					<div
						key={item.id}
						className={`
							border rounded-lg overflow-hidden
							${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
						`}
					>
						<button
							className={`
								w-full px-4 py-3 flex items-center justify-between
								text-left bg-white hover:bg-gray-50
								focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:ring-inset
								disabled:hover:bg-white
								transition-colors duration-200
							`}
							onClick={() => !item.disabled && handleItemClick(item.id)}
							disabled={item.disabled}
							aria-expanded={isExpanded}
						>
							<div className="flex items-center space-x-3">
								{item.icon}
								<span className="font-medium text-primary-text">{item.title}</span>
							</div>
							<motion.div
								animate={{ rotate: isExpanded ? 180 : 0 }}
								transition={{ duration: 0.2 }}
							>
								<ChevronDown className="w-5 h-5 text-secondary-text" />
							</motion.div>
						</button>

						<AnimatePresence initial={false}>
							{isExpanded && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{
										height: {
											type: "spring",
											stiffness: 300,
											damping: 30,
										},
										opacity: { duration: 0.2 }
									}}
								>
									<div className="px-4 py-3 border-t bg-gray-50">
										{item.content}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
};