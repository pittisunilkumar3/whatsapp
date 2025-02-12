import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { HeatmapChart } from '../../components/charts/HeatmapChart';
import { FunnelChart } from '../../components/charts/FunnelChart';
import { StatusPill } from '../../components/ui/StatusPill';
import { Button } from '../../components/ui/Button';
import { 
	Users, MessageSquare, BarChart2, TrendingUp, Building2, 
	Phone, Mail, ArrowUpRight, Settings, Clock, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { type DashboardMetric, type ChannelMetrics } from '../../types/dashboard';


const additionalMetrics = {
	revenue: {
		total: '$2.5M',
		growth: '+15.2%',
		breakdown: {
			enterprise: '$1.2M',
			business: '$800K',
			startup: '$500K'
		}
	},
	usage: {
		totalMessages: '1.2M',
		activeUsers: '45.2K',
		apiCalls: '892K'
	}
};

const companiesData = {
	total: 156,
	active: 142,
	pending: 8,
	suspended: 6,
	byIndustry: {
		technology: 45,
		healthcare: 32,
		retail: 28,
		finance: 25,
		others: 26
	},
	recentlyAdded: [
		{ name: 'Tech Corp', industry: 'Technology', status: 'active', date: '2023-12-01' },
		{ name: 'Health Plus', industry: 'Healthcare', status: 'pending', date: '2023-11-28' },
		{ name: 'Retail Pro', industry: 'Retail', status: 'active', date: '2023-11-25' }
	]
};

const metrics = {
	totalEmployees: {
		value: 24,
		change: '+2',
		isPositive: true
	},
	totalLeads: {
		value: 1247,
		change: '+156',
		isPositive: true
	},
	avgConversationScore: {
		value: 85,
		change: '+3.2',
		isPositive: true
	},
	conversionRate: {
		value: 24.8,
		change: '-2.4',
		isPositive: false
	}
};

const teamPerformance = {
	data: [
		[85, 82, 78, 75, 72],
		[80, 78, 75, 72, 70],
		[75, 72, 70, 68, 65],
		[70, 68, 65, 62, 60],
		[65, 62, 60, 58, 55]
	],
	agents: ['John', 'Sarah', 'Mike', 'Emma', 'Alex'],
	channels: ['WhatsApp', 'SMS', 'Voice', 'Email', 'Overall']
};

const campaignFunnel = {
	data: [
		{ label: 'Total Leads', value: 1000 },
		{ label: 'Messages Sent', value: 950 },
		{ label: 'Messages Delivered', value: 900 },
		{ label: 'Responses Received', value: 450 },
		{ label: 'Conversions', value: 150 }
	]
};

const recentActivity = [
	{
		id: '1',
		agent: 'John Smith',
		action: 'Closed deal with lead',
		channel: 'whatsapp',
		time: '10 minutes ago',
		status: 'success'
	},
	{
		id: '2',
		agent: 'Sarah Johnson',
		action: 'Started new campaign',
		channel: 'email',
		time: '25 minutes ago',
		status: 'active'
	}
];

export const CompanyAdminDashboard: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const [selectedChannel, setSelectedChannel] = useState<'all' | 'whatsapp' | 'sms' | 'voice' | 'email'>('all');
	const isSuperAdmin = user?.role === 'super_admin';

	const getSettingsPath = () => {
		switch (user?.role) {
			case 'super_admin':
				return '/superadmin/settings';
			case 'company_admin':
				return '/settings';
			case 'employee':
				return '/employee/settings';
			default:
				return '/settings';
		}
	};

	const channelMetrics: Record<string, ChannelMetrics> = {
		whatsapp: {
			messagesSent: 5432,
			responseRate: 78,
			avgResponseTime: '5m',
			conversionRate: 25
		},
		sms: {
			messagesSent: 3210,
			responseRate: 65,
			avgResponseTime: '15m',
			conversionRate: 20
		},
		voice: {
			callsMade: 856,
			answerRate: 45,
			avgCallDuration: '3m',
			conversionRate: 30
		},
		email: {
			emailsSent: 2543,
			openRate: 35,
			clickRate: 12,
			conversionRate: 18
		}
	};

	return (
		<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
			<motion.div
				className="space-y-4 sm:space-y-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 sm:mb-6">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-primary-text">
							{isSuperAdmin ? 'Super Admin Dashboard' : 'Company Dashboard'}
						</h1>
						<p className="text-sm sm:text-base text-secondary-text mt-1 sm:mt-2">
							{isSuperAdmin 
								? 'Overview of system-wide performance and companies'
								: 'Overview of your company\'s performance across all channels'
							}
						</p>
					</div>
					{!isSuperAdmin && (
						<div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
							<Button 
								variant="outline"
								onClick={() => navigate(getSettingsPath())}
								className="flex items-center justify-center space-x-2 w-full sm:w-auto"
							>
								<Settings className="w-4 h-4" />
								<span>Settings</span>
							</Button>
							<Button 
								onClick={() => navigate('/campaigns/new')}
								className="flex items-center justify-center space-x-2 bg-primary-600 text-white hover:bg-primary-700 w-full sm:w-auto"
							>
								<ArrowUpRight className="w-4 h-4" />
								<span>Create Campaign</span>
							</Button>
						</div>
					)}
				</div>

				{isSuperAdmin ? (
					<div className="space-y-4 sm:space-y-6">
						{/* Companies Overview */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
							{[
								{ label: 'Total Companies', value: companiesData.total, change: '+8.5%', icon: Building2, color: 'text-blue-600' },
								{ label: 'Active Companies', value: companiesData.active, change: '+5.2%', icon: Users, color: 'text-green-600' },
								{ label: 'Pending Approval', value: companiesData.pending, change: '0', icon: Clock, color: 'text-yellow-600' },
								{ label: 'Suspended', value: companiesData.suspended, change: '-2', icon: AlertCircle, color: 'text-red-600' }
							].map((metric, index) => (
								<Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
									<div className="flex justify-between items-start">
										<div>
											<p className="text-sm text-secondary-text">{metric.label}</p>
											<h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">{metric.value}</h3>
											<p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
												{metric.change} from last month
											</p>
										</div>
										<metric.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${metric.color}`} />
									</div>
								</Card>
							))}
						</div>

						{/* Revenue Overview */}
						<Card className="p-4 sm:p-6 mb-4 sm:mb-8">
							<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 sm:mb-6">
								<div>
									<h2 className="text-lg sm:text-xl font-semibold">Revenue Overview</h2>
									<p className="text-xs sm:text-sm text-secondary-text mt-1">Monthly revenue breakdown</p>
								</div>
								<div className="flex items-center gap-2">
									<Button variant="ghost" size="sm" className="text-sm">
										This Month
									</Button>
									<Button variant="ghost" size="sm" className="text-sm">
										Last Month
									</Button>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
								<div>
									<p className="text-sm text-secondary-text">Total Revenue</p>
									<h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">{additionalMetrics.revenue.total}</h3>
									<p className="text-xs sm:text-sm text-green-600 mt-1">{additionalMetrics.revenue.growth}</p>
								</div>
								<div>
									<p className="text-sm text-secondary-text">Active Users</p>
									<h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">{additionalMetrics.usage.activeUsers}</h3>
									<p className="text-xs sm:text-sm text-green-600 mt-1">+8.1% from last month</p>
								</div>
								<div>
									<p className="text-sm text-secondary-text">Total Messages</p>
									<h3 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">{additionalMetrics.usage.totalMessages}</h3>
									<p className="text-xs sm:text-sm text-green-600 mt-1">+12.5% from last month</p>
								</div>
							</div>
						</Card>
					</div>
				) : (
					<div className="space-y-4 sm:space-y-6">
						{/* Add company admin specific content here */}
					</div>
				)}
			</motion.div>
		</div>
	);
};


