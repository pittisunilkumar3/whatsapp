import React from 'react';
import { useAuthStore } from '~/store/authStore';
import { Card } from '~/components/ui/Card';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { User, Mail, Phone, Calendar } from 'lucide-react';

export const SuperAdminProfile: React.FC = () => {
	const { user } = useAuthStore();

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
			
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">Personal Information</h2>
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<User className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Full Name</p>
								<p className="font-medium">{user?.first_name} {user?.last_name}</p>
							</div>
						</div>
						
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<Mail className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Email</p>
								<p className="font-medium">{user?.email}</p>
							</div>
						</div>
						
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<Phone className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Phone</p>
								<p className="font-medium">{user?.phone_number}</p>
							</div>
						</div>

						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
								<Calendar className="w-6 h-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Last Login</p>
								<p className="font-medium">{new Date(user?.last_login || '').toLocaleString()}</p>
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<h2 className="text-xl font-semibold mb-4">Update Profile</h2>
					<form className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
							<Input defaultValue={user?.first_name} />
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
							<Input defaultValue={user?.last_name} />
						</div>
						
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
							<Input defaultValue={user?.phone_number} />
						</div>
						
						<Button type="submit" className="w-full">
							Update Profile
						</Button>
					</form>
				</Card>
			</div>
		</div>
	);
};