import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Checkbox } from '~/components/ui/Checkbox';
import { Button } from '~/components/ui/Button';
import { NotificationToast } from '~/components/ui/NotificationToast';
import { SaveAll, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '~/store/authStore';

interface Permission {
    can_view: boolean;
    can_add: boolean;
    can_edit: boolean;
    can_delete: boolean;
}

interface MenuItem {
    id: number;
    menu: string;
    icon: string;
    is_active: boolean;
    submenus: SubMenuItem[];
}

interface SubMenuItem {
    id: number;
    menu: string;
    key: string;
    url: string;
    is_active: boolean;
    permissions: Permission;
}

export const EmployeePermissions: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuthStore();
    const companyId = user?.company?.id;
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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

    useEffect(() => {
        const fetchPermissions = async () => {
            if (!companyId) {
                setNotification({
                    type: 'error',
                    message: 'Company ID not found',
                    isVisible: true
                });
                return;
            }
            
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/company-permissions/sidebar-menu-permissions/${id}?company_id=${companyId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch permissions');
                }
                const data = await response.json();
                setMenuItems(data);
                console.log('Fetched permissions:', data);
            } catch (error) {
                console.error('Error fetching permissions:', error);
                setNotification({
                    type: 'error',
                    message: 'Failed to load permissions',
                    isVisible: true
                });
            }
        };

        if (id && companyId) {
            fetchPermissions();
        }
    }, [id, companyId]);

    const handlePermissionChange = (
        moduleIndex: number,
        submenuIndex: number,
        permissionType: keyof Permission,
        checked: boolean
    ) => {
        setMenuItems(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState));
            newState[moduleIndex].submenus[submenuIndex].permissions[permissionType] = checked;
            return newState;
        });
    };

    const handleSave = async () => {
        if (!companyId) {
            setNotification({
                type: 'error',
                message: 'Company ID not found',
                isVisible: true
            });
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/company-permissions/sidebar-menu-permissions/${id}?company_id=${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(menuItems),
            });

            if (!response.ok) throw new Error('Failed to save permissions');

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100/50 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employee Permissions</h1>
                            </div>
                            <p className="text-sm md:text-base text-gray-500">Configure access controls and security settings for your employees</p>
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
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
                                    {menuItems.map((module, moduleIndex) => (
                                        <React.Fragment key={module.id}>
                                            <tr className="bg-gradient-to-r from-gray-50 to-white">
                                                <td colSpan={5} className="px-6 py-4 text-sm font-semibold text-gray-800 border-b border-gray-200">
                                                    {module.menu}
                                                </td>
                                            </tr>
                                            {module.submenus.map((submenu, submenuIndex) => (
                                                <tr
                                                    key={submenu.id}
                                                    className="hover:bg-gray-50 transition-all duration-200 ease-in-out"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-r border-gray-100">
                                                        {submenu.menu}
                                                    </td>
                                                    {['can_view', 'can_add', 'can_edit', 'can_delete'].map((type) => (
                                                        <td key={type} className="px-6 py-4 whitespace-nowrap border-r border-gray-100 text-center">
                                                            <Checkbox
                                                                checked={submenu.permissions[type as keyof Permission]}
                                                                onChange={(checked) => handlePermissionChange(moduleIndex, submenuIndex, type as keyof Permission, checked)}
                                                                className="cursor-pointer hover:scale-110 transition-transform duration-200"
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

                    <div className="flex justify-end pt-6">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    <SaveAll className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
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

export default EmployeePermissions;