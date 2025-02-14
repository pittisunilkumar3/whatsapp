import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	CheckCircle,
	AlertCircle,
	Info,
	XCircle,
	X
} from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface NotificationToastProps {
	type: ToastType;
	message: string;
	isVisible: boolean;
	onClose: () => void;
	duration?: number;
}

const toastConfig = {
	success: {
		icon: CheckCircle,
		bgColor: 'bg-green-50',
		textColor: 'text-green-800',
		iconColor: 'text-green-400',
		borderColor: 'border-green-200',
	},
	error: {
		icon: XCircle,
		bgColor: 'bg-red-50',
		textColor: 'text-red-800',
		iconColor: 'text-red-400',
		borderColor: 'border-red-200',
	},
	warning: {
		icon: AlertCircle,
		bgColor: 'bg-yellow-50',
		textColor: 'text-yellow-800',
		iconColor: 'text-yellow-400',
		borderColor: 'border-yellow-200',
	},
	info: {
		icon: Info,
		bgColor: 'bg-blue-50',
		textColor: 'text-blue-800',
		iconColor: 'text-blue-400',
		borderColor: 'border-blue-200',
	},
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
	type,
	message,
	isVisible,
	onClose,
	duration = 5000,
}) => {
	React.useEffect(() => {
		if (isVisible && duration > 0) {
			const timer = setTimeout(onClose, duration);
			return () => clearTimeout(timer);
		}
	}, [isVisible, duration, onClose]);

	const config = toastConfig[type] || toastConfig.info; // Fallback to info if type is invalid
	const Icon = config.icon || Info; // Fallback to Info icon if icon is undefined

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 30,
					}}
					className="fixed top-4 right-4 z-[100]"
				>
					<div
						className={`
							flex items-center p-4 rounded-lg shadow-lg border
							${config.bgColor}
							${config.borderColor}
							backdrop-filter backdrop-blur-[10px] bg-opacity-90
						`}
						role="alert"
					>
						<Icon className={`w-5 h-5 ${config.iconColor}`} />
						<p className={`mx-3 text-sm font-medium ${config.textColor}`}>
							{message}
						</p>
						<button
							onClick={onClose}
							className={`
								ml-4 flex-shrink-0 inline-flex rounded-lg p-1
								focus:outline-none focus:ring-2 focus:ring-offset-2
								${config.textColor} hover:bg-opacity-10 hover:bg-black
							`}
							aria-label="Close notification"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};