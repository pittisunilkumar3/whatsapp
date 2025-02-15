import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { Column } from '../../components/ui/DataTable';
import { DataTable } from '../../components/ui/DataTable';
import { Pen, Trash2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

interface Role {
	id: number;
	name: string;
	slug: string;
	is_active: boolean;
	is_system: boolean;
	is_superadmin: boolean;
	created_at: string;
	updated_at: string;
}

export const RoleManagement = () => {
	const navigate = useNavigate();
	const [roleName, setRoleName] = useState('');
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [roles, setRoles] = useState<Role[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [isSystem, setIsSystem] = useState(false);
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);

	const fetchRoles = async () => {
		try {
			const response = await apiService.listRoles();
			setRoles(response.data);
		} catch (error) {
			toast.error('Failed to fetch roles');
			console.error('Error fetching roles:', error);
		}
	};

	useEffect(() => {
		fetchRoles();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!roleName) return;
		
		setIsLoading(true);
		try {
			if (editingRole) {
				const updateData = {
					name: roleName,
					slug: roleName.toLowerCase().replace(/\s+/g, '-'),
					is_active: isActive,
					is_system: isSystem,
					is_superadmin: isSuperAdmin
				};
				console.log('Updating role with data:', { id: editingRole.id, updateData });
				const response = await apiService.updateRole(editingRole.id, updateData);
				console.log('Update response:', response);
				toast.success('Role updated successfully');
			} else {
				console.log('Creating new role:', { name: roleName });
				const response = await apiService.createRole({
					name: roleName,
					slug: roleName.toLowerCase().replace(/\s+/g, '-'),
					is_active: isActive,
					is_system: isSystem,
					is_superadmin: isSuperAdmin,
				});
				console.log('Create response:', response);
				toast.success('Role created successfully');
			}
			await fetchRoles();
			setEditingRole(null);
			setRoleName('');
			setIsActive(true);
			setIsSystem(false);
			setIsSuperAdmin(false);
		} catch (error) {
			console.error('Error details:', error);
			if (error instanceof Error) {
				toast.error(`Failed to ${editingRole ? 'update' : 'create'} role: ${error.message}`);
			} else {
				toast.error(editingRole ? 'Failed to update role' : 'Failed to create role');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (role: Role) => {
		setEditingRole(role);
		setRoleName(role.name);
		setIsActive(role.is_active);
		setIsSystem(role.is_system);
		setIsSuperAdmin(role.is_superadmin);
	};

	const handleDelete = async (roleId: number) => {
		if (!window.confirm('Are you sure you want to delete this role?')) return;
		
		setIsLoading(true);
		try {
			await apiService.deleteRole(roleId);
			toast.success('Role deleted successfully');
			fetchRoles();
		} catch (error) {
			toast.error('Failed to delete role');
			console.error('Error deleting role:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const columns: Column<Role>[] = [
		{ key: 'name' as keyof Role, title: 'Role', sortable: true },
		{ 
			key: 'is_system' as keyof Role, 
			title: 'Type',
			render: (value: boolean) => value ? 'System' : 'Custom'
		},
		{
			key: 'is_active' as keyof Role,
			title: 'Status',
			render: (value: boolean) => value ? 'Active' : 'Inactive'
		},
		{
			key: 'actions' as keyof Role,
			title: 'Action',
			render: (_: any, row: Role) => (
				<div className="flex gap-2">
					<Button 
						variant="ghost" 
						size="sm" 
						onClick={() => handleEdit(row)}
						disabled={isLoading || row.is_system}
					>
						<Pen className="h-4 w-4" />
					</Button>
					<Button 
						variant="ghost" 
						size="sm" 
						onClick={() => handleDelete(row.id)}
						disabled={isLoading || row.is_system}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate(`/superadmin/permissions/${row.id}`)}
					>
						<Lock className="h-4 w-4" />
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
							disabled={isLoading}
						/>
					</div>
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={isActive}
								onChange={(e) => setIsActive(e.target.checked)}
								disabled={isLoading}
								className="mr-2"
							/>
							Active
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={isSystem}
								onChange={(e) => setIsSystem(e.target.checked)}
								disabled={isLoading}
								className="mr-2"
							/>
							System
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={isSuperAdmin}
								onChange={(e) => setIsSuperAdmin(e.target.checked)}
								disabled={isLoading}
								className="mr-2"
							/>
							Super Admin
						</label>
					</div>
					<div className="flex gap-2">
						<Button type="submit" disabled={isLoading}>
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
								disabled={isLoading}
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

