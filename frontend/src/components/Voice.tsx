import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Tabs } from './ui/Tabs';
import { Switch } from './ui/Switch';
import { VoiceCloneModal } from './VoiceCloneModal';
import { Line } from 'react-chartjs-2';
import { Mic2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VoiceAnalytics {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const Voice: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState<VoiceAnalytics>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calls',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(255, 152, 0)',
        backgroundColor: 'rgba(255, 152, 0, 0.5)',
      },
    ],
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Voice Call Analytics',
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Voice Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Clone Voice
        </button>
      </div>
    
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Active Campaigns</h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary">12</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Total Calls</h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary">1,234</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2">Success Rate</h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary">85%</p>
        </Card>
      </div>
    
      <Card className="mt-6 p-4 sm:p-6 overflow-hidden">
        <Line options={options} data={analytics} />
      </Card>
    
      <VoiceCloneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Voice;
