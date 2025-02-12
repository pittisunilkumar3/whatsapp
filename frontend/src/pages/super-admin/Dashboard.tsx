import React from 'react';
import { Card } from '../../components/ui/Card';
import { FunnelChart } from '../../components/charts/FunnelChart';
import { motion } from 'framer-motion';
import { Building2, Users2, CreditCard, TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react';

const mockFunnelData = [
  { label: 'Total Companies', value: 1000 },
  { label: 'Active Companies', value: 800 },
  { label: 'Premium Companies', value: 500 },
  { label: 'Enterprise Companies', value: 200 }
];

interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: any;
  color: string;
}

const metrics: DashboardMetric[] = [
  {
    label: 'Total Companies',
    value: 1000,
    change: '+12%',
    trend: 'up',
    icon: Building2,
    color: 'text-blue-600'
  },
  {
    label: 'Active Companies',
    value: 800,
    change: '+8%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    label: 'Premium Companies',
    value: 500,
    change: '+15%',
    trend: 'up',
    icon: CreditCard,
    color: 'text-purple-600'
  },
  {
    label: 'Monthly Revenue',
    value: '$48,250',
    change: '+18%',
    trend: 'up',
    icon: CreditCard,
    color: 'text-emerald-600'
  },
  {
    label: 'Total Users',
    value: '2,847',
    change: '+15%',
    trend: 'up',
    icon: Users2,
    color: 'text-indigo-600'
  },
  {
    label: 'System Usage',
    value: '92%',
    change: '+5%',
    trend: 'up',
    icon: Activity,
    color: 'text-orange-600'
  }
];

export const SuperAdminDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-primary-text">Super Admin Dashboard</h1>
        <p className="text-sm text-secondary-text mt-1">
        Overview of system performance and statistics
        </p>
      </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2">
          <p className="text-sm text-secondary-text">{metric.label}</p>
          <p className="text-lg sm:text-2xl font-semibold">{metric.value}</p>
          {metric.change && (
            <div className="flex items-center space-x-2">
            <TrendingUp
              className={`w-3 h-3 sm:w-4 sm:h-4 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
            />
            <span
              className={`text-xs sm:text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
            >
              {metric.change} this month
            </span>
            </div>
          )}
          </div>
          <div className={`p-3 sm:p-4 rounded-full bg-gray-50 ${metric.color}`}>
          <metric.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        </Card>
      ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company Distribution</h3>
        <div className="h-[300px] sm:h-[400px]">
        <FunnelChart data={mockFunnelData} />
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activities</h3>
        <div className="space-y-3 sm:space-y-4">
        {[
          {
          icon: Building2,
          color: 'text-blue-600',
          title: 'New Company Registration',
          description: 'TechCorp Solutions registered',
          time: '2 hours ago'
          },
          {
          icon: Users2,
          color: 'text-purple-600',
          title: 'User Activity Spike',
          description: '250 new users onboarded',
          time: '5 hours ago'
          },
          {
          icon: CreditCard,
          color: 'text-emerald-600',
          title: 'Subscription Upgrade',
          description: 'InnovateTech upgraded to Premium',
          time: '1 day ago'
          }
        ].map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <activity.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activity.color}`} />
            <div>
            <p className="text-sm sm:text-base font-medium">{activity.title}</p>
            <p className="text-xs sm:text-sm text-secondary-text">{activity.description}</p>
            </div>
          </div>
          <span className="text-xs sm:text-sm text-secondary-text ml-2">{activity.time}</span>
          </div>
        ))}
        </div>
      </Card>
      </div>
    </motion.div>
  );
};