import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Building, Mail, Phone, Globe, Upload } from 'lucide-react';

interface CompanyDetails {
	name: string;
	industry: string;
	email: string;
	phone: string;
	website: string;
	address: string;
	logo?: File;
}

export const CompanyProfile: React.FC = () => {
	const [details, setDetails] = useState<CompanyDetails>({
		name: 'Tech Corp Inc.',
		industry: 'Technology',
		email: 'contact@techcorp.com',
		phone: '+1 (555) 123-4567',
		website: 'www.techcorp.com',
		address: '123 Tech Street, Silicon Valley, CA 94025'
	});

	const [logoPreview, setLogoPreview] = useState<string>('');

	const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setDetails(prev => ({ ...prev, logo: file }));
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-6">Company Information</h2>
				<div className="grid grid-cols-2 gap-6">
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Company Name
							</label>
							<Input
								icon={<Building className="w-5 h-5" />}
								value={details.name}
								onChange={(e) => setDetails(prev => ({ ...prev, name: e.target.value }))}
								placeholder="Enter company name"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Industry
							</label>
							<Input
								value={details.industry}
								onChange={(e) => setDetails(prev => ({ ...prev, industry: e.target.value }))}
								placeholder="Enter industry"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<Input
								icon={<Mail className="w-5 h-5" />}
								type="email"
								value={details.email}
								onChange={(e) => setDetails(prev => ({ ...prev, email: e.target.value }))}
								placeholder="Enter email"
							/>
						</div>
					</div>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Phone
							</label>
							<Input
								icon={<Phone className="w-5 h-5" />}
								value={details.phone}
								onChange={(e) => setDetails(prev => ({ ...prev, phone: e.target.value }))}
								placeholder="Enter phone number"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Website
							</label>
							<Input
								icon={<Globe className="w-5 h-5" />}
								value={details.website}
								onChange={(e) => setDetails(prev => ({ ...prev, website: e.target.value }))}
								placeholder="Enter website URL"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Address
							</label>
							<Input
								value={details.address}
								onChange={(e) => setDetails(prev => ({ ...prev, address: e.target.value }))}
								placeholder="Enter address"
							/>
						</div>
					</div>
				</div>
			</Card>

			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-6">Company Logo</h2>
				<div className="flex items-center space-x-6">
					<div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
						{logoPreview ? (
							<img
								src={logoPreview}
								alt="Company logo"
								className="w-full h-full object-contain"
							/>
						) : (
							<Building className="w-12 h-12 text-gray-400" />
						)}
					</div>
					<div>
						<Button as="label" className="cursor-pointer">
							<Upload className="w-4 h-4 mr-2" />
							Upload Logo
							<input
								type="file"
								className="hidden"
								accept="image/*"
								onChange={handleLogoChange}
							/>
						</Button>
						<p className="text-sm text-secondary-text mt-2">
							Recommended: 400x400px or larger, PNG or JPG
						</p>
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