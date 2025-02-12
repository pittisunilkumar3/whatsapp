import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DataTable } from '../ui/DataTable';
import { StatusPill } from '../ui/StatusPill';
import { Plus, MoreVertical, UserPlus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Dropdown } from '../ui/Dropdown';

interface ChannelPermissions {
	whatsapp: boolean;
	sms: boolean;
	voice: boolean;
	email: boolean;
}

interface RolePermissions {
	leads: {
		view: boolean;
		create: boolean;
		edit: boolean;
		delete: boolean;
	};
	campaigns: {
		view: boolean;
		create: boolean;
		edit: boolean;
		delete: boolean;
	};
	analytics: {
		view: boolean;
		export: boolean;
	};
	channels: ChannelPermissions;
}

interface User {
	id: string;
	name: string;
	email: string;
	role: 'company_admin' | 'employee';
	status: 'active' | 'inactive';
	lastActive: string;
	permissions: RolePermissions;
}

const mockUsers: User[] = [
	{
		id: '1',
		name: 'John Smith',
		email: 'john@example.com',
		role: 'company_admin',
		status: 'active',
		lastActive: '2024-02-15'
	},
	{
		id: '2',
		name: 'Sarah Johnson',
		email: 'sarah@example.com',
		role: 'employee',
		status: 'active',
		lastActive: '2024-02-15'
	}
];

export const UserManagement: React.FC = () => {
	const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
	const [newUser, setNewUser] = useState({
		name: '',
		email: '',
		role: 'employee',
		permissions: {
			leads: { view: true, create: false, edit: false, delete: false },
			campaigns: { view: true, create: false, edit: false, delete: false },
			analytics: { view: true, export: false },
			channels: { whatsapp: true, sms: false, voice: false, email: false }
		}
	});

	const columns = [
		{
			header: 'Name',
			accessorKey: 'name'
		},
		{
			header: 'Email',
			accessorKey: 'email'
		},
		{
			header: 'Role',
			accessorKey: 'role',
			cell: (info: any) => (
				<span className="capitalize">
					{info.getValue().replace('_', ' ')}
				</span>
			)
		},
		{
			header: 'Status',
			accessorKey: 'status',
			cell: (info: any) => <StatusPill status={info.getValue()} />
		},
		{
			header: 'Last Active',
			accessorKey: 'lastActive'
		},
		{
			header: 'Actions',
			cell: () => (
				<Dropdown
					trigger={
						<Button variant="ghost" size="sm">
							<MoreVertical className="w-4 h-4" />
						</Button>
					}
					items={[
						{ label: 'Edit', onClick: () => {} },
						{ label: 'Deactivate', onClick: () => {} },
						{ label: 'Delete', onClick: () => {} }
					]}
				/>
			)
		}
	];

	const handleAddUser = () => {
		// Handle user addition logic
		setIsAddUserModalOpen(false);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-lg font-semibold">User Management</h2>
					<p className="text-secondary-text mt-1">Manage team members and their roles</p>
				</div>
				<Button onClick={() => setIsAddUserModalOpen(true)}>
					<UserPlus className="w-4 h-4 mr-2" />
					Add User
				</Button>
			</div>

			<Card className="p-6">
				<DataTable
					columns={columns}
					data={mockUsers}
					pagination
				/>
			</Card>

			<Modal
				isOpen={isAddUserModalOpen}
				onClose={() => setIsAddUserModalOpen(false)}
				title="Add New User"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Name
						</label>
						<Input
							value={newUser.name}
							onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
							placeholder="Enter user name"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<Input
							type="email"
							value={newUser.email}
							onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
							placeholder="Enter email address"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Role
						</label>
						<select
							className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-whatsapp-green focus:border-whatsapp-green sm:text-sm rounded-md"
							value={newUser.role}
							onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'employee' | 'company_admin' }))}
						>
							<option value="employee">Employee</option>
							<option value="company_admin">Company Admin</option>
						</select>
					</div>

					<div className="border-t pt-4 mt-4">
						<h3 className="font-medium mb-4">Permissions</h3>
						
						<div className="space-y-6">
							<div>
								<h4 className="text-sm font-medium mb-2">Channel Access</h4>
								<div className="grid grid-cols-2 gap-2">
									{Object.entries(newUser.permissions.channels).map(([channel, enabled]) => (
										<label key={channel} className="flex items-center space-x-2">
											<input
												type="checkbox"
												checked={enabled}
												onChange={(e) => setNewUser(prev => ({
													...prev,
													permissions: {
														...prev.permissions,
														channels: {
															...prev.permissions.channels,
															[channel]: e.target.checked
														}
													}
												}))}
												className="rounded border-gray-300 text-whatsapp-green focus:ring-whatsapp-green"
											/>
											<span className="capitalize">{channel}</span>
										</label>
									))}
								</div>
							</div>

							<div>
								<h4 className="text-sm font-medium mb-2">Feature Access</h4>
								{Object.entries(newUser.permissions).map(([feature, permissions]) => {
									if (feature === 'channels') return null;
									return (
										<div key={feature} className="mb-4">
											<h5 className="text-sm font-medium capitalize mb-2">{feature}</h5>
											<div className="grid grid-cols-2 gap-2">
												{Object.entries(permissions).map(([action, enabled]) => (
													<label key={action} className="flex items-center space-x-2">
														<input
															type="checkbox"
															checked={enabled}
															onChange={(e) => setNewUser(prev => ({
																...prev,
																permissions: {
																	...prev.permissions,
																	[feature]: {
																		...prev.permissions[feature],
																		[action]: e.target.checked
																	}
																}
															}))}
															className="rounded border-gray-300 text-whatsapp-green focus:ring-whatsapp-green"
														/>
														<span className="capitalize">{action}</span>
													</label>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					<div className="flex justify-end space-x-3 mt-6">
						<Button variant="ghost" onClick={() => setIsAddUserModalOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddUser}>
							Add User
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};