import React from 'react';

interface SkipLink {
	id: string;
	label: string;
}

const skipLinks: SkipLink[] = [
	{ id: 'main-content', label: 'Skip to main content' },
	{ id: 'navigation', label: 'Skip to navigation' },
	{ id: 'search', label: 'Skip to search' }
];

export const SkipNavigation: React.FC = () => {
	return (
		<nav
			aria-label="Skip navigation"
			className="fixed top-0 left-0 z-50"
		>
			{skipLinks.map(link => (
				<a
					key={link.id}
					href={`#${link.id}`}
					className="
						sr-only focus:not-sr-only
						focus:fixed focus:top-0 focus:left-0
						focus:p-4 focus:m-3
						focus:bg-white focus:text-primary-text
						focus:shadow-lg focus:rounded-lg
						focus:outline-none focus:ring-2 focus:ring-whatsapp-green
					"
				>
					{link.label}
				</a>
			))}
		</nav>
	);
};

// Add corresponding IDs to main content areas
export const MainContentMarkers: React.FC = () => {
	return (
		<>
			<div id="main-content" tabIndex={-1} />
			<div id="navigation" tabIndex={-1} />
			<div id="search" tabIndex={-1} />
		</>
	);
};