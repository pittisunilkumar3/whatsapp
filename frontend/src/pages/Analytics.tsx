import { type FC, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Users, Building2, MessageSquare, Clock, TrendingUp, Target, AlertCircle, Filter, ChevronDown } from 'lucide-react';
import { GaugeChart } from '../components/charts/GaugeChart';

import { Card } from '../components/ui/Card';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';



// Company metrics data
const companyMetrics = {
  bySize: {
    enterprise: 45,
    midMarket: 62,
    smallBusiness: 49
  },
  byStatus: {
    active: 142,
    trial: 8,
    suspended: 6
  },
  growth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [120, 135, 142, 148, 152, 156]
  }
};

// Enhanced mock data
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Messages Sent',
      data: [650, 590, 800, 810, 960, 1100],
      borderColor: '#075E54',
      backgroundColor: 'rgba(7, 94, 84, 0.1)',
    },
    {
      label: 'User Growth',
      data: [200, 250, 300, 450, 500, 550],
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
    }
  ],
};

const barChartData = {
  labels: ['WhatsApp', 'SMS', 'Voice', 'Email', 'In-App'],
  datasets: [
    {
      label: 'Response Rate',
      data: [75, 68, 45, 55, 82],
      backgroundColor: ['#075E54', '#3CBC8D', '#66BB6A', '#4FC3F7', '#FF9800'],
    }
  ],
};

// Add new mock data for detailed metrics
const detailedMetrics = {
  engagement: [
    { label: 'Active Conversations', value: '1,234', change: '+15%' },
    { label: 'Message Volume', value: '45.2K', change: '+8%' },
    { label: 'Avg Session Duration', value: '12m', change: '+5%' },
    { label: 'User Satisfaction', value: '4.8/5', change: '+0.2' },
  ],
  performance: [
    { label: 'Response Time', value: '2.5m', change: '-12%' },
    { label: 'Resolution Rate', value: '92%', change: '+3%' },
    { label: 'Handling Time', value: '8.5m', change: '-5%' },
    { label: 'First Contact Resolution', value: '78%', change: '+4%' },
  ]
};

// Add employee mock data
const employeeMockData = {
  personalMetrics: {
    messagesSent: 245,
    leadsConverted: 12,
    avgScore: 85,
    responseRate: 92
  },
  campaignPerformance: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Response Rate',
      data: [75, 82, 88, 92],
      borderColor: '#4CAF50'
    }]
  },
  leadScores: {
    labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
    data: [5, 10, 25, 35, 25]
  }
};

const pieChartData = {
  labels: ['Active', 'Unresponsive', 'Converted', 'Lost', 'In Progress'],
  datasets: [
    {
      data: [35, 25, 20, 10, 10],
      backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#F44336', '#9C27B0'],
    }
  ],
};

export const Analytics: FC = () => {
  const userRole = useAuthStore(state => state.user?.role);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'whatsapp' | 'sms' | 'voice' | 'email'>('all');

  type ExportSection = 'detailed' | 'trends' | 'channels' | 'leads';
  
  const handleExport = useCallback(async (section: ExportSection) => {
    try {
      // TODO: Implement actual export logic
      console.log(`Exporting ${section} data...`);
    } catch (error) {
      console.error(`Error exporting ${section} data:`, error);
      // TODO: Add proper error handling/notification
    }
  }, []);

  const ChannelFilter = () => {
    const [isOpen, setIsOpen] = useState(false);

    const channels = {
      whatsapp: {
        label: 'WhatsApp',
        metrics: {
          activeUsers: '12.5K',
          messagesSent: '45.2K',
          responseRate: '92%',
          avgResponseTime: '2.5m'
        }
      },
      sms: {
        label: 'SMS',
        metrics: {
          activeUsers: '8.3K',
          messagesSent: '32.1K',
          responseRate: '88%',
          avgResponseTime: '3.2m'
        }
      },
      voice: {
        label: 'Voice',
        metrics: {
          activeUsers: '5.2K',
          callsDuration: '450h',
          callSuccess: '95%',
          avgCallTime: '4.5m'
        }
      },
      email: {
        label: 'Email',
        metrics: {
          activeUsers: '15.1K',
          emailsSent: '28.9K',
          openRate: '76%',
          avgResponseTime: '4.8h'
        }
      }
    };

    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-48 justify-between"
        >
          <span>{channels[selectedChannel as keyof typeof channels]?.label || 'All Channels'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div className="absolute z-10 w-96 mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
            {Object.entries(channels).map(([key, data]) => (
              <div
                key={key}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => {
                  setSelectedChannel(key as keyof typeof channels);
                  setIsOpen(false);
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{data.label}</h3>
                  <div className={`h-2 w-2 rounded-full ${selectedChannel === key ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(data.metrics).map(([metricKey, value]) => (
                    <div key={metricKey} className="text-sm">
                      <span className="text-gray-500">{metricKey.replace(/([A-Z])/g, ' $1').trim()}: </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TimeRangeSelector = () => (
    <div className="flex space-x-2">
      {['24h', '7d', '30d', '90d'].map((range) => (
        <Button
          key={range}
            variant={timeRange === range ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setTimeRange(range)}
        >
          {range}
        </Button>
      ))}
    </div>
  );

  const DetailedMetricsSection = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Detailed Performance Metrics</h2>
        <Button variant="ghost" size="sm" onClick={() => handleExport('detailed')}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-md font-medium mb-4 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-primary-600" />
            Engagement Metrics
          </h3>
          <div className="space-y-4">
            {detailedMetrics.engagement.map((metric, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-secondary-text">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{metric.value}</span>
                  <span className={`text-sm ${
                    metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-md font-medium mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-primary-600" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            {detailedMetrics.performance.map((metric, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-secondary-text">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{metric.value}</span>
                  <span className={`text-sm ${
                    metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  const SuperAdminMetrics = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
            { label: 'Total Companies', value: '156', change: '+8.5%', icon: Building2 as IconComponent, description: 'Active companies in the platform' },
            { label: 'Active Users', value: '12,847', change: '+15.2%', icon: Users as IconComponent, description: 'Total users across all companies' },
            { label: 'Total Revenue', value: '$1.2M', change: '+22.8%', icon: TrendingUp as IconComponent, description: 'Monthly recurring revenue' },
            { label: 'System Uptime', value: '99.9%', change: '+0.1%', icon: AlertCircle as IconComponent, description: 'Platform availability' },
        ].map((metric, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <metric.icon className="w-5 h-5 text-primary-600" />
                  <h3 className="text-secondary-text">{metric.label}</h3>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className={`ml-2 text-sm ${
                    metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-xs text-secondary-text mt-1">{metric.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Companies by Size</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(companyMetrics.bySize).map(([size, count]) => (
              <div key={size} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <h3 className="text-sm font-medium capitalize">{size.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <p className="text-2xl font-bold mt-2">{count}</p>
                <p className="text-xs text-secondary-text">companies</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Company Status Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(companyMetrics.byStatus).map(([status, count]) => (
              <div key={status} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <h3 className="text-sm font-medium capitalize">{status}</h3>
                <p className="text-2xl font-bold mt-2">{count}</p>
                <p className="text-xs text-secondary-text">companies</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Company Growth</h2>
            <p className="text-sm text-secondary-text">Total number of companies over time</p>
          </div>
          <TimeRangeSelector />
        </div>
        <LineChart 
          data={{
            labels: companyMetrics.growth.labels,
            datasets: [{
              label: 'Total Companies',
              data: companyMetrics.growth.data,
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
            }]
          }} 
          height={300}
        />
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">System Performance</h2>
            <p className="text-sm text-secondary-text">Real-time system metrics</p>
          </div>
          <TimeRangeSelector />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-secondary-text">API Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Response Time</span>
                <span className="font-semibold">145ms</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate</span>
                <span className="font-semibold text-green-500">99.8%</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-secondary-text">Resource Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>CPU Load</span>
                <span className="font-semibold">42%</span>
              </div>
              <div className="flex justify-between">
                <span>Memory Usage</span>
                <span className="font-semibold">68%</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-secondary-text">Error Rates</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>4xx Errors</span>
                <span className="font-semibold text-yellow-500">0.5%</span>
              </div>
              <div className="flex justify-between">
                <span>5xx Errors</span>
                <span className="font-semibold text-green-500">0.1%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div className="p-6 bg-red-50 rounded-lg">
      <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
      <p className="text-sm text-red-600 mt-1">{error.message}</p>
    </div>
  );

  const EmployeeView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary-text">My Performance</h1>
        <p className="text-secondary-text mt-1">
          Track your performance metrics and campaign results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Messages Sent', value: employeeMockData.personalMetrics.messagesSent, icon: MessageSquare },
          { label: 'Leads Converted', value: employeeMockData.personalMetrics.leadsConverted, icon: Target },
          { label: 'Average Score', value: `${employeeMockData.personalMetrics.avgScore}%`, icon: TrendingUp },
          { label: 'Response Rate', value: `${employeeMockData.personalMetrics.responseRate}%`, icon: Clock }
        ].map((metric, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-secondary-text">{metric.label}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                </div>
              </div>
              <metric.icon className="w-8 h-8 text-primary-600 opacity-80" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Campaign Performance</h2>
          <LineChart data={employeeMockData.campaignPerformance} height={300} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Lead Score Distribution</h2>
          <BarChart 
            data={{
              labels: employeeMockData.leadScores.labels,
              datasets: [{
                label: 'Leads',
                data: employeeMockData.leadScores.data,
                backgroundColor: '#4CAF50'
              }]
            }} 
            height={300}
          />
        </Card>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          {userRole === 'super_admin' ? (
            <SuperAdminMetrics />
          ) : userRole === 'employee' ? (
            <EmployeeView />
          ) : (
            <>
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-primary-text">Analytics Dashboard</h1>
                    <p className="text-sm text-secondary-text mt-1">
                      Track and analyze your communication metrics
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <TimeRangeSelector />
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <ChannelFilter />
                  <div className="text-sm text-secondary-text">
                    Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: 'Total Leads', value: '2,547', change: '+12.5%', icon: Target },
                  { label: 'Response Rate', value: '68%', change: '+5.2%', icon: MessageSquare },
                  { label: 'Conversion Rate', value: '24%', change: '+2.8%', icon: TrendingUp },
                  { label: 'Avg Response Time', value: '2.5h', change: '-15%', icon: Clock },
                ].map((metric, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-secondary-text">{metric.label}</h3>
                        <div className="mt-2">
                          <span className="text-2xl font-bold">{metric.value}</span>
                          <span className={`ml-2 text-sm ${
                            metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <metric.icon className="w-8 h-8 text-primary-600 opacity-80" />
                    </div>
                  </Card>
                ))}
              </div>

                <DetailedMetricsSection />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-semibold">Communication Trends</h2>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => handleExport('trends')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  </div>
                  <div className="w-full h-[300px] sm:h-[400px]">
                  <LineChart data={lineChartData} height="100%" />
                  </div>
                </Card>

                <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-semibold">Channel Performance</h2>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => handleExport('channels')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  </div>
                  <div className="w-full h-[300px] sm:h-[400px]">
                  <BarChart data={barChartData} height={300} />
                  </div>
                </Card>
                </div>

                <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-semibold">Lead Distribution</h2>
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => handleExport('leads')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  </div>
                  <div className="max-w-2xl mx-auto h-[300px] sm:h-[400px]">
                  <PieChart data={pieChartData} height={300} />
                  </div>
                </Card>
            </>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};


  // Type definitions for better type safety
  type IconComponent = typeof Download;

  type MetricData = {
    label: string;
    value: string;
    change: string;
    icon: IconComponent;
    description?: string;
  };


