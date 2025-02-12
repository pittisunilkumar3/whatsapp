import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Switch } from '../../components/ui/Switch';
import { Shield, Users, Settings, MessageSquare, BarChart2, Building, Plus, Edit2, Save, X, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Permission {
    id: string;
    name: string;
    description: string;
    roles: Array<'super_admin' | 'company_admin' | 'employee'>;
}

interface Role {
    name: string;
    icon: any;
    description: string;
    color: string;
    permissions?: string[];
}

const permissions: Permission[] = [
    {
        id: 'manage_companies',
        name: 'Manage Companies',
        description: 'Create, edit, and delete company accounts',
        roles: ['super_admin']
    },
    {
        id: 'manage_users',
        name: 'Manage Users',
        description: 'Create and manage user accounts',
        roles: ['super_admin', 'company_admin']
    },
    {
        id: 'view_analytics',
        name: 'View Analytics',
        description: 'Access analytics and reporting',
        roles: ['super_admin', 'company_admin', 'employee']
    },
    {
        id: 'manage_campaigns',
        name: 'Manage Campaigns',
        description: 'Create and manage communication campaigns',
        roles: ['company_admin', 'employee']
    }
];

const roles: Role[] = [
    {
        name: 'Super Admin',
        icon: Shield,
        description: 'Full system access and management',
        color: 'text-purple-600',
        permissions: ['manage_companies', 'manage_users', 'view_analytics']
    },
    {
        name: 'Company Admin',
        icon: Building,
        description: 'Company-level management and settings',
        color: 'text-blue-600',
        permissions: ['manage_users', 'view_analytics', 'manage_campaigns']
    },
    {
        name: 'Employee',
        icon: Users,
        description: 'Regular user access and operations',
        color: 'text-green-600',
        permissions: ['view_analytics', 'manage_campaigns']
    }
];

interface NewRole {
    name: string;
    description: string;
    permissions: string[];
}

export const RolePermissions: React.FC = () => {
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [showEditRoleModal, setShowEditRoleModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [editedPermissions, setEditedPermissions] = useState<string[]>([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [newRole, setNewRole] = useState<NewRole>({
        name: '',
        description: '',
        permissions: []
    });

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setEditedPermissions(role.permissions || []);
        setShowEditRoleModal(true);
    };

    const handleSavePermissions = () => {
        // Here you would typically make an API call to save the changes
        if (selectedRole) {
            // Update the role's permissions in your state/backend
            console.log('Saving permissions for role:', selectedRole.name, editedPermissions);
        }
        setShowEditRoleModal(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleAddNewRole = () => {
        // Here you would typically make an API call to create a new role
        console.log('Creating new role:', newRole);
        setShowAddRoleModal(false);
        setNewRole({ name: '', description: '', permissions: [] });
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px] mx-auto"
        >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Role & Permissions
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                        Manage system roles and their permissions
                    </p>
                </div>
                <Button 
                    onClick={() => setShowAddRoleModal(true)}
                    className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Role
                </Button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {roles.map((role) => (
                    <motion.div
                        key={role.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className={`p-2 rounded-lg ${role.color} bg-opacity-10`}>
                                    <role.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${role.color}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">{role.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">{role.description}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                {role.permissions?.map((permId) => {
                                    const perm = permissions.find(p => p.id === permId);
                                    return perm && (
                                        <div key={permId} className="flex items-center text-xs sm:text-sm text-gray-600">
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                                            {perm.name}
                                        </div>
                                    );
                                })}
                            </div>

                            <Button 
                                variant="outline"
                                onClick={() => handleEditRole(role)}
                                className="w-full mt-2 text-sm border-gray-200 hover:bg-gray-50"
                            >
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                Edit Permissions
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Permission Matrix */}
            <Card className="p-4 sm:p-6 mt-6 sm:mt-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 sm:mb-6">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Permission Matrix</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Overview of all permissions and their assignments</p>
                    </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {permissions.map((permission) => (
                        <motion.div
                            key={permission.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-sm sm:text-base text-gray-900">{permission.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{permission.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                                {permission.roles.map((role) => (
                                    <span
                                        key={role}
                                        className="px-2 sm:px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-xs sm:text-sm font-medium"
                                    >
                                        {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>

            {/* Add Role Modal */}
            <Modal
                isOpen={showAddRoleModal}
                onClose={() => setShowAddRoleModal(false)}
                title="Add New Role"
            >
                <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                        <Input
                            value={newRole.name}
                            onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter role name"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Input
                            value={newRole.description}
                            onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter role description"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                        {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                                <div>
                                    <h4 className="font-medium text-gray-900">{permission.name}</h4>
                                    <p className="text-sm text-gray-500">{permission.description}</p>
                                </div>
                                <Switch
                                    checked={newRole.permissions.includes(permission.id)}
                                    onChange={(checked) => {
                                        setNewRole(prev => ({
                                            ...prev,
                                            permissions: checked
                                                ? [...prev.permissions, permission.id]
                                                : prev.permissions.filter(id => id !== permission.id)
                                        }));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setShowAddRoleModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddNewRole}
                            className="bg-primary text-white"
                            disabled={!newRole.name || !newRole.description}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Create Role
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Role Modal */}
            <Modal
                isOpen={showEditRoleModal}
                onClose={() => setShowEditRoleModal(false)}
                title={`Edit ${selectedRole?.name} Permissions`}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Select the permissions you want to grant to this role.
                    </p>
                    
                    {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">{permission.name}</h4>
                                <p className="text-sm text-gray-500">{permission.description}</p>
                            </div>
                            <Switch
                                checked={editedPermissions.includes(permission.id)}
                                onChange={(checked) => {
                                    setEditedPermissions(prev => 
                                        checked
                                            ? [...prev, permission.id]
                                            : prev.filter(id => id !== permission.id)
                                    );
                                }}
                            />
                        </div>
                    ))}

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setShowEditRoleModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSavePermissions}
                            className="bg-primary text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Changes saved successfully!
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};