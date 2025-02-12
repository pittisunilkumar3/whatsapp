import React from 'react';
import { motion } from 'framer-motion';
import { 
	MessageSquare,
	Mail,
	Phone,
	MessageCircle,
	Plus,
	X,
	Save,
	RefreshCw
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface Variable {
	name: string;
	description: string;
	example: string;
}

interface PromptEditorProps {
	value: string;
	onChange: (value: string) => void;
	variables?: Variable[];
	channel: 'whatsapp' | 'sms' | 'voice' | 'email';
	onSave?: () => void;
	onTest?: () => void;
	className?: string;
}

const channelConfig = {
	whatsapp: {
		icon: MessageSquare,
		label: 'WhatsApp',
		color: 'whatsapp-green',
		maxLength: 1000,
	},
	sms: {
		icon: MessageCircle,
		label: 'SMS',
		color: 'purple-500',
		maxLength: 160,
	},
	voice: {
		icon: Phone,
		label: 'Voice',
		color: 'orange-500',
		maxLength: 500,
	},
	email: {
		icon: Mail,
		label: 'Email',
		color: 'blue-500',
		maxLength: 5000,
	},
};

export const PromptEditor: React.FC<PromptEditorProps> = ({
	value,
	onChange,
	variables = [],
	channel,
	onSave,
	onTest,
	className = '',
}) => {
	const config = channelConfig[channel];
	const [selectedVariable, setSelectedVariable] = React.useState<Variable | null>(null);

	const insertVariable = (variable: Variable) => {
		const cursorPosition = (document.activeElement as HTMLTextAreaElement)?.selectionStart || value.length;
		const newValue = value.slice(0, cursorPosition) + 
			`{${variable.name}}` + 
			value.slice(cursorPosition);
		onChange(newValue);
	};

	return (
		<div className={className}>
			{/* Editor Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center space-x-2">
					<div className={`p-2 rounded-lg bg-${config.color} bg-opacity-10`}>
						<config.icon className={`w-5 h-5 text-${config.color}`} />
					</div>
					<h3 className="font-medium text-primary-text">
						{config.label} Template Editor
					</h3>
				</div>
				<div className="flex items-center space-x-2">
					{onTest && (
						<Button variant="ghost" onClick={onTest}>
							<RefreshCw className="w-4 h-4 mr-2" />
							Test
						</Button>
					)}
					{onSave && (
						<Button onClick={onSave}>
							<Save className="w-4 h-4 mr-2" />
							Save
						</Button>
					)}
				</div>
			</div>

			{/* Editor Content */}
			<div className="flex space-x-4">
				<div className="flex-1">
					<textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className={`
							w-full h-64 p-4 rounded-lg border border-gray-200
							focus:outline-none focus:ring-2 focus:ring-${config.color} focus:border-transparent
							resize-none font-mono text-sm
						`}
						placeholder={`Enter your ${config.label} template...`}
						maxLength={config.maxLength}
					/>
					<div className="mt-2 text-sm text-secondary-text">
						{value.length} / {config.maxLength} characters
					</div>
				</div>

				{/* Variables Panel */}
				{variables.length > 0 && (
					<div className="w-64 flex-shrink-0">
						<div className="mb-2 text-sm font-medium text-primary-text">
							Available Variables
						</div>
						<div className="space-y-2">
							{variables.map((variable) => (
								<motion.button
									key={variable.name}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`
										w-full p-2 text-left rounded-lg border border-gray-200
										hover:bg-gray-50 transition-colors duration-200
										${selectedVariable?.name === variable.name ? 'bg-gray-50' : ''}
									`}
									onClick={() => {
										insertVariable(variable);
										setSelectedVariable(variable);
									}}
								>
									<div className="font-medium text-sm">{`{${variable.name}}`}</div>
									<div className="mt-1 text-xs text-secondary-text">
										{variable.description}
									</div>
								</motion.button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};