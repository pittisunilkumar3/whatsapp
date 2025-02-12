import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
}

const modalSizes = {
	sm: 'max-w-md',
	md: 'max-w-2xl',
	lg: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	size = 'md',
}) => {
	// Close on escape key
	React.useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [onClose]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="fixed inset-0 bg-black bg-opacity-50 z-40"
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
							duration: 0.3
						}}
						className="fixed inset-0 z-50 flex items-center justify-center p-4"
					>
						<div
							className={`
								w-full ${modalSizes[size]} bg-white rounded-t-xl rounded-b-none md:rounded-xl
								backdrop-filter backdrop-blur-[10px] bg-opacity-70
								border border-white border-opacity-30
								shadow-[0_8px_32px_0_rgba(31,38,135,0.17)]
							`}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="flex items-center justify-between p-6 border-b">
								<h2 className="text-xl font-semibold text-primary-text">{title}</h2>
								<Button
									variant="ghost"
									size="sm"
									onClick={onClose}
									aria-label="Close modal"
								>
									<X className="w-5 h-5" />
								</Button>
							</div>

							{/* Content */}
							<div className="p-6">{children}</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};