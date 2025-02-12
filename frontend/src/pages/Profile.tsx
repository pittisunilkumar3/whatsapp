import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Building2, Phone } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Profile: React.FC = () => {
	const { user } = useAuthStore();

	return (
		<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-xl sm:text-2xl font-bold text-primary-text">Profile Settings</h1>
			</div>

			<Card className="p-4 sm:p-6">
				<div className="space-y-4 sm:space-y-6">
					<div className="flex flex-col sm:flex-row sm:items-center gap-4">
						<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
							<User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
						</div>
						<div>
							<h2 className="text-lg sm:text-xl font-semibold">{user?.name}</h2>
							<p className="text-sm text-secondary-text">{user?.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
						<div className="space-y-4">
							<div>
								<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name</label>
								<Input
									icon={<User className="w-4 h-4" />}
									defaultValue={user?.name}
									disabled
									className="text-sm sm:text-base"
								/>
							</div>
							<div>
								<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
								<Input
									icon={<Mail className="w-4 h-4" />}
									defaultValue={user?.email}
									disabled
									className="text-sm sm:text-base"
								/>
							</div>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Role</label>
								<Input
									icon={<Building2 className="w-4 h-4" />}
									defaultValue={user?.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
									disabled
									className="text-sm sm:text-base"
								/>
							</div>
							<div>
								<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Contact</label>
								<Input
									icon={<Phone className="w-4 h-4" />}
									placeholder="Add phone number"
									className="text-sm sm:text-base"
								/>
							</div>
						</div>
					</div>

					<div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
						<h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Security</h3>
						<Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
							Change Password
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
};