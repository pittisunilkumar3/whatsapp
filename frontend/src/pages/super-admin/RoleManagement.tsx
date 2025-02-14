import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Pencil, Trash2 } from 'lucide-react';

interface Role {
	id: number;
	name: string;
	type: string;
}

export const RoleManagement = () => {
	const [roleName, setRoleName] = useState('');
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [roles, setRoles] = useState<Role[]>([
		{ id: 1, name: 'Admin', type: 'System' },
		{ id: 2, name: 'Teacher', type: 'System' },
		{ id: 3, name: 'Accountant', type: 'System' },
	]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!roleName) return;
		
		if (editingRole) {
			setRoles(roles.map(role => 
				role.id === editingRole.id 
					? { ...role, name: roleName }
					: role
			));
			setEditingRole(null);
		} else {
			const newRole = {
				id: roles.length + 1,
				name: roleName,
				type: 'System'
			};
			setRoles([...roles, newRole]);
		}
		setRoleName('');
	};

	const handleEdit = (role: Role) => {
		setEditingRole(role);
		setRoleName(role.name);
	};

	const handleDelete = (roleId: number) => {
		setRoles(roles.filter(role => role.id !== roleId));
	};

	const columns = [
		{ key: 'name', title: 'Role', sortable: true },
		{ key: 'type', title: 'Type', sortable: true },
		{
			key: 'actions',
			title: 'Action',
			render: (_: any, row: Role) => (
				<div className="flex gap-2">
					<Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="p-6 space-y-6">
			<Card className="p-6">
				<h2 className="text-2xl font-bold mb-4">
					{editingRole ? 'Edit Role' : 'Add Role'}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Name</label>
						<Input
							value={roleName}
							onChange={(e) => setRoleName(e.target.value)}
							placeholder="Enter role name"
							required
						/>
					</div>
					<div className="flex gap-2">
						<Button type="submit">
							{editingRole ? 'Update' : 'Save'}
						</Button>
						{editingRole && (
							<Button 
								type="button" 
								variant="secondary"
								onClick={() => {
									setEditingRole(null);
									setRoleName('');
								}}
							>
								Cancel
							</Button>
						)}
					</div>
				</form>
			</Card>

			<Card className="p-6">
				<h2 className="text-2xl font-bold mb-4">Role List</h2>
				<DataTable
					columns={columns}
					data={roles}
					pageSize={10}
				/>
			</Card>
		</div>
	);
};

