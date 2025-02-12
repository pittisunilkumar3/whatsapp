import React, { useState, useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { 
	Search, Download, Filter, AlertCircle, Settings,
	UserPlus, Edit, Trash2, ChevronLeft, ChevronRight,
	Calendar, RefreshCw, DollarSign, Database, UserCog,
	Shield
} from 'lucide-react';
import { format, subDays } from 'date-fns';


const getRelativeDate = (daysAgo: number) => {
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	return date.toISOString();
};

interface AuditLog {
	id: string;
	action: string;
	user: {
		first_name: string;
		last_name: string;
		email: string;
		role: string;
	};
	resource: string;
	details: string;
	timestamp: string;
	severity: 'info' | 'warning' | 'error';
	ipAddress?: string;
	userAgent?: string;
	changes?: {
		before: Record<string, any>;
		after: Record<string, any>;
	};
}

// Extended mock data
const mockLogs: AuditLog[] = [
	{
		id: '1',
		action: 'Company Created',
		user: {
			first_name: 'John',
			last_name: 'Admin',
			email: 'john@example.com',
			role: 'Super Admin'
		},
		resource: 'Companies',
		details: 'Created new company: Acme Corporation',
		timestamp: getRelativeDate(0), // Today
		severity: 'info',
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Macintosh)',
		changes: {
			before: {},
			after: { name: 'Acme Corporation', status: 'active', plan: 'enterprise' }
		}
	},
	{
		id: '2',
		action: 'API Key Updated',
		user: {
			first_name: 'Sarah',
			last_name: 'Admin',
			email: 'sarah@example.com',
			role: 'Super Admin'
		},
		resource: 'System Settings',
		details: 'Updated WhatsApp Business API key for security rotation',
		timestamp: getRelativeDate(1), // Yesterday
		severity: 'warning',
		ipAddress: '192.168.1.101',
		userAgent: 'Chrome/121.0.0.0'
	},
	{
		id: '3',
		action: 'User Login Failed',
		user: {
			first_name: 'Unknown',
			last_name: 'User',
			email: 'suspicious@example.com',
			role: 'Unknown'
		},
		resource: 'Authentication',
		details: 'Multiple failed login attempts detected from suspicious IP',
		timestamp: getRelativeDate(2),
		severity: 'error',
		ipAddress: '203.0.113.42',
		userAgent: 'Python-urllib/3.9'
	},
	{
		id: '4',
		action: 'Billing Plan Changed',
		user: {
			first_name: 'Mike',
			last_name: 'Finance',
			email: 'mike@example.com',
			role: 'Super Admin'
		},
		resource: 'Billing',
		details: 'Updated TechCorp subscription from Pro to Enterprise',
		timestamp: getRelativeDate(3),
		severity: 'info',
		ipAddress: '192.168.1.102',
		userAgent: 'Firefox/122.0',
		changes: {
			before: { plan: 'pro', price: '$499/mo' },
			after: { plan: 'enterprise', price: '$999/mo' }
		}
	},
	{
		id: '5',
		action: 'Database Backup',
		user: {
			first_name: 'System',
			last_name: 'Service',
			email: 'system@internal',
			role: 'System'
		},
		resource: 'Database',
		details: 'Automated daily backup completed successfully',
		timestamp: getRelativeDate(4),
		severity: 'info',
		ipAddress: 'internal',
		userAgent: 'Backup Service/1.0'
	},
	{
		id: '6',
		action: 'User Permission Modified',
		user: {
			first_name: 'Alice',
			last_name: 'Security',
			email: 'alice@example.com',
			role: 'Super Admin'
		},
		resource: 'User Management',
		details: 'Modified permissions for role: Support Team',
		timestamp: getRelativeDate(5),
		severity: 'warning',
		ipAddress: '192.168.1.105',
		userAgent: 'Safari/17.2',
		changes: {
			before: { permissions: ['view_tickets', 'reply_tickets'] },
			after: { permissions: ['view_tickets', 'reply_tickets', 'assign_tickets', 'close_tickets'] }
		}
	},
	{
		id: '7',
		action: 'System Update',
		user: {
			name: 'System',
			email: 'system@internal',
			role: 'System'
		},
		resource: 'Platform',
		details: 'Deployed version 2.5.0 with security patches',
		timestamp: getRelativeDate(6),
		severity: 'warning',
		ipAddress: 'internal',
		userAgent: 'Deployment Service/1.0'
	},
	{
		id: '8',
		action: 'Company Deleted',
		user: {
			first_name: 'Admin',
			last_name: 'User',
			email: 'admin@example.com',
			role: 'Super Admin'
		},
		resource: 'Companies',
		details: 'Deleted inactive company: Old Corp (ID: 12345)',
		timestamp: getRelativeDate(7),
		severity: 'error',
		ipAddress: '192.168.1.103',
		userAgent: 'Safari/17.2',
		changes: {
			before: { status: 'inactive', lastActive: '2023-12-01' },
			after: null
		}
	},
	{
		id: '9',
		action: 'Security Alert',
		user: {
			first_name: 'Security',
			last_name: 'System',
			email: 'security@internal',
			role: 'System'
		},
		resource: 'Security',
		details: 'Unusual number of API requests detected from IP range',
		timestamp: getRelativeDate(8),
		severity: 'error',
		ipAddress: 'multiple',
		userAgent: 'Security Monitor/1.0'
	},
	{
		id: '10',
		action: 'Configuration Changed',
		user: {
			first_name: 'Tom',
			last_name: 'DevOps',
			email: 'tom@example.com',
			role: 'Super Admin'
		},
		resource: 'System Settings',
		details: 'Updated email notification settings for all users',
		timestamp: getRelativeDate(9),
		severity: 'info',
		ipAddress: '192.168.1.106',
		userAgent: 'Chrome/121.0.0.0',
		changes: {
			before: { notifications: { daily: true, weekly: false } },
			after: { notifications: { daily: true, weekly: true, monthly: true } }
		}
	}
];

const severityColors = {
	info: 'text-blue-500 bg-blue-50',
	warning: 'text-yellow-500 bg-yellow-50',
	error: 'text-red-500 bg-red-50',
};

const actionIcons = {
	'Company Created': UserPlus,
	'API Key Updated': Settings,
	'Settings Changed': Edit,
	'Company Deleted': Trash2,
	'User Login Failed': AlertCircle,
	'Billing Plan Changed': DollarSign,
	'Database Backup': Database,
	'User Permission Modified': UserCog,
	'System Update': RefreshCw,
	'Security Alert': Shield,
	'Configuration Changed': Settings
};

const ITEMS_PER_PAGE = 10;

export const AuditLogs: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('');

	const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
	const [selectedResource, setSelectedResource] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [dateRange, setDateRange] = useState({
		start: subDays(new Date(), 1), // Show last 24 hours by default
		end: new Date()
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showFilters, setShowFilters] = useState(false);

	const handleDateRangeChange = (value: string) => {
		const now = new Date();
		now.setHours(23, 59, 59, 999); // Set to end of day

		switch (value) {
			case '24h':
				setDateRange({ 
					start: subDays(now, 1),
					end: now 
				});
				break;
			case '7d':
				setDateRange({ 
					start: subDays(now, 7),
					end: now 
				});
				break;
			case '30d':
				setDateRange({ 
					start: subDays(now, 30),
					end: now 
				});
				break;
			default:
				setDateRange({ 
					start: subDays(now, 1),
					end: now 
				});
		}
	};

	const filteredLogs = mockLogs.filter(log => {
		const matchesSearch = 
			log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
			log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
			`${log.user.first_name} ${log.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
		const matchesResource = selectedResource === 'all' || log.resource === selectedResource;
		
		// Parse the ISO timestamp string to a Date object for comparison
		const logDate = new Date(log.timestamp);
		const startOfDay = new Date(dateRange.start);
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date(dateRange.end);
		endOfDay.setHours(23, 59, 59, 999);
		
		// Compare dates using timestamps
		const matchesDate = logDate.getTime() >= startOfDay.getTime() && 
							logDate.getTime() <= endOfDay.getTime();

		// Debug logging
		console.log({
			log: {
				id: log.id,
				timestamp: log.timestamp,
				logDate: logDate.toISOString()
			},
			filters: {
				startOfDay: startOfDay.toISOString(),
				endOfDay: endOfDay.toISOString(),
				matchesDate,
				matchesSeverity,
				matchesResource,
				matchesSearch
			}
		});

		return matchesSearch && matchesSeverity && matchesResource && matchesDate;
	});

	const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
	const paginatedLogs = filteredLogs.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const handleExport = useCallback(async () => {
		setIsLoading(true);
		try {
			const exportData = filteredLogs.map(log => ({
				...log,
				timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
				user: `${log.user.first_name} ${log.user.last_name} (${log.user.email})`,
			}));
			
			const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Export failed:', error);
		} finally {
			setIsLoading(false);
		}
	}, [filteredLogs]);

	const refreshLogs = useCallback(() => {
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);
	return (
		<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-xl sm:text-2xl font-semibold text-primary-text">Audit Logs</h1>
					<p className="text-sm text-secondary-text mt-1">
						Monitor and track system activities
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
					<Button onClick={refreshLogs} variant="ghost" disabled={isLoading} className="w-full sm:w-auto">
						<RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
					<Button onClick={handleExport} disabled={isLoading} className="w-full sm:w-auto">
						<Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
						Export Logs
					</Button>
				</div>
			</div>

			<Card className="p-4">
				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Input
								placeholder="Search audit logs..."
								className="pl-10 w-full"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
						</div>
						<Button 
							variant="ghost"
							onClick={() => setShowFilters(!showFilters)}
							className="w-full sm:w-auto"
						>
							<Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
							{showFilters ? 'Hide Filters' : 'Show Filters'}
						</Button>
					</div>

					{showFilters && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
							<Select
								value={selectedSeverity}
								onChange={(e) => setSelectedSeverity(e.target.value)}
							>
								<option value="all">All Severities</option>
								<option value="info">Info</option>
								<option value="warning">Warning</option>
								<option value="error">Error</option>
							</Select>

							<Select
								value={selectedResource}
								onChange={(e) => setSelectedResource(e.target.value)}
							>
								<option value="all">All Resources</option>
								<option value="Companies">Companies</option>
								<option value="System Settings">System Settings</option>
								<option value="Authentication">Authentication</option>
								<option value="Billing">Billing</option>
								<option value="Database">Database</option>
								<option value="User Management">User Management</option>
								<option value="Platform">Platform</option>
								<option value="Security">Security</option>
							</Select>

							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
								<Select
									value={
										dateRange.start.getTime() === subDays(new Date(), 1).getTime() ? '24h' :
										dateRange.start.getTime() === subDays(new Date(), 7).getTime() ? '7d' :
										dateRange.start.getTime() === subDays(new Date(), 30).getTime() ? '30d' : '24h'
									}
									onChange={(e) => handleDateRangeChange(e.target.value)}
								>
									<option value="24h">Last 24 hours</option>
									<option value="7d">Last 7 days</option>
									<option value="30d">Last 30 days</option>
								</Select>
							</div>
						</div>
					)}
				</div>
			</Card>

			<div className="space-y-4">
				{paginatedLogs.map((log) => {
					const Icon = actionIcons[log.action as keyof typeof actionIcons] || AlertCircle;
					return (
						<Card key={log.id} className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200">
							<div className="flex flex-col sm:flex-row items-start justify-between gap-4">
								<div className="flex items-start gap-3 sm:gap-4 w-full">
									<div className={`p-2 rounded-lg ${severityColors[log.severity]} mt-1 flex-shrink-0`}>
										<Icon className="w-4 h-4 sm:w-5 sm:h-5" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="text-sm sm:text-base font-semibold">{log.action}</h3>
										<p className="text-xs sm:text-sm text-secondary-text mt-1">{log.details}</p>
										<div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-secondary-text">
											<span>By: {`${log.user.first_name} ${log.user.last_name}`}</span>
											<span>Role: {log.user.role}</span>
											<span>Resource: {log.resource}</span>
											{log.ipAddress && <span>IP: {log.ipAddress}</span>}
										</div>
										{log.changes && (
											<div className="mt-3 text-xs sm:text-sm">
												<div className="font-medium text-gray-700">Changes:</div>
												<pre className="mt-1 p-2 bg-gray-50 rounded-md overflow-x-auto text-xs">
													{JSON.stringify(log.changes, null, 2)}
												</pre>
											</div>
										)}
									</div>
								</div>
								<div className="text-right text-xs sm:text-sm w-full sm:w-auto">
									<span className="text-secondary-text">
										{format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
									</span>
									{log.userAgent && (
										<div className="text-xs text-gray-400 mt-1">
											{log.userAgent}
										</div>
									)}
								</div>
							</div>
						</Card>
					);
				})}

				{filteredLogs.length === 0 && (
					<Card className="p-6 sm:p-8 text-center">
						<AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
						<h3 className="text-base sm:text-lg font-medium text-gray-900">No logs found</h3>
						<p className="text-sm text-gray-500 mt-1">
							Try adjusting your search or filter criteria
						</p>
					</Card>
				)}

				{filteredLogs.length > ITEMS_PER_PAGE && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
						<div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
							Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length} results
						</div>
						<div className="flex items-center gap-2 order-1 sm:order-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="w-10 sm:w-auto"
							>
								<ChevronLeft className="w-4 h-4" />
								<span className="hidden sm:inline ml-2">Previous</span>
							</Button>
							<span className="text-xs sm:text-sm text-gray-700">
								Page {currentPage} of {totalPages}
							</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className="w-10 sm:w-auto"
							>
								<span className="hidden sm:inline mr-2">Next</span>
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};