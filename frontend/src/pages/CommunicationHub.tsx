import React from 'react';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Phone, Mail, MessagesSquare, Users, BarChart2 } from 'lucide-react';

interface CommunicationChannelProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: {
    leads: number;
    messages: number;
    response: string;
  };
  path: string;
}

const CommunicationChannel: React.FC<CommunicationChannelProps> = ({
  title,
  description,
  icon,
  stats,
  path
}) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(path)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-whatsapp-green/10 flex items-center justify-center mr-4">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div>
          <p className="text-sm text-gray-600">Active Leads</p>
          <p className="text-xl font-semibold">{stats.leads}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Messages</p>
          <p className="text-xl font-semibold">{stats.messages}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Response Time</p>
          <p className="text-xl font-semibold">{stats.response}</p>
        </div>
      </div>
    </Card>
  );
};

export const CommunicationHub: React.FC = () => {
  const channels = [
    {
      title: 'Voice Communication',
      description: 'Make calls and use voice cloning features',
      icon: <Phone className="w-6 h-6 text-whatsapp-green" />,
      stats: {
        leads: 145,
        messages: 1234,
        response: '2m'
      },
      path: 'voice'
    },
    {
      title: 'WhatsApp',
      description: 'Send messages and manage WhatsApp campaigns',
      icon: <MessageSquare className="w-6 h-6 text-whatsapp-green" />,
      stats: {
        leads: 289,
        messages: 5678,
        response: '5m'
      },
      path: 'whatsapp'
    },
    {
      title: 'SMS',
      description: 'Send text messages and manage SMS campaigns',
      icon: <MessagesSquare className="w-6 h-6 text-whatsapp-green" />,
      stats: {
        leads: 167,
        messages: 3456,
        response: '3m'
      },
      path: 'sms'
    },
    {
      title: 'Email',
      description: 'Send emails and manage email campaigns',
      icon: <Mail className="w-6 h-6 text-whatsapp-green" />,
      stats: {
        leads: 423,
        messages: 7890,
        response: '15m'
      },
      path: 'email'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Communication Hub</h1>
          <p className="text-gray-600">Manage all your communication channels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((channel) => (
          <CommunicationChannel
            key={channel.title}
            title={channel.title}
            description={channel.description}
            icon={channel.icon}
            stats={channel.stats}
            path={channel.path}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-whatsapp-green mr-2" />
            <h3 className="text-lg font-semibold">Active Leads Overview</h3>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            {/* Add lead statistics chart here */}
            <p className="text-gray-500">Lead statistics visualization coming soon</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="w-5 h-5 text-whatsapp-green mr-2" />
            <h3 className="text-lg font-semibold">Response Time Analytics</h3>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            {/* Add response time chart here */}
            <p className="text-gray-500">Response time analytics coming soon</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
