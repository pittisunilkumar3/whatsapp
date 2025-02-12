import React, { useEffect, useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface KeyboardShortcut {
	key: string;
	description: string;
	action: () => void;
}

const globalShortcuts: KeyboardShortcut[] = [
	{
		key: '/',
		description: 'Focus search',
		action: () => document.querySelector<HTMLInputElement>('#search-input')?.focus()
	},
	{
		key: 'g h',
		description: 'Go to home',
		action: () => window.location.href = '/'
	},
	{
		key: 'g c',
		description: 'Go to communication hub',
		action: () => window.location.href = '/communication-hub'
	},
	{
		key: 'g a',
		description: 'Go to analytics',
		action: () => window.location.href = '/analytics'
	},
	{
		key: 'g s',
		description: 'Go to settings',
		action: () => window.location.href = '/settings'
	},
	{
		key: 'Escape',
		description: 'Close modal/popup',
		action: () => document.querySelector<HTMLElement>('[role="dialog"] button[aria-label="Close"]')?.click()
	}
];

export const KeyboardNavigation: React.FC = () => {
	const { focusVisible } = useAccessibility();
	const [showHelp, setShowHelp] = useState(false);

	useEffect(() => {
		const pressedKeys: string[] = [];
		let keyTimer: NodeJS.Timeout;

		const handleKeyDown = (e: KeyboardEvent) => {
			// Don't trigger shortcuts when typing in input fields
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return;
			}

			pressedKeys.push(e.key);
			clearTimeout(keyTimer);

			// Show keyboard shortcuts help with '?'
			if (e.key === '?' && !e.shiftKey) {
				e.preventDefault();
				setShowHelp(prev => !prev);
				return;
			}

			// Check for shortcuts
			const shortcut = globalShortcuts.find(s => s.key === pressedKeys.join(' '));
			if (shortcut) {
				e.preventDefault();
				shortcut.action();
			}

			// Reset pressed keys after a delay
			keyTimer = setTimeout(() => {
				pressedKeys.length = 0;
			}, 1000);
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			clearTimeout(keyTimer);
		};
	}, []);

	return (
		<>
			{showHelp && (
				<div
					role="dialog"
					aria-label="Keyboard shortcuts"
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					onClick={() => setShowHelp(false)}
				>
					<div
						className="bg-white rounded-lg p-6 max-w-md w-full"
						onClick={e => e.stopPropagation()}
					>
						<h2 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h2>
						<div className="space-y-2">
							{globalShortcuts.map(shortcut => (
								<div key={shortcut.key} className="flex justify-between">
									<kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
										{shortcut.key}
									</kbd>
									<span className="text-secondary-text">
										{shortcut.description}
									</span>
								</div>
							))}
						</div>
						<p className="mt-4 text-sm text-secondary-text">
							Press '?' to toggle this help dialog
						</p>
					</div>
				</div>
			)}
		</>
	);
};