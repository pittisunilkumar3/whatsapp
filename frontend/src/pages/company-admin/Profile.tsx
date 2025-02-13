import React from 'react';
import { useAuthStore } from '~/store/authStore';
import { Card } from '~/components/ui/Card';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Building2, Mail, Phone, Globe, MapPin, User, Calendar } from 'lucide-react';

export const CompanyAdminProfile: React.FC = () => {
	const { user } = useAuthStore();
	const company = user?.company;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Company Profile</h1>
			
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">Company Information</h2>
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<Building2 className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Company Name</p>
								<p className="font-medium">{company?.company_name}</p>
							</div>
						</div>
						
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<Globe className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Website</p>
								<p className="font-medium">{company?.website}</p>
							</div>
						</div>
						
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<MapPin className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Location</p>
								<p className="font-medium">
									{company?.city}, {company?.state}, {company?.country}
								</p>
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">Contact Information</h2>
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<User className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Contact Person</p>
								<p className="font-medium">{company?.contact_person_name}</p>
							</div>
						</div>
						
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<Mail className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Email</p>
								<p className="font-medium">{company?.contact_person_email}</p>
							</div>
						</div>
						
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<Phone className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Phone</p>
								<p className="font-medium">{company?.contact_person_phone}</p>
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6 lg:col-span-2">
					<h2 className="text-xl font-semibold mb-4">Update Company Information</h2>
					<form className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
							<Input defaultValue={company?.company_name} />
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
							<Input defaultValue={company?.website} />
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
							<Input defaultValue={company?.contact_person_name} />
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
							<Input defaultValue={company?.contact_person_email} />
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
							<Input defaultValue={company?.contact_person_phone} />
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
							<Input defaultValue={company?.contact_person_position} />
						</div>
						
						<div className="md:col-span-2">
							<Button type="submit" className="w-full">
								Update Company Profile
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};