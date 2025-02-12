import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusPill } from '../../components/ui/StatusPill';
import { Dropdown } from '../../components/ui/Dropdown';
import { Modal } from '../../components/ui/Modal';
import { 
    Building2,
    PlusCircle,
    SearchIcon,
    Users,
    Settings2,
    MoreVertical,
    FilterIcon,
    Download,
    Trash,
    PencilIcon,
    XIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

interface Company {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    employees: number;
    plan: string;
    lastActive: string;
    industry: string;
    location: string;
    contactPerson: string;
    email: string;
    phone: string;
    subscriptionStart: string;
    subscriptionEnd: string;
    usage: {
        messages: number;
        storage: number;
        api_calls: number;
    };
}

const mockCompanies: Company[] = [
    {
        id: '1',
        name: 'Acme Corporation',
        status: 'active',
        employees: 25,
        plan: 'Enterprise',
        lastActive: '2024-02-15T10:30:00Z',
        industry: 'Technology',
        location: 'New York, USA',
        contactPerson: 'John Smith',
        email: 'john@acme.com',
        phone: '+1 234 567 8900',
        subscriptionStart: '2023-01-01',
        subscriptionEnd: '2024-12-31',
        usage: {
            messages: 25000,
            storage: 50,
            api_calls: 15000
        }
    },
    {
        id: '2',
        name: 'TechStart Inc',
        status: 'active',
        employees: 12,
        plan: 'Professional',
        lastActive: '2024-02-15T09:45:00Z',
        industry: 'Software',
        location: 'San Francisco, USA',
        contactPerson: 'Sarah Johnson',
        email: 'sarah@techstart.com',
        phone: '+1 234 567 8901',
        subscriptionStart: '2023-06-01',
        subscriptionEnd: '2024-05-31',
        usage: {
            messages: 12000,
            storage: 25,
            api_calls: 8000
        }
    },
];

export const Companies: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [companies, setCompanies] = useState<Company[]>(mockCompanies);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [planFilter, setPlanFilter] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [newCompany, setNewCompany] = useState<Partial<Company>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('Companies Page - User:', user);
        console.log('Companies Page - Is Authenticated:', isAuthenticated);
        
        if (!isAuthenticated) {
            setError('Not authenticated. Please log in.');
        }
    }, [user, isAuthenticated]);

    const ITEMS_PER_PAGE = 5;

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handlePlanFilter = (plan: string) => {
        setPlanFilter(plan);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const filteredCompanies = useMemo(() => {
        return companies.filter(company => {
            const searchMatch = searchTerm.toLowerCase().trim() === '' ||
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.industry.toLowerCase().includes(searchTerm.toLowerCase());
        
            const statusMatch = statusFilter === 'all' ||
                company.status.toLowerCase() === statusFilter.toLowerCase();
        
            const planMatch = planFilter === 'all' ||
                company.plan === planFilter;
        
            return searchMatch && statusMatch && planMatch;
        });
    }, [companies, searchTerm, statusFilter, planFilter]);

    const paginatedCompanies = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCompanies, currentPage]);

    const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);

    const handleAddCompany = () => {
        // Form validation
        const requiredFields = [
            'name',
            'industry',
            'location',
            'contactPerson',
            'email',
            'phone'
        ];

        const missingFields = requiredFields.filter(
            field => !newCompany[field as keyof typeof newCompany]
        );

        if (missingFields.length > 0) {
            alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newCompany.email || '')) {
            alert('Please enter a valid email address');
            return;
        }

        // Phone validation
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(newCompany.phone || '')) {
            alert('Please enter a valid phone number');
            return;
        }

        const company: Company = {
            id: (companies.length + 1).toString(),
            name: newCompany.name!,
            status: 'active',
            employees: 0,
            plan: newCompany.plan || 'Enterprise',
            lastActive: new Date().toISOString(),
            industry: newCompany.industry!,
            location: newCompany.location!,
            contactPerson: newCompany.contactPerson!,
            email: newCompany.email!,
            phone: newCompany.phone!,
            subscriptionStart: new Date().toISOString().split('T')[0],
            subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            usage: {
                messages: 0,
                storage: 0,
                api_calls: 0
            }
        };

        setCompanies([...companies, company]);
        setNewCompany({});
        setShowAddModal(false);
    };

    const handleDeleteCompany = () => {
        if (selectedCompany) {
            setCompanies(companies.filter(c => c.id !== selectedCompany.id));
            setShowDeleteModal(false);
            setSelectedCompany(null);
        }
    };

    const handleExport = () => {
        // Implement export logic
        console.log('Exporting companies data...');
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1400px] mx-auto"
        >
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Companies
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                        Manage and monitor all companies in your system
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs sm:text-sm text-gray-600">{filteredCompanies.filter(c => c.status === 'active').length} Active</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-xs sm:text-sm text-gray-600">{filteredCompanies.filter(c => c.status === 'pending').length} Pending</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-xs sm:text-sm text-gray-600">{filteredCompanies.filter(c => c.status === 'suspended').length} Suspended</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button 
                        variant="secondary" 
                        onClick={handleExport}
                        className="w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-200"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>
                    <Button 
                        onClick={() => setShowAddModal(true)}
                        className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Company
                    </Button>
                </div>
            </div>

            {/* Filters Section */}
            <Card className="p-4 bg-white shadow-sm border border-gray-100">
                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        <div className="relative">
                            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <Input
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search companies..."
                                className="pl-10 w-full h-10 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative min-w-[160px]">
                            <Dropdown
                                value={statusFilter}
                                onChange={handleStatusFilter}
                                options={[
                                    { label: 'All Status', value: 'all' },
                                    { label: 'Active', value: 'active' },
                                    { label: 'Inactive', value: 'inactive' },
                                    { label: 'Pending', value: 'pending' },
                                    { label: 'Suspended', value: 'suspended' }
                                ]}
                                className="w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary text-gray-900 text-sm"
                            />
                        </div>
                        <div className="relative min-w-[160px]">
                            <Dropdown
                                value={planFilter}
                                onChange={handlePlanFilter}
                                options={[
                                    { label: 'All Plans', value: 'all' },
                                    { label: 'Enterprise', value: 'Enterprise' },
                                    { label: 'Professional', value: 'Professional' },
                                    { label: 'Startup', value: 'Startup' }
                                ]}
                                className="w-full h-10 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:ring-primary text-gray-900 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Error Message */}
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                    <div className="flex items-center gap-2 text-red-700">
                        <XIcon className="w-5 h-5" />
                        <span className="font-medium">{error}</span>
                    </div>
                </motion.div>
            )}

            {/* Companies List */}
            <AnimatePresence>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {paginatedCompanies.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No companies found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            paginatedCompanies.map((company, index) => (
                                <motion.div
                                    key={company.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 ease-in-out bg-white border border-gray-100">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 rounded-xl bg-primary bg-opacity-10 flex-shrink-0">
                                                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                                    </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                                        <StatusPill status={company.status} />
                                                        <span className="text-sm text-gray-600">
                                                            {company.industry}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {company.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                            <div className="flex items-center gap-8">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                            <span className="font-semibold text-gray-900">{company.employees}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">Employees</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-semibold text-gray-900">{company.plan}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Plan</div>
                                                    </div>
                                                    <div className="text-center hidden md:block">
                                                        <div className="font-semibold text-gray-900">
                                                            {format(new Date(company.lastActive), 'MMM d, yyyy')}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">Last Active</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedCompany(company);
                                                            setShowDetailsModal(true);
                                                        }}
                                                        className="hover:bg-gray-100"
                                                    >
                                                        <Settings2 className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedCompany(company);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="hover:bg-red-50"
                                                    >
                                                        <Trash className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 sm:mt-8">
                    <Button 
                        variant="outline" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="bg-white"
                    >
                        <ChevronLeftIcon className="w-4 h-4 mr-2" />
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                                    currentPage === page
                                        ? 'bg-primary text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <Button 
                        variant="outline" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="bg-white"
                    >
                        Next
                        <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}

            {/* Modals */}
            <Modal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setNewCompany({});
                }}
                title="Add New Company"
            >
                <div className="space-y-6 p-4">
                    <Input
                        label="Company Name"
                        placeholder="Enter company name"
                        value={newCompany.name || ''}
                        onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    />
                    <Input
                        label="Industry"
                        placeholder="Enter industry"
                        value={newCompany.industry || ''}
                        onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    />
                    <Input
                        label="Location"
                        placeholder="Enter location"
                        value={newCompany.location || ''}
                        onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                    />
                    <Input
                        label="Contact Person"
                        placeholder="Enter contact person name"
                        value={newCompany.contactPerson || ''}
                        onChange={(e) => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        value={newCompany.email || ''}
                        onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    />
                    <Input
                        label="Phone"
                        placeholder="Enter phone number"
                        value={newCompany.phone || ''}
                        onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                    />
                    <Dropdown
                        label="Plan"
                        value={newCompany.plan || 'Enterprise'}
                        onChange={(value) => setNewCompany({ ...newCompany, plan: value })}
                        options={[
                            { label: 'Enterprise', value: 'Enterprise' },
                            { label: 'Professional', value: 'Professional' },
                            { label: 'Startup', value: 'Startup' }
                        ]}
                        className="min-w-full"
                    />
                    <div className="flex justify-end space-x-4 mt-8">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowAddModal(false);
                                setNewCompany({});
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAddCompany}>
                            Add Company
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Company"
            >
                <div className="space-y-4">
                    <p>Are you sure you want to delete {selectedCompany?.name}? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteCompany}>
                            Delete Company
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title="Company Details"
            >
                {selectedCompany && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-secondary-text">Contact Person</h4>
                                <p>{selectedCompany.contactPerson}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-secondary-text">Email</h4>
                                <p>{selectedCompany.email}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-secondary-text">Phone</h4>
                                <p>{selectedCompany.phone}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-secondary-text">Location</h4>
                                <p>{selectedCompany.location}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-3">Subscription Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-secondary-text">Plan</h4>
                                    <p>{selectedCompany.plan}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-secondary-text">Status</h4>
                                    <StatusPill status={selectedCompany.status} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-secondary-text">Start Date</h4>
                                    <p>{format(new Date(selectedCompany.subscriptionStart), 'MMM d, yyyy')}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-secondary-text">End Date</h4>
                                    <p>{format(new Date(selectedCompany.subscriptionEnd), 'MMM d, yyyy')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-3">Usage Statistics</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-secondary-text">Messages</h4>
                                    <p>{selectedCompany.usage.messages.toLocaleString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-secondary-text">Storage (GB)</h4>
                                    <p>{selectedCompany.usage.storage}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-secondary-text">API Calls</h4>
                                    <p>{selectedCompany.usage.api_calls.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                                Close
                            </Button>
                            <Button>
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit Company
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};