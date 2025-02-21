import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusPill } from '../../components/ui/StatusPill';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';
import { useAuthStore } from '../../store/authStore';

import { Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/Switch';

interface Employee {
	id: number;
	company_id: number;
	employee_id: string;
	name: string;
	surname: string;
	email: string;
	contact_no: string;
	department: number | null;
	designation: number | null;
	qualification: string;
	is_active: number;
}

const mockEmployees: Employee[] = [
	{
		id: 1,
		company_id: 1,
		employee_id: 'EMP001',
		name: 'John',
		surname: 'Smith',
		email: 'john@example.com',
		contact_no: '+1 234 567 8900',
		department: 1,
		designation: 1,
		qualification: 'Bachelor',
		is_active: 1
	},
	{
		id: 2,
		company_id: 1,
		employee_id: 'EMP002',
		name: 'Sarah',
		surname: 'Johnson',
		email: 'sarah@example.com',
		contact_no: '+1 234 567 8901',
		department: 1,
		designation: 2,
		qualification: 'Master',
		is_active: 1
	},
];

// Add department and designation mappings
const departmentMap: { [key: number]: string } = {
	1: 'Sales',
	2: 'Marketing',
	3: 'Engineering',
	4: 'HR',
	5: 'Finance'
};

const designationMap: { [key: number]: string } = {
	1: 'Manager',
	2: 'Team Lead',
	3: 'Senior Executive',
	4: 'Executive',
	5: 'Associate'
};

type EmployeeColumn = {
	header: string;
	accessorKey: keyof Employee;
	key: keyof Employee;
	title: string;
	cell?: (props: { row: { original: Employee } }) => React.ReactNode;
};

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
	const [employees, setEmployees] = useState<Employee[]>([]);

	useEffect(() => {
		const user = useAuthStore(state => state.user);
    	const companyId = user?.company?.id;
		const fetchEmployees = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/company-employees/company/${companyId}`);
				const data = await response.json();
				setEmployees(data.data);
			} catch (error) {
				console.error('Error fetching employees:', error);
			}
		};

		fetchEmployees();
	}, []);

	const columns: EmployeeColumn[] = [
		{
			header: 'Employee ID',
			accessorKey: 'employee_id',
			key: 'employee_id',
			title: 'Employee ID'
		},
		{
			header: 'Name',
			accessorKey: 'name',
			key: 'name',
			title: 'Name',
			cell: ({ row }) => `${row.original.name} ${row.original.surname}`
		},
		{
			header: 'Email',
			accessorKey: 'email',
			key: 'email',
			title: 'Email'
		},
		{
			header: 'Contact',
			accessorKey: 'contact_no',
			key: 'contact_no',
			title: 'Contact'
		},
		{
			header: 'Department',
			accessorKey: 'department',
			key: 'department',
			title: 'Department',
			cell: ({ row }) => departmentMap[row.original.department || 0] || 'Not Assigned'
		},
		{
			header: 'Designation',
			accessorKey: 'designation',
			key: 'designation',
			title: 'Designation',
			cell: ({ row }) => designationMap[row.original.designation || 0] || 'Not Assigned'
		},
		{
			header: 'Status',
			accessorKey: 'is_active',
			key: 'is_active',
			title: 'Status',
			cell: ({ row }) => (
				<div className="flex items-center justify-center">
					<input
						type="checkbox"
						className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						checked={row.original.is_active === 1}
						onChange={(e) => {
							const isActive = e.target.checked ? 1 : 0;
							console.log('Toggling status for employee:', row.original.id, isActive);
							// TODO: Implement API call to update status
						}}
					/>
				</div>
			)
		},
		{
			header: 'Actions',
			key: 'actions' as keyof Employee,
			accessorKey: 'id',
			title: 'Actions',
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
						onClick={() => {
							console.log('Edit employee:', row.original.id);
							// TODO: Implement edit functionality
						}}
					>
						Edit
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2"
						onClick={() => {
							console.log('View employee:', row.original.id);
							// TODO: Implement view functionality
						}}
					>
						View
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
						onClick={() => {
							console.log('Delete employee:', row.original.id);
							// TODO: Implement delete functionality
						}}
					>
						Delete
					</Button>
				</div>
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
					<Users className="w-5 h-5 mr-2" />
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
						<p className="text-2xl font-bold text-blue-600">{employees.length}</p>
					</div>
				</Card>
				
				<Card className="p-4 flex items-center space-x-4">
					<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
						<Users className="w-6 h-6 text-green-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold">Active</h3>
						<p className="text-2xl font-bold text-green-600">
							{employees.filter(emp => emp.is_active === 1).length}
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
							{new Set(employees.map(emp => emp.department)).size}
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
					<Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
				</div>
			</Card>

			<Card className="p-6">
				<DataTable
					columns={columns}
					data={employees}
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
							<Users className="w-5 h-5 text-gray-400 mr-2" />
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
							<Users className="w-5 h-5 text-gray-400 mr-2" />
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

