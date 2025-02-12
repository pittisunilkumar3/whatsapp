import React from 'react';
import { Building2, Users2, CreditCard, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusPill } from '../ui/StatusPill';

interface Company {
	id: string;
	name: string;
	status: 'active' | 'inactive' | 'warning';
	employees: number;
	plan: string;
	lastBilling: string;
}

const mockCompanies: Company[] = [
	{
		id: '1',
		name: 'Tech Corp Inc.',
		status: 'active',
		employees: 150,
		plan: 'Enterprise',
		lastBilling: '2024-02-01',
	},
	{
		id: '2',
		name: 'Digital Solutions Ltd',
		status: 'warning',
		employees: 45,
		plan: 'Professional',
		lastBilling: '2024-02-10',
	},
	{
		id: '3',
		name: 'Innovate AI',
		status: 'active',
		employees: 75,
		plan: 'Business',
		lastBilling: '2024-02-05',
	}
];

export const CompanyOverview: React.FC = () => {
	return (
		<Card className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg font-semibold">Company Overview</h2>
				<Button>Add Company</Button>
			</div>

			<div className="space-y-4">
				{mockCompanies.map((company) => (
					<div key={company.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
						<div className="flex items-center space-x-4">
							<div className="p-2 rounded-lg bg-whatsapp-green bg-opacity-10">
								<Building2 className="w-5 h-5 text-whatsapp-green" />
							</div>
							<div>
								<h3 className="font-medium">{company.name}</h3>
								<div className="flex items-center space-x-4 mt-1 text-sm text-secondary-text">
									<div className="flex items-center">
										<Users2 className="w-4 h-4 mr-1" />
										{company.employees} users
									</div>
									<div className="flex items-center">
										<CreditCard className="w-4 h-4 mr-1" />
										{company.plan}
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<StatusPill status={company.status} />
							{company.status === 'warning' && (
								<AlertTriangle className="w-5 h-5 text-yellow-500" />
							)}
							<Button variant="ghost" size="sm">Manage</Button>
						</div>
					</div>
				))}
			</div>
			<div className="mt-4 text-center">
				<Button variant="ghost">View All Companies</Button>
			</div>
		</Card>
	);
};