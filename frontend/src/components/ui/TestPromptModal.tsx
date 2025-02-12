import React from 'react';
import { motion } from 'framer-motion';
import { 
	MessageSquare,
	Phone,
	Mail,
	MessageCircle,
	Play,
	RefreshCw,
	Check,
	AlertCircle
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';

interface TestPromptModalProps {
	isOpen: boolean;
	onClose: () => void;
	channel: 'whatsapp' | 'sms' | 'voice' | 'email';
	template: string;
	variables: { name: string; description: string; }[];
	onTest: (values: Record<string, string>) => Promise<void>;
}

const channelConfig = {
	whatsapp: {
		icon: MessageSquare,
		label: 'WhatsApp',
		color: 'whatsapp-green',
	},
	sms: {
		icon: MessageCircle,
		label: 'SMS',
		color: 'purple-500',
	},
	voice: {
		icon: Phone,
		label: 'Voice',
		color: 'orange-500',
	},
	email: {
		icon: Mail,
		label: 'Email',
		color: 'blue-500',
	},
};

export const TestPromptModal: React.FC<TestPromptModalProps> = ({
	isOpen,
	onClose,
	channel,
	template,
	variables,
	onTest,
}) => {
	const [values, setValues] = React.useState<Record<string, string>>({});
	const [preview, setPreview] = React.useState('');
	const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const config = channelConfig[channel];

	const generatePreview = () => {
		let result = template;
		Object.entries(values).forEach(([key, value]) => {
			result = result.replace(new RegExp(`{${key}}`, 'g'), value);
		});
		setPreview(result);
	};

	React.useEffect(() => {
		generatePreview();
	}, [values, template]);

	const handleTest = async () => {
		setStatus('loading');
		try {
			await onTest(values);
			setStatus('success');
		} catch (error) {
			setStatus('error');
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Test ${config.label} Template`}
		>
			<div className="space-y-6">
				{/* Variable Inputs */}
				<div className="space-y-4">
					<h3 className="text-sm font-medium text-primary-text">Template Variables</h3>
					{variables.map((variable) => (
						<Input
							key={variable.name}
							label={variable.name}
							value={values[variable.name] || ''}
							onChange={(e) => setValues(prev => ({
								...prev,
								[variable.name]: e.target.value,
							}))}
							placeholder={variable.description}
						/>
					))}
				</div>

				{/* Preview */}
				<div>
					<h3 className="text-sm font-medium text-primary-text mb-2">Preview</h3>
					<div className="p-4 bg-gray-50 rounded-lg">
						<p className="text-sm whitespace-pre-wrap">{preview}</p>
					</div>
				</div>

				{/* Status */}
				{status !== 'idle' && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`
							p-4 rounded-lg flex items-center space-x-2
							${status === 'loading' ? 'bg-blue-50 text-blue-700' :
								status === 'success' ? 'bg-green-50 text-green-700' :
								'bg-red-50 text-red-700'}
						`}
					>
						{status === 'loading' ? (
							<RefreshCw className="w-5 h-5 animate-spin" />
						) : status === 'success' ? (
							<Check className="w-5 h-5" />
						) : (
							<AlertCircle className="w-5 h-5" />
						)}
						<span>
							{status === 'loading' ? 'Sending test message...' :
								status === 'success' ? 'Test message sent successfully!' :
								'Failed to send test message'}
						</span>
					</motion.div>
				)}

				{/* Actions */}
				<div className="flex justify-end space-x-2">
					<Button variant="ghost" onClick={onClose}>
						Close
					</Button>
					<Button
						onClick={handleTest}
						disabled={status === 'loading'}
					>
						<Play className="w-4 h-4 mr-2" />
						Send Test
					</Button>
				</div>
			</div>
		</Modal>
	);
};