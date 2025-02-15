import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Pencil, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

interface CompanyRole {
	id: number;
	company_id: number;
	name: string;
	slug: string;
	is_active: number;
	is_system: number;
	is_superadmin: number;
	created_at?: string;
	updated_at?: string;
}

export const CompanyRoleManagement = () => {
	const user = useAuthStore(state => state.user);
	const companyId = user?.company?.id;
	const [roleName, setRoleName] = useState('');
	const [editingRole, setEditingRole] = useState<CompanyRole | null>(null);
	const [roles, setRoles] = useState<CompanyRole[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isActive, setIsActive] = useState(1);
	const [isSystem, setIsSystem] = useState(0);
	const [isSuperAdmin, setIsSuperAdmin] = useState(0);

	const fetchRoles = async () => {
		try {
			const response = await apiService.listCompanyRoles({ company_id: companyId });
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
		if (!companyId) {
			toast.error('Company ID not found');
			return;
		}
		
		setIsLoading(true);
		try {
			if (editingRole) {
				const updateData = {
					company_id: editingRole.company_id,
					name: roleName,
					slug: roleName.toLowerCase().replace(/\s+/g, '-'),
					is_active: isActive,
					is_system: isSystem,
					is_superadmin: isSuperAdmin
				};
				await apiService.updateCompanyRole(editingRole.id, updateData);
				toast.success('Role updated successfully');
			} else {
				await apiService.createCompanyRole({
					company_id: companyId,
					name: roleName,
					slug: roleName.toLowerCase().replace(/\s+/g, '-'),
					is_active: isActive,
					is_system: isSystem,
					is_superadmin: isSuperAdmin
				});
				toast.success('Role created successfully');
			}
			await fetchRoles();
			setEditingRole(null);
			setRoleName('');
			resetForm();
		} catch (error) {
			console.error('Error details:', error);
			toast.error(editingRole ? 'Failed to update role' : 'Failed to create role');
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (role: CompanyRole) => {
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
			await apiService.deleteCompanyRole(roleId);
			toast.success('Role deleted successfully');
			fetchRoles();
		} catch (error) {
			toast.error('Failed to delete role');
			console.error('Error deleting role:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setIsActive(1);
		setIsSystem(0);
		setIsSuperAdmin(0);
	};

	const columns = [
		{ key: 'name', title: 'Role', sortable: true },
		{ 
			key: 'is_system', 
			title: 'Type',
			render: (value: number) => value ? 'System' : 'Custom'
		},
		{
			key: 'is_active',
			title: 'Status',
			render: (value: number) => value ? 'Active' : 'Inactive'
		},
		{
			key: 'actions',
			title: 'Action',
			render: (_: any, row: CompanyRole) => (
				<div className="flex gap-2">
					<Button 
						variant="ghost" 
						size="sm" 
						onClick={() => handleEdit(row)}
						disabled={isLoading || row.is_system === 1}
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button 
						variant="ghost" 
						size="sm" 
						onClick={() => handleDelete(row.id)}
						disabled={isLoading || row.is_system === 1}
					>
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
							disabled={isLoading}
						/>
					</div>
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={isActive === 1}
								onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
								disabled={isLoading}
								className="mr-2"
							/>
							Active
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={isSystem === 1}
								onChange={(e) => setIsSystem(e.target.checked ? 1 : 0)}
								disabled={isLoading}
								className="mr-2"
							/>
							System
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={isSuperAdmin === 1}
								onChange={(e) => setIsSuperAdmin(e.target.checked ? 1 : 0)}
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
									resetForm();
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



