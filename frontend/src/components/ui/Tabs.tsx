import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
	id: string;
	label: string;
	icon?: React.ReactNode;
	disabled?: boolean;
}

interface TabsProps {
	tabs: Tab[];
	activeTab: string;
	onChange: (tabId: string) => void;
	variant?: 'default' | 'pills';
	className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
	tabs,
	activeTab,
	onChange,
	variant = 'default',
	className = '',
}) => {
	const tabListRef = React.useRef<HTMLDivElement>(null);
	const [indicatorStyle, setIndicatorStyle] = React.useState({
		width: 0,
		left: 0,
	});

	React.useEffect(() => {
		const activeTabElement = tabListRef.current?.querySelector(`[data-tab-id="${activeTab}"]`);
		if (activeTabElement instanceof HTMLElement) {
			setIndicatorStyle({
				width: activeTabElement.offsetWidth,
				left: activeTabElement.offsetLeft,
			});
		}
	}, [activeTab]);

	const variants = {
		default: {
			base: 'border-b border-gray-200',
			tab: `
				px-4 py-2 text-sm font-medium
				hover:text-whatsapp-green
				disabled:text-gray-300 disabled:cursor-not-allowed
			`,
			activeTab: 'text-whatsapp-green',
			inactiveTab: 'text-secondary-text',
			indicator: 'bg-whatsapp-green h-0.5',
		},
		pills: {
			base: 'p-1 bg-gray-100 rounded-lg',
			tab: `
				px-4 py-2 text-sm font-medium rounded-md
				disabled:text-gray-300 disabled:cursor-not-allowed
			`,
			activeTab: 'text-white bg-whatsapp-green shadow-sm',
			inactiveTab: 'text-secondary-text hover:bg-gray-200',
			indicator: 'hidden',
		},
	};

	const style = variants[variant];

	return (
		<div className={className}>
			<div
				ref={tabListRef}
				role="tablist"
				className={`relative flex items-center ${style.base}`}
			>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						role="tab"
						aria-selected={activeTab === tab.id}
						aria-controls={`panel-${tab.id}`}
						data-tab-id={tab.id}
						disabled={tab.disabled}
						className={`
							relative flex items-center transition-all duration-200
							${style.tab}
							${activeTab === tab.id ? style.activeTab : style.inactiveTab}
						`}
						onClick={() => !tab.disabled && onChange(tab.id)}
					>
						{tab.icon && <span className="mr-2">{tab.icon}</span>}
						{tab.label}
					</button>
				))}
				{variant === 'default' && (
					<motion.div
						className={`absolute bottom-0 transition-all duration-200 ${style.indicator}`}
						initial={false}
						animate={{
							width: indicatorStyle.width,
							left: indicatorStyle.left,
						}}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
					/>
				)}
			</div>
		</div>
	);
};