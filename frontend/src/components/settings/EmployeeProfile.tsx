import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { User, Bell, Mail, Phone } from 'lucide-react';

interface NotificationPreference {
	email: boolean;
	inApp: boolean;
	push: boolean;
}

interface ProfileData {
	name: string;
	email: string;
	phone: string;
	avatar?: File;
	notifications: NotificationPreference;
}

export const EmployeeProfile: React.FC = () => {
	const [profile, setProfile] = useState<ProfileData>({
		name: 'John Smith',
		email: 'john@example.com',
		phone: '+1 (555) 123-4567',
		notifications: {
			email: true,
			inApp: true,
			push: false
		}
	});

	const [avatarPreview, setAvatarPreview] = useState<string>('');

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setProfile(prev => ({ ...prev, avatar: file }));
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-6">Profile Information</h2>
				<div className="flex items-start space-x-6">
					<div className="flex-shrink-0">
						<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
							{avatarPreview ? (
								<img
									src={avatarPreview}
									alt="Profile"
									className="w-full h-full object-cover"
								/>
							) : (
								<User className="w-12 h-12 text-gray-400" />
							)}
						</div>
						<Button
							as="label"
							variant="ghost"
							className="mt-2 w-full cursor-pointer"
						>
							Change Photo
							<input
								type="file"
								className="hidden"
								accept="image/*"
								onChange={handleAvatarChange}
							/>
						</Button>
					</div>

					<div className="flex-1 space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Full Name
							</label>
							<Input
								value={profile.name}
								onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<Input
								type="email"
								value={profile.email}
								onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Phone
							</label>
							<Input
								value={profile.phone}
								onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
							/>
						</div>
					</div>
				</div>
			</Card>

			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Mail className="w-5 h-5 text-gray-400" />
							<div>
								<p className="font-medium">Email Notifications</p>
								<p className="text-sm text-secondary-text">
									Receive updates via email
								</p>
							</div>
						</div>
						<Switch
							checked={profile.notifications.email}
							onChange={(checked) => setProfile(prev => ({
								...prev,
								notifications: { ...prev.notifications, email: checked }
							}))}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Bell className="w-5 h-5 text-gray-400" />
							<div>
								<p className="font-medium">In-App Notifications</p>
								<p className="text-sm text-secondary-text">
									Receive notifications within the app
								</p>
							</div>
						</div>
						<Switch
							checked={profile.notifications.inApp}
							onChange={(checked) => setProfile(prev => ({
								...prev,
								notifications: { ...prev.notifications, inApp: checked }
							}))}
						/>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Phone className="w-5 h-5 text-gray-400" />
							<div>
								<p className="font-medium">Push Notifications</p>
								<p className="text-sm text-secondary-text">
									Receive push notifications on your device
								</p>
							</div>
						</div>
						<Switch
							checked={profile.notifications.push}
							onChange={(checked) => setProfile(prev => ({
								...prev,
								notifications: { ...prev.notifications, push: checked }
							}))}
						/>
					</div>
				</div>
			</Card>

			<div className="flex justify-end space-x-3">
				<Button variant="ghost">Cancel</Button>
				<Button>Save Changes</Button>
			</div>
		</div>
	);
};