import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	Plus,
	Copy,
	Trash2,
	Edit2,
	ChevronRight,
	Check,
	X
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';

interface PromptVariation {
	id: string;
	name: string;
	content: string;
	metrics?: {
		responseRate?: number;
		conversionRate?: number;
	};
	isActive?: boolean;
}

interface PromptVariationManagerProps {
	variations: PromptVariation[];
	onAdd: (variation: Omit<PromptVariation, 'id'>) => void;
	onEdit: (id: string, variation: Partial<PromptVariation>) => void;
	onDelete: (id: string) => void;
	onDuplicate: (id: string) => void;
	className?: string;
}

export const PromptVariationManager: React.FC<PromptVariationManagerProps> = ({
	variations,
	onAdd,
	onEdit,
	onDelete,
	onDuplicate,
	className = '',
}) => {
	const [editingId, setEditingId] = React.useState<string | null>(null);
	const [form, setForm] = React.useState<Partial<PromptVariation>>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingId) {
			onEdit(editingId, form);
		} else {
			onAdd(form as Omit<PromptVariation, 'id'>);
		}
		setForm({});
		setEditingId(null);
	};

	return (
		<div className={className}>
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-medium text-primary-text">Template Variations</h3>
				<Button
					variant="ghost"
					onClick={() => setEditingId('new')}
					disabled={!!editingId}
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Variation
				</Button>
			</div>

			<div className="space-y-4">
				<AnimatePresence>
					{editingId && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className="overflow-hidden"
						>
							<Card className="p-4 bg-gray-50">
								<form onSubmit={handleSubmit} className="space-y-4">
									<Input
										label="Variation Name"
										value={form.name || ''}
										onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
										placeholder="e.g., Version A"
										required
									/>
									<div>
										<label className="block text-sm font-medium text-primary-text mb-2">
											Content
										</label>
										<textarea
											value={form.content || ''}
											onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
											className="w-full h-32 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
											placeholder="Enter template content..."
											required
										/>
									</div>
									<div className="flex justify-end space-x-2">
										<Button
											variant="ghost"
											type="button"
											onClick={() => {
												setForm({});
												setEditingId(null);
											}}
										>
											Cancel
										</Button>
										<Button type="submit">
											{editingId === 'new' ? 'Add' : 'Update'} Variation
										</Button>
									</div>
								</form>
							</Card>
						</motion.div>
					)}
				</AnimatePresence>

				{variations.map((variation) => (
					<Card
						key={variation.id}
						className={`p-4 ${variation.isActive ? 'border-whatsapp-green' : ''}`}
					>
						<div className="flex items-start justify-between">
							<div>
								<div className="flex items-center space-x-2">
									<h4 className="font-medium">{variation.name}</h4>
									{variation.isActive && (
										<span className="text-sm text-whatsapp-green">Active</span>
									)}
								</div>
								<p className="mt-2 text-sm text-secondary-text">
									{variation.content}
								</p>
								{variation.metrics && (
									<div className="mt-2 flex items-center space-x-4 text-sm text-secondary-text">
										<span>Response Rate: {variation.metrics.responseRate}%</span>
										<span>Conversion Rate: {variation.metrics.conversionRate}%</span>
									</div>
								)}
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setForm(variation);
										setEditingId(variation.id);
									}}
								>
									<Edit2 className="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onDuplicate(variation.id)}
								>
									<Copy className="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onDelete(variation.id)}
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};