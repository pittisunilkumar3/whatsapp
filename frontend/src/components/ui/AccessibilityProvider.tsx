import React, { createContext, useContext, useState } from 'react';

interface AccessibilityContextType {
	highContrast: boolean;
	toggleHighContrast: () => void;
	fontSize: number;
	increaseFontSize: () => void;
	decreaseFontSize: () => void;
	focusVisible: boolean;
	setFocusVisible: (visible: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [highContrast, setHighContrast] = useState(false);
	const [fontSize, setFontSize] = useState(16);
	const [focusVisible, setFocusVisible] = useState(true);

	const toggleHighContrast = () => setHighContrast(prev => !prev);

	const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
	const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Tab') {
				setFocusVisible(true);
			}
		};

		const handleMouseDown = () => {
			setFocusVisible(false);
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('mousedown', handleMouseDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleMouseDown);
		};
	}, []);

	React.useEffect(() => {
		document.documentElement.style.fontSize = `${fontSize}px`;
		if (highContrast) {
			document.documentElement.classList.add('high-contrast');
		} else {
			document.documentElement.classList.remove('high-contrast');
		}
	}, [fontSize, highContrast]);

	const value = {
		highContrast,
		toggleHighContrast,
		fontSize,
		increaseFontSize,
		decreaseFontSize,
		focusVisible,
		setFocusVisible
	};

	return (
		<AccessibilityContext.Provider value={value}>
			{children}
		</AccessibilityContext.Provider>
	);
};

export const useAccessibility = () => {
	const context = useContext(AccessibilityContext);
	if (context === undefined) {
		throw new Error('useAccessibility must be used within an AccessibilityProvider');
	}
	return context;
};