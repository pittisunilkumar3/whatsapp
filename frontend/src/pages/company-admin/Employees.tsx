import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusPill } from '../../components/ui/StatusPill';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';
import { 
	Users,
	Plus,
	Search,
	Mail,
	Phone,
	MoreVertical,
	Edit,
	Trash2,
	Building2,
	UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Employee {
	id: string;
	employee_id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	department: string;
	status: 'active' | 'inactive';
	joined_date: string;
	performance: {
		responseRate: number;
		conversionRate: number;
		avgResponseTime: string;
	};
}

const mockEmployees: Employee[] = [
	{
		id: '1',
		employee_id: 'EMP001',
		name: 'John Smith',
		email: 'john@example.com',
		phone: '+1 234 567 8900',
		role: 'Sales Representative',
		department: 'Sales',
		status: 'active',
		joined_date: '2024-01-15',
		performance: {
			responseRate: 92,
			conversionRate: 28,
			avgResponseTime: '15m',
		}
	},
	{
		id: '2',
		employee_id: 'EMP002',
		name: 'Sarah Johnson',
		email: 'sarah@example.com',
		phone: '+1 234 567 8901',
		role: 'Sales Manager',
		department: 'Sales',
		status: 'active',
		joined_date: '2024-02-01',
		performance: {
			responseRate: 95,
			conversionRate: 32,
			avgResponseTime: '12m',
		}
	},
];

export const Employees: React.FC = () => {
	const navigate = useNavigate();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [newEmployee, setNewEmployee] = useState({
		name: '',
		email: '',
		phone: '',
		role: '',
		department: ''
	});

	const columns = [
		{
			header: 'Employee ID',
			accessorKey: 'employee_id'
		},
		{
			header: 'Name',
			accessorKey: 'name'
		},
		{
			header: 'Email',
			accessorKey: 'email'
		},
		{
			header: 'Department',
			accessorKey: 'department'
		},
		{
			header: 'Role',
			accessorKey: 'role'
		},
		{
			header: 'Status',
			accessorKey: 'status',
			cell: (info: any) => <StatusPill status={info.getValue()} />
		},
		{
			header: 'Performance',
			cell: ({ row }: any) => (
				<div className="flex items-center space-x-4">
					<div className="text-sm">
						<span className="font-medium">{row.original.performance.responseRate}%</span>
						<span className="text-gray-500 ml-1">Response</span>
					</div>
					<div className="text-sm">
						<span className="font-medium">{row.original.performance.conversionRate}%</span>
						<span className="text-gray-500 ml-1">Conv.</span>
					</div>
				</div>
			)
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
						{ label: 'View Details', onClick: () => {} },
						{ label: 'Manage Permissions', onClick: () => {} },
						{ label: 'Deactivate', onClick: () => {} }
					]}
				/>
			)
		}
	];

	const handleAddEmployee = () => {
		// Handle employee addition logic
		console.log('Adding new employee:', newEmployee);
		setIsAddModalOpen(false);
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">Employee Management</h1>
					<p className="text-sm text-gray-500 mt-1">
						Manage your company employees and their roles
					</p>
				</div>
				<Button onClick={() => navigate('/company-admin/addemployee')} className="w-full sm:w-auto">
					<UserPlus className="w-5 h-5 mr-2" />
					Add Employee
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="p-4 flex items-center space-x-4">
					<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
						<Users className="w-6 h-6 text-blue-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">Total Employees</h3>
						<p className="text-2xl font-bold text-blue-600">{mockEmployees.length}</p>
					</div>
				</Card>
				
				<Card className="p-4 flex items-center space-x-4">
					<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
						<Users className="w-6 h-6 text-green-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">Active</h3>
						<p className="text-2xl font-bold text-green-600">
							{mockEmployees.filter(emp => emp.status === 'active').length}
						</p>
					</div>
				</Card>

				<Card className="p-4 flex items-center space-x-4">
					<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
						<Building2 className="w-6 h-6 text-yellow-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">Departments</h3>
						<p className="text-2xl font-bold text-yellow-600">
							{new Set(mockEmployees.map(emp => emp.department)).size}
						</p>
					</div>
				</Card>
			</div>

			<Card className="p-4">
				<div className="relative">
					<Input
						placeholder="Search employees..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
					<Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
				</div>
			</Card>

			<Card className="p-6">
				<DataTable
					columns={columns}
					data={mockEmployees}
					pagination
				/>
			</Card>

			<Modal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="Add New Employee"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Full Name
						</label>
						<Input
							value={newEmployee.name}
							onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
							placeholder="Enter full name"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<div className="flex items-center">
							<Mail className="w-5 h-5 text-gray-400 mr-2" />
							<Input
								type="email"
								value={newEmployee.email}
								onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
								placeholder="Enter email address"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Phone Number
						</label>
						<div className="flex items-center">
							<Phone className="w-5 h-5 text-gray-400 mr-2" />
							<Input
								value={newEmployee.phone}
								onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
								placeholder="Enter phone number"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Department
						</label>
						<div className="flex items-center">
							<Building2 className="w-5 h-5 text-gray-400 mr-2" />
							<Input
								value={newEmployee.department}
								onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
								placeholder="Enter department"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Role
						</label>
						<Input
							value={newEmployee.role}
							onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
							placeholder="Enter role"
						/>
					</div>

					<div className="flex justify-end space-x-3 mt-6">
						<Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddEmployee}>
							Add Employee
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

