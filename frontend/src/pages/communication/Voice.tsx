import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { Switch } from '../../components/ui/Switch';
import { Dropdown } from '../../components/ui/Dropdown';
import { VoiceCloneModal } from '../../components/voice/VoiceCloneModal';
import { VoiceCampaignCard } from '../../components/voice/VoiceCampaignCard';
import {
    Phone,
    Users,
    BarChart2,
    Settings,
    Upload,
    Play,
    Pause,
    StopCircle,
    Mic,
    Mic2,
    Volume2,
    FileText,
    Clock,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    PlusCircle,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
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

interface Campaign {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'completed';
    leads: number;
    completed: number;
    successRate: number;
    lastRun: string;
    reachRate: number;
    duration: string;
    totalCalls: number;
}

interface VoiceAgent {
    id: string;
    name: string;
    voice: string;
    language: string;
    gender: string;
    tone: string;
    active: boolean;
    clonedFrom?: string;
    accuracy: number;
    lastUsed: string;
}

interface AnalyticsData {
    date: string;
    calls: number;
    success: number;
    duration: number;
}

export const Voice: React.FC = () => {
    const [activeTab, setActiveTab] = useState('campaigns');
    const [showNewCampaign, setShowNewCampaign] = useState(false);
    const [showNewAgent, setShowNewAgent] = useState(false);
    const [showVoiceClone, setShowVoiceClone] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<VoiceAgent | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
    const [isRealtime, setIsRealtime] = useState(true);

    const [campaigns] = useState<Campaign[]>([
        {
            id: '1',
            name: 'Sales Follow-up Q1',
            status: 'active',
            leads: 1500,
            completed: 750,
            successRate: 68,
            lastRun: '2025-02-10 08:30 AM',
            reachRate: 85,
            duration: '2m 30s',
            totalCalls: 750
        },
        {
            id: '2',
            name: 'Customer Feedback',
            status: 'paused',
            leads: 800,
            completed: 200,
            successRate: 75,
            lastRun: '2025-02-09 03:45 PM',
            reachRate: 70,
            duration: '1m 45s',
            totalCalls: 200
        }
    ]);

    const [voiceAgents] = useState<VoiceAgent[]>([
        {
            id: '1',
            name: 'Sarah',
            voice: 'Natural',
            language: 'English (US)',
            gender: 'Female',
            tone: 'Professional',
            active: true,
            accuracy: 95,
            lastUsed: '2025-02-10'
        },
        {
            id: '2',
            name: 'Michael',
            voice: 'Natural',
            language: 'English (UK)',
            gender: 'Male',
            tone: 'Friendly',
            active: true,
            accuracy: 92,
            lastUsed: '2025-02-09'
        }
    ]);

    useEffect(() => {
        // Simulate real-time data updates
        if (isRealtime) {
            const interval = setInterval(() => {
                setAnalyticsData(prev => {
                    const newData = [...prev];
                    const now = new Date();
                    if (newData.length > 20) newData.shift();
                    newData.push({
                        date: now.toLocaleTimeString(),
                        calls: Math.floor(Math.random() * 100),
                        success: Math.floor(Math.random() * 80),
                        duration: Math.random() * 5
                    });
                    return newData;
                });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isRealtime]);

    const handleVoiceClone = (voiceData: any) => {
        console.log('Cloning voice:', voiceData);
        // Implement voice cloning logic
    };

    const renderCampaigns = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Input
                        placeholder="Search campaigns..."
                        className="w-full sm:w-64"
                        icon={<Filter className="w-4 h-4 text-gray-400" />}
                    />
                    <Dropdown
                        label="Status"
                        value="all"
                        onChange={() => {}}
                        options={[
                            { label: 'All', value: 'all' },
                            { label: 'Active', value: 'active' },
                            { label: 'Paused', value: 'paused' },
                            { label: 'Completed', value: 'completed' }
                        ]}
                        className="w-full sm:w-40"
                    />
                </div>
                <Button 
                    onClick={() => setShowNewCampaign(true)} 
                    className="w-full sm:w-auto bg-primary text-white"
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Campaign
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {campaigns.map((campaign) => (
                    <VoiceCampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onViewDetails={(id) => console.log('View details:', id)}
                    />
                ))}
            </div>
        </div>
    );

    const renderVoiceAgents = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Input
                        placeholder="Search voice agents..."
                        className="w-full sm:w-64"
                        icon={<Filter className="w-4 h-4 text-gray-400" />}
                    />
                    <Dropdown
                        label="Language"
                        value="all"
                        onChange={() => {}}
                        options={[
                            { label: 'All Languages', value: 'all' },
                            { label: 'English (US)', value: 'en-us' },
                            { label: 'English (UK)', value: 'en-uk' },
                            { label: 'Spanish', value: 'es' }
                        ]}
                        className="w-full sm:w-40"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button 
                        onClick={() => setShowVoiceClone(true)} 
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <Mic2 className="w-4 h-4 mr-2" />
                        Clone Voice
                    </Button>
                    <Button 
                        onClick={() => setShowNewAgent(true)} 
                        className="w-full sm:w-auto bg-primary text-white"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Voice Agent
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {voiceAgents.map((agent) => (
                    <Card key={agent.id} className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{agent.name}</h3>
                                    <p className="text-sm text-gray-500">{agent.language}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Voice Type:</span>
                                        <span className="ml-2">{agent.voice}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Gender:</span>
                                        <span className="ml-2">{agent.gender}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Tone:</span>
                                        <span className="ml-2">{agent.tone}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Accuracy:</span>
                                        <span className="ml-2">{agent.accuracy}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button variant="outline" onClick={() => setSelectedAgent(agent)}>
                                    <Volume2 className="w-4 h-4 mr-2" />
                                    Preview
                                </Button>
                                <Switch
                                    checked={agent.active}
                                    onChange={() => {}}
                                    label="Active"
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderAnalytics = () => {
        const chartData = {
            labels: analyticsData.map(data => data.date),
            datasets: [
                {
                    label: 'Total Calls',
                    data: analyticsData.map(data => data.calls),
                    borderColor: '#8884d8',
                    tension: 0.4
                },
                {
                    label: 'Successful Calls',
                    data: analyticsData.map(data => data.success),
                    borderColor: '#82ca9d',
                    tension: 0.4
                },
                {
                    label: 'Avg Duration (min)',
                    data: analyticsData.map(data => data.duration),
                    borderColor: '#ffc658',
                    tension: 0.4
                }
            ]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top' as const
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <Card className="p-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Total Calls</h3>
                                <p className="text-3xl font-bold">12,450</p>
                                <p className="text-sm text-green-600">↑ 15% from last month</p>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Success Rate</h3>
                                <p className="text-3xl font-bold">72%</p>
                                <p className="text-sm text-green-600">↑ 5% from last month</p>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Avg. Call Duration</h3>
                                <p className="text-3xl font-bold">3m 45s</p>
                                <p className="text-sm text-gray-500">-10s from last month</p>
                            </div>
                        </Card>
                    </div>
                </div>

                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Real-time Performance</h3>
                        <div className="flex items-center space-x-4">
                            <Switch
                                checked={isRealtime}
                                onChange={() => setIsRealtime(!isRealtime)}
                                label="Real-time Updates"
                            />
                            <Button variant="outline" size="sm">
                                <Activity className="w-4 h-4 mr-2" />
                                Live View
                            </Button>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 max-w-[1400px] mx-auto"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-3xl font-bold">Voice Campaigns</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your AI voice campaigns and agents
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            <Tabs
                tabs={[
                    { id: 'campaigns', label: 'Campaigns', icon: <Phone className="w-4 h-4" /> },
                    { id: 'voice-agents', label: 'Voice Agents', icon: <Mic className="w-4 h-4" /> },
                    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> }
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <div className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'campaigns' && renderCampaigns()}
                        {activeTab === 'voice-agents' && renderVoiceAgents()}
                        {activeTab === 'analytics' && renderAnalytics()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Voice Clone Modal */}
            <VoiceCloneModal
                isOpen={showVoiceClone}
                onClose={() => setShowVoiceClone(false)}
                onClone={handleVoiceClone}
            />

            {/* New Campaign Modal */}
            <Modal
                isOpen={showNewCampaign}
                onClose={() => setShowNewCampaign(false)}
                title="Create New Campaign"
            >
                <div className="space-y-4">
                    <Input label="Campaign Name" placeholder="Enter campaign name" />
                    <Dropdown
                        label="Voice Agent"
                        value=""
                        onChange={() => {}}
                        options={voiceAgents.map(agent => ({
                            label: agent.name,
                            value: agent.id
                        }))}
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Import Leads</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                                Drag and drop your CSV file here, or click to browse
                            </p>
                        </div>
                    </div>
                    <Input
                        type="datetime-local"
                        label="Schedule Start"
                    />
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="outline" onClick={() => setShowNewCampaign(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-primary text-white">
                            Create Campaign
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* New Voice Agent Modal */}
            <Modal
                isOpen={showNewAgent}
                onClose={() => setShowNewAgent(false)}
                title="Create Voice Agent"
            >
                <div className="space-y-4">
                    <Input label="Agent Name" placeholder="Enter agent name" />
                    <Dropdown
                        label="Language"
                        value=""
                        onChange={() => {}}
                        options={[
                            { label: 'English (US)', value: 'en-us' },
                            { label: 'English (UK)', value: 'en-uk' },
                            { label: 'Spanish', value: 'es' }
                        ]}
                    />
                    <Dropdown
                        label="Voice Type"
                        value=""
                        onChange={() => {}}
                        options={[
                            { label: 'Natural', value: 'natural' },
                            { label: 'Professional', value: 'professional' },
                            { label: 'Casual', value: 'casual' }
                        ]}
                    />
                    <Dropdown
                        label="Gender"
                        value=""
                        onChange={() => {}}
                        options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' }
                        ]}
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Voice Sample</label>
                        <div className="border rounded-lg p-4">
                            <textarea
                                className="w-full h-20 resize-none border rounded-lg p-2"
                                placeholder="Enter text to preview voice..."
                            />
                            <Button variant="outline" className="mt-2">
                                <Volume2 className="w-4 h-4 mr-2" />
                                Preview Voice
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="outline" onClick={() => setShowNewAgent(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-primary text-white">
                            Create Voice Agent
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Voice Preview Modal */}
            <Modal
                isOpen={!!selectedAgent}
                onClose={() => setSelectedAgent(null)}
                title={`Preview ${selectedAgent?.name}'s Voice`}
            >
                <div className="space-y-4">
                    <textarea
                        className="w-full h-32 resize-none border rounded-lg p-2"
                        placeholder="Enter text to preview voice..."
                    />
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setSelectedAgent(null)}>
                            Close
                        </Button>
                        <Button className="bg-primary text-white">
                            <Volume2 className="w-4 h-4 mr-2" />
                            Play Preview
                        </Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
};
