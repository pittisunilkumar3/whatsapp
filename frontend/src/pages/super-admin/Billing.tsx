import { type FC, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, CreditCard, DollarSign, Users, TrendingUp, Search, Filter } from 'lucide-react';
import { LineChart } from '../../components/charts/LineChart';

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Monthly Revenue',
    data: [125000, 138000, 142000, 155000, 162000, 178000],
    borderColor: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  }]
};

const transactions = [
  { id: 1, company: 'Acme Corp', amount: '$2,500', date: '2023-12-01', status: 'success' },
  { id: 2, company: 'TechStart Inc', amount: '$1,800', date: '2023-12-01', status: 'success' },
  { id: 3, company: 'Global Solutions', amount: '$3,200', date: '2023-11-30', status: 'pending' }
];

export const BillingPage: FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredTransactions = transactions.filter(transaction => 
    transaction.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedStatus === 'all' || transaction.status === selectedStatus)
  );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-text">Billing Management</h1>
            <p className="text-sm text-secondary-text mt-1">Manage billing and subscriptions</p>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Revenue', value: '$125,000', change: '+15.2%', icon: DollarSign },
          { label: 'Active Subscriptions', value: '142', change: '+5.8%', icon: CreditCard },
          { label: 'Paying Customers', value: '138', change: '+8.3%', icon: Users },
          { label: 'MRR Growth', value: '22%', change: '+2.4%', icon: TrendingUp }
        ].map((metric, index) => (
          <Card key={index} className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-text">{metric.label}</p>
                <p className="text-lg sm:text-2xl font-semibold mt-2">{metric.value}</p>
                <span className={`text-xs sm:text-sm ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change}
                </span>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-gray-50">
                <metric.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Revenue Trends</h2>
          <div className="h-[300px] sm:h-[400px]">
            <LineChart data={revenueData} height="100%" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-4">Recent Transactions</h2>
          
          {/* Mobile View */}
          <div className="block lg:hidden space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{transaction.company}</span>
                  <span className="font-semibold">{transaction.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{transaction.date}</span>
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${transaction.status === 'success' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-sm font-medium">Company</th>
                  <th className="text-left py-3 text-sm font-medium">Amount</th>
                  <th className="text-left py-3 text-sm font-medium">Date</th>
                  <th className="text-left py-3 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-3 text-sm">{transaction.company}</td>
                    <td className="py-3 text-sm font-medium">{transaction.amount}</td>
                    <td className="py-3 text-sm text-gray-600">{transaction.date}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${transaction.status === 'success' ? 'bg-green-100 text-green-800' : 
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
