import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusPill } from '../../components/ui/StatusPill';
import { 
	Users,
	Plus,
	Search,
	Mail,
	Phone,
	MoreVertical,
	Edit,
	Trash2
} from 'lucide-react';

interface Employee {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	status: 'active' | 'inactive';
	lastActive: string;
	performance: {
		responseRate: number;
		conversionRate: number;
		avgResponseTime: string;
	};
}

const mockEmployees: Employee[] = [
	{
		id: '1',
		name: 'John Smith',
		email: 'john@example.com',
		phone: '+1 234 567 8900',
		role: 'Sales Representative',
		status: 'active',
		lastActive: '2024-02-15T10:30:00Z',
		performance: {
			responseRate: 92,
			conversionRate: 28,
			avgResponseTime: '15m',
		}
	},
	{
		id: '2',
		name: 'Sarah Johnson',
		email: 'sarah@example.com',
		phone: '+1 234 567 8901',
		role: 'Sales Manager',
		status: 'active',
		lastActive: '2024-02-15T09:45:00Z',
		performance: {
			responseRate: 95,
			conversionRate: 32,
			avgResponseTime: '12m',
		}
	},
];

export const Employees: React.FC = () => {
	return (
		<div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-semibold text-primary-text">Employees</h1>
					<p className="text-sm text-secondary-text mt-1">
						Manage your team members and their access
					</p>
				</div>
				<Button className="w-full sm:w-auto touch-manipulation">
					<Plus className="w-5 h-5 mr-2" />
					Add Employee
				</Button>
			</div>

			<Card className="p-3 sm:p-4">
				<div className="flex flex-col sm:flex-row gap-3 sm:items-center">
					<div className="relative flex-1">
						<Input
							placeholder="Search employees..."
							className="pl-10 w-full"
						/>
						<Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
					</div>
					<div className="flex space-x-2">
						<Button variant="ghost" className="flex-1 sm:flex-initial touch-manipulation">
							Active
						</Button>
						<Button variant="ghost" className="flex-1 sm:flex-initial touch-manipulation">
							Inactive
						</Button>
					</div>
				</div>
			</Card>

			<div className="space-y-4">
				{mockEmployees.map((employee) => (
					<Card key={employee.id} className="p-4 sm:p-6">
						<div className="flex flex-col space-y-4">
							<div className="flex items-start justify-between">
								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 rounded-full bg-whatsapp-green text-white flex items-center justify-center flex-shrink-0">
										{employee.name.charAt(0)}
									</div>
									<div>
										<h3 className="font-semibold">{employee.name}</h3>
										<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4 mt-1">
											<StatusPill status={employee.status} />
											<div className="flex items-center text-sm text-secondary-text">
												<Mail className="w-4 h-4 mr-1 flex-shrink-0" />
												<span className="truncate">{employee.email}</span>
											</div>
											<div className="flex items-center text-sm text-secondary-text">
												<Phone className="w-4 h-4 mr-1 flex-shrink-0" />
												{employee.phone}
											</div>
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Button variant="ghost" size="sm" className="p-2 touch-manipulation">
										<Edit className="w-5 h-5" />
									</Button>
									<Button variant="ghost" size="sm" className="p-2 touch-manipulation">
										<MoreVertical className="w-5 h-5" />
									</Button>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-4 sm:gap-8 pt-2 border-t">
								<div className="text-center">
									<div className="text-lg sm:text-2xl font-semibold">{employee.performance.responseRate}%</div>
									<div className="text-xs sm:text-sm text-secondary-text">Response Rate</div>
								</div>
								<div className="text-center">
									<div className="text-lg sm:text-2xl font-semibold">{employee.performance.conversionRate}%</div>
									<div className="text-xs sm:text-sm text-secondary-text">Conversion</div>
								</div>
								<div className="text-center">
									<div className="text-lg sm:text-2xl font-semibold">{employee.performance.avgResponseTime}</div>
									<div className="text-xs sm:text-sm text-secondary-text">Avg Response</div>
								</div>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};
