import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface Variable {
	name: string;
	description: string;
	example: string;
}

interface VariableListProps {
	variables: Variable[];
	onAdd: (variable: Variable) => void;
	onRemove: (name: string) => void;
	onEdit: (name: string, variable: Variable) => void;
	className?: string;
}

export const VariableList: React.FC<VariableListProps> = ({
	variables,
	onAdd,
	onRemove,
	onEdit,
	className = '',
}) => {
	const [isAdding, setIsAdding] = React.useState(false);
	const [editingVariable, setEditingVariable] = React.useState<string | null>(null);
	const [form, setForm] = React.useState<Variable>({
		name: '',
		description: '',
		example: '',
	});

	const resetForm = () => {
		setForm({ name: '', description: '', example: '' });
		setIsAdding(false);
		setEditingVariable(null);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingVariable) {
			onEdit(editingVariable, form);
		} else {
			onAdd(form);
		}
		resetForm();
	};

	const handleEdit = (variable: Variable) => {
		setForm(variable);
		setEditingVariable(variable.name);
		setIsAdding(true);
	};

	return (
		<div className={className}>
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-medium text-primary-text">Template Variables</h3>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setIsAdding(true)}
					disabled={isAdding}
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Variable
				</Button>
			</div>

			<AnimatePresence>
				{isAdding && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="overflow-hidden"
					>
						<form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg mb-4">
							<div className="space-y-4">
								<Input
									label="Variable Name"
									value={form.name}
									onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
									placeholder="e.g., customerName"
									required
									disabled={!!editingVariable}
								/>
								<Input
									label="Description"
									value={form.description}
									onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
									placeholder="e.g., Customer's full name"
									required
								/>
								<Input
									label="Example"
									value={form.example}
									onChange={(e) => setForm(prev => ({ ...prev, example: e.target.value }))}
									placeholder="e.g., John Smith"
									required
								/>
							</div>
							<div className="mt-4 flex justify-end space-x-2">
								<Button variant="ghost" type="button" onClick={resetForm}>
									Cancel
								</Button>
								<Button type="submit">
									{editingVariable ? 'Update' : 'Add'} Variable
								</Button>
							</div>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="space-y-2">
				{variables.map((variable) => (
					<motion.div
						key={variable.name}
						layout
						className="p-3 border rounded-lg bg-white"
					>
						<div className="flex items-start justify-between">
							<div>
								<div className="font-medium text-primary-text">
									{`{${variable.name}}`}
								</div>
								<div className="mt-1 text-sm text-secondary-text">
									{variable.description}
								</div>
								<div className="mt-1 text-sm text-secondary-text">
									Example: {variable.example}
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleEdit(variable)}
								>
									<Edit2 className="w-4 h-4" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onRemove(variable.name)}
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};