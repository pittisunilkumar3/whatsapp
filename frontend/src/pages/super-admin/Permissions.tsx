import React, { useState } from 'react';
import { Card } from '~/components/ui/Card';
import { Checkbox } from '~/components/ui/Checkbox';
import { Button } from '~/components/ui/Button';
import { NotificationToast } from '~/components/ui/NotificationToast';
import { SaveIcon } from 'lucide-react';

interface PermissionRow {
	module: string;
	features: {
		name: string;
		permissions: {
			view: boolean;
			add: boolean;
			edit: boolean;
			delete: boolean;
		};
	}[];
}

const permissionsData: PermissionRow[] = [
	{
		module: 'Student Information',
		features: [
			{
				name: 'Student',
				permissions: { view: true, add: true, edit: true, delete: true }
			},
			{
				name: 'Import Student',
				permissions: { view: true, add: false, edit: false, delete: false }
			},
			{
				name: 'Student Categories',
				permissions: { view: true, add: true, edit: true, delete: true }
			},
			{
				name: 'Student Houses',
				permissions: { view: true, add: true, edit: true, delete: true }
			},
			{
				name: 'Disable Student',
				permissions: { view: true, add: false, edit: false, delete: false }
			},
			{
				name: 'Student Timeline',
				permissions: { view: true, add: true, edit: true, delete: true }
			},
			{
				name: 'Disable Reason',
				permissions: { view: true, add: true, edit: true, delete: true }
			}
		]
	},
	{
		module: 'Fees Collection',
		features: [
			{
				name: 'Collect Fees',
				permissions: { view: true, add: true, edit: false, delete: true }
			},
			{
				name: 'Fees Carry Forward',
				permissions: { view: true, add: false, edit: false, delete: false }
			},
			{
				name: 'Fees Master',
				permissions: { view: true, add: true, edit: true, delete: true }
			},
			{
				name: 'Fees Group',
				permissions: { view: true, add: true, edit: true, delete: true }
			},
			{
				name: 'Fees Group Assign',
				permissions: { view: true, add: false, edit: false, delete: false }
			},
			{
				name: 'Fees Type',
				permissions: { view: true, add: true, edit: true, delete: true }
			},
			{
				name: 'Fees Discount',
				permissions: { view: true, add: true, edit: true, delete: true }
			},
			{
				name: 'Fees Discount Assign',
				permissions: { view: true, add: false, edit: false, delete: false }
			},
			{
				name: 'Search Fees Payment',
				permissions: { view: true, add: false, edit: false, delete: false }
			},
			{
				name: 'Search Due Fees',
				permissions: { view: true, add: false, edit: false, delete: false }
			},
			{
				name: 'Fees Reminder',
				permissions: { view: true, add: false, edit: true, delete: false }
			}
		]
	}
];

export const Permissions: React.FC = () => {
	const [permissions, setPermissions] = useState(permissionsData);
	const [isSaving, setIsSaving] = useState(false);
	const [notification, setNotification] = useState<{
		type: 'success' | 'error';
		message: string;
		isVisible: boolean;
	}>({
		type: 'success',
		message: '',
		isVisible: false
	});

	const handleSave = async () => {
		setIsSaving(true);
		try {
			// TODO: Implement API call to save permissions
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
			console.log('Saving permissions:', permissions);
			setNotification({
				type: 'success',
				message: 'Permissions saved successfully',
				isVisible: true
			});
		} catch (error) {
			console.error('Failed to save permissions:', error);
			setNotification({
				type: 'error',
				message: 'Failed to save permissions. Please try again.',
				isVisible: true
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handlePermissionChange = (
		moduleIndex: number,
		featureIndex: number,
		permissionType: 'view' | 'add' | 'edit' | 'delete',
		checked: boolean
	) => {
		setPermissions(prevState => {
			// Create a deep copy of the state
			const newState = JSON.parse(JSON.stringify(prevState));
			// Update the specific permission
			newState[moduleIndex].features[featureIndex].permissions[permissionType] = checked;
			return newState;
		});
	};





	return (
		<div className="p-6 space-y-8 max-w-7xl mx-auto bg-gray-50">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Permissions Management</h1>
				<p className="text-gray-500 text-sm md:text-base">Configure access controls for different modules and features</p>
			</div>

			<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 table-auto w-full">
						<thead className="bg-gray-50">
							<tr className="text-left">
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3 border-b border-gray-200 sm:text-sm">
									Feature
								</th>
								{['View', 'Add', 'Edit', 'Delete'].map(header => (
									<th key={header} className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[12%] border-b border-gray-200 sm:text-sm">
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{permissions.map((row, moduleIndex) => (
								<React.Fragment key={moduleIndex}>
									<tr className="bg-gray-100">
										<td colSpan={5} className="px-6 py-3 text-sm font-semibold text-gray-800 border-b-2 border-gray-300">
											{row.module}
										</td>
									</tr>
									{row.features.map((feature, featureIndex) => (
										<tr key={`${moduleIndex}-${featureIndex}`} className="hover:bg-gray-50 transition-colors duration-150">
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-r border-gray-200">
												{feature.name}
											</td>
											{['view', 'add', 'edit', 'delete'].map((type) => (
												<td key={type} className="px-6 py-4 whitespace-nowrap border-r border-gray-200 text-center">
													<Checkbox
														checked={feature.permissions[type as keyof typeof feature.permissions]}
														onChange={(checked) => handlePermissionChange(moduleIndex, featureIndex, type as 'view' | 'add' | 'edit' | 'delete', checked)}
														className="cursor-pointer"
													/>
												</td>
											))}
										</tr>
									))}
								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			</div>

			
			<div className="flex justify-end pt-4">
				<Button 
					type="button" 
					className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md flex items-center gap-2"
					onClick={handleSave}
					disabled={isSaving}
				>
					{isSaving ? (
						<>
							<span>Saving...</span>
							<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</>
					) : (
						<>
							<span>Save Changes</span>
							<SaveIcon className="h-5 w-5" />
						</>
					)}
				</Button>
			</div>
			<NotificationToast
				type={notification.type}
				message={notification.message}
				isVisible={notification.isVisible}
				onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
			/>
		</div>
	);
};