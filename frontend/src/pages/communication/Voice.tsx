import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
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

interface VoiceApiResponse {
    next: null | string;
    previous: null | string;
    results: {
        voiceId: string;
        name: string;
        description: string;
        previewUrl: string | null;
        ownership: string;
    }[];
    total: number;
}

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
    role: string;
    defaultPrompt: string;
    previewUrl?: string | null;
}

interface TestCallResponse {
    message: string;
    callSid: string;
    joinUrl: string;
}

interface AnalyticsData {
    date: string;
    calls: number;
    success: number;
    duration: number;
}

export const Voice: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('campaigns');
    const [showNewAgent, setShowNewAgent] = useState(false);
    const [showVoiceClone, setShowVoiceClone] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<VoiceAgent | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
    const [isRealtime, setIsRealtime] = useState(true);

    // Add these new states for test call functionality
    const [selectedTestAgent, setSelectedTestAgent] = useState<string>('');
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isCallingInProgress, setIsCallingInProgress] = useState(false);
    const [callHistory, setCallHistory] = useState([
        {
            id: '1',
            number: '+1234567890',
            startTime: '2024-02-16 10:30 AM',
            endTime: '2024-02-16 10:35 AM',
            summary: 'Customer inquired about gold prices and investment options.',
            sentiment: 'Positive'
        },
        {
            id: '2',
            number: '+1987654321',
            startTime: '2024-02-16 11:15 AM',
            endTime: '2024-02-16 11:20 AM',
            summary: 'Discussed telemarketing campaign for new product launch.',
            sentiment: 'Neutral'
        },
        {
            id: '3',
            number: '+1122334455',
            startTime: '2024-02-16 12:00 PM',
            endTime: '2024-02-16 12:07 PM',
            summary: 'Resolved customer support ticket regarding account access.',
            sentiment: 'Positive'
        }
    ]);

    const [voiceOptions, setVoiceOptions] = useState<VoiceApiResponse['results']>([]);
    const [isLoadingVoices, setIsLoadingVoices] = useState(false);
    const user = useAuthStore(state => state.user);
    const companyId = user?.company?.id;

    useEffect(() => {
        const fetchVoices = async () => {
            if (!companyId) return;
            setIsLoadingVoices(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ultravox-calls/ultravox-voices`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ companyId }),
                });

                if (!response.ok) {
                    console.error(`Error fetching voices: HTTP status ${response.status}`);
                    setVoiceOptions([]);
                    return;
                }

                const data: VoiceApiResponse = await response.json();
                console.log('Fetched voices:', data);
                setVoiceOptions(data.results);
            } catch (error) {
                console.error('Error fetching voices:', error);
                setVoiceOptions([]);
            } finally {
                setIsLoadingVoices(false);
            }
        };

        fetchVoices();
    }, [companyId]);

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
            lastUsed: '2025-02-10',
            role: 'Customer Support',
            defaultPrompt: 'Hello, this is Sarah from customer support. How may I assist you with your inquiry today?'
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
            lastUsed: '2025-02-09',
            role: 'Sales',
            defaultPrompt: 'Hi there! This is Michael from the sales team. I\'d love to discuss how our solutions can benefit your business.'
        },
        {
            id: '3',
            name: 'Emma',
            voice: 'Professional',
            language: 'English (US)',
            gender: 'Female',
            tone: 'Persuasive',
            active: true,
            accuracy: 94,
            lastUsed: '2025-02-08',
            role: 'Marketing',
            defaultPrompt: 'Hello! This is Emma from the marketing team. I\'m excited to share our latest offerings and promotional campaigns with you.'
        },
        {
            id: '4',
            name: 'James',
            voice: 'Natural',
            language: 'English (UK)',
            gender: 'Male',
            tone: 'Professional',
            active: true,
            accuracy: 96,
            lastUsed: '2025-02-07',
            role: 'Gold Shop Agent',
            defaultPrompt: 'Good day! This is James from the precious metals department. I\'d be happy to discuss our gold investment opportunities with you.'
        }
    ]);

    // Add new state for custom prompt
    const [customPrompt, setCustomPrompt] = useState<string>('');
    const [isCustomPrompt, setIsCustomPrompt] = useState(false);

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

    const handleTestCall = async () => {
        if (!companyId || !selectedTestAgent || !selectedVoice || !phoneNumber) {
            console.error('Please fill in all required fields');
            return;
        }

        setIsCallingInProgress(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ultravox-calls/ultravox-test-call`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyId,
                    destinationNumber: phoneNumber,
                    systemPrompt: isCustomPrompt ? customPrompt : voiceAgents.find(a => a.id === selectedTestAgent)?.defaultPrompt,
                    voice: voiceOptions.find(v => v.voiceId === selectedVoice)?.name
                }),
            });

            if (!response.ok) {
                console.error(`Error making test call: HTTP status ${response.status}`);
                return;
            }

            const data: TestCallResponse = await response.json();
            console.log('Test call response:', data);
            
            // Add to call history
            const newCall = {
                id: data.callSid,
                number: phoneNumber,
                startTime: new Date().toLocaleString(),
                endTime: new Date(Date.now() + 300000).toLocaleString(),
                summary: `Test call initiated successfully. ${data.message}`,
                sentiment: 'Neutral'
            };
            
            setCallHistory([newCall, ...callHistory]);
            setPhoneNumber('');
        } catch (error) {
            console.error('Error making test call:', error);
        } finally {
            setIsCallingInProgress(false);
        }
    };

    const handleNewCampaign = () => {
        navigate('/company-admin/communication/voice/new-campaign');
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
                    onClick={handleNewCampaign}
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
                        variant="ghost"
                        onClick={() => setShowVoiceClone(true)} 
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
                                <Button variant="ghost" onClick={() => setSelectedAgent(agent)}>
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
                            <Button variant="ghost" size="sm">
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

    // Update the renderTestCall function
    const renderTestCall = () => {
        const selectedAgentData = voiceAgents.find(a => a.id === selectedTestAgent);

        return (
            <div className="space-y-8">
                <Card className="p-8">
                    <h3 className="text-2xl font-semibold mb-6">Make a Test Call</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Agent Role</label>
                                <Dropdown
                                    value={selectedTestAgent}
                                    onChange={(value) => {
                                        setSelectedTestAgent(value);
                                        setCustomPrompt(voiceAgents.find(a => a.id === value)?.defaultPrompt || '');
                                    }}
                                    options={voiceAgents.map(agent => ({
                                        label: `${agent.name} (${agent.role})`,
                                        value: agent.id
                                    }))}
                                    placeholder="Choose an agent"
                                    className="w-full"
                                />
                                {selectedAgentData && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Language:</span>
                                                <span className="ml-2">{selectedAgentData.language}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Tone:</span>
                                                <span className="ml-2">{selectedAgentData.tone}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Accuracy:</span>
                                                <span className="ml-2">{selectedAgentData.accuracy}%</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Role:</span>
                                                <span className="ml-2">{selectedAgentData.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Voice Type</label>
                                {isLoadingVoices ? (
                                    <div className="flex items-center justify-center">
                                        <span>Loading voices...</span>
                                    </div>
                                ) : (
                                    <Dropdown
                                        value={selectedVoice}
                                        onChange={(value) => setSelectedVoice(value)}
                                        options={voiceOptions.map(voice => ({
                                            label: voice.name,
                                            value: voice.voiceId
                                        }))}
                                        placeholder={voiceOptions.length === 0 ? "No voices available" : "Choose a voice"}
                                        disabled={isLoadingVoices || voiceOptions.length === 0}
                                        className="w-full"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                <div className="flex space-x-2">
                                    <Input
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter phone number"
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleTestCall}
                                        disabled={!selectedTestAgent || !selectedVoice || !phoneNumber || isCallingInProgress}
                                        className="bg-primary text-white px-6"
                                    >
                                        <Phone className="w-4 h-4 mr-2" />
                                        {isCallingInProgress ? 'Initiating Call...' : 'Make Call'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium">Conversation Prompt</label>
                                    <Switch
                                        checked={isCustomPrompt}
                                        onChange={() => {
                                            setIsCustomPrompt(!isCustomPrompt);
                                            if (!isCustomPrompt) {
                                                setCustomPrompt(selectedAgentData?.defaultPrompt || '');
                                            }
                                        }}
                                        label="Custom Prompt"
                                    />
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={isCustomPrompt ? customPrompt : (selectedAgentData?.defaultPrompt || '')}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        disabled={!isCustomPrompt}
                                        className="w-full h-48 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter custom prompt..."
                                    />
                                    {!isCustomPrompt && selectedAgentData && (
                                        <div className="absolute top-2 right-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Default Prompt
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">Suggested Prompts</h4>
                                    <div className="space-y-2">
                                        {selectedAgentData?.role === 'Sales' && (
                                            <>
                                                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setCustomPrompt("Hi! I noticed you've shown interest in our premium package. I'd love to discuss how it can help scale your business.")}>
                                                    <p className="text-sm">Sales Follow-up</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setCustomPrompt("Hello! I'm reaching out regarding our limited-time offer on enterprise solutions. Would you like to learn more about the exclusive benefits?")}>
                                                    <p className="text-sm">Special Offer</p>
                                                </div>
                                            </>
                                        )}
                                        {selectedAgentData?.role === 'Marketing' && (
                                            <>
                                                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setCustomPrompt("Hi there! I'm excited to tell you about our upcoming product launch. Would you like to be among the first to know?")}>
                                                    <p className="text-sm">Product Launch</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setCustomPrompt("Hello! We've just released our new feature set that I think would perfectly align with your needs. Shall we discuss?")}>
                                                    <p className="text-sm">Feature Announcement</p>
                                                </div>
                                            </>
                                        )}
                                        {selectedAgentData?.role === 'Customer Support' && (
                                            <>
                                                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setCustomPrompt("Hello! I'm following up on your recent support ticket. Have you had a chance to try the solution we discussed?")}>
                                                    <p className="text-sm">Support Follow-up</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setCustomPrompt("Hi! I noticed you've been using our product for a while now. I'd love to get your feedback on your experience.")}>
                                                    <p className="text-sm">Feedback Collection</p>
                                                </div>
                                            </>
                                        )}
                                        {selectedAgentData?.role === 'Gold Shop Agent' && (
                                            <>
                                                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setCustomPrompt("Hello! I'm reaching out regarding our latest gold investment opportunities. Would you like to hear about our current rates?")}>
                                                    <p className="text-sm">Investment Opportunity</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => setCustomPrompt("Hi there! We've just received a new collection of premium gold jewelry. Would you be interested in a private viewing?")}>
                                                    <p className="text-sm">New Collection</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-semibold">Recent Test Calls</h3>
                        <Button variant="ghost" className="text-gray-500">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {callHistory.map((call) => (
                                    <tr key={call.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{call.number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {voiceAgents.find(a => a.id === selectedTestAgent)?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{call.startTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {new Date(new Date(call.endTime).getTime() - new Date(call.startTime).getTime()).getMinutes()}m
                                        </td>
                                        <td className="px-6 py-4 text-sm max-w-md">
                                            <p className="truncate">{call.summary}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                call.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                                                call.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {call.sentiment}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                    <Button variant="ghost" className="flex-1 sm:flex-none">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="ghost" className="flex-1 sm:flex-none">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="ghost" className="flex-1 sm:flex-none">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            <Tabs
                tabs={[
                    { id: 'campaigns', label: 'Campaigns', icon: <Phone className="w-4 h-4" /> },
                    { id: 'voice-agents', label: 'Voice Agents', icon: <Mic className="w-4 h-4" /> },
                    { id: 'test-call', label: 'Test Call', icon: <Phone className="w-4 h-4" /> },
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
                        {activeTab === 'test-call' && renderTestCall()}
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
                            <Button variant="ghost" className="mt-2">
                                <Volume2 className="w-4 h-4 mr-2" />
                                Preview Voice
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="ghost" onClick={() => setShowNewAgent(false)}>
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
                    {selectedAgent && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Voice Preview</h4>
                            {selectedAgent.previewUrl ? (
                                <audio controls className="w-full">
                                    <source src={selectedAgent.previewUrl} type="audio/mp3" />
                                    Your browser does not support the audio element.
                                </audio>
                            ) : (
                                <p className="text-sm text-gray-500">No preview available</p>
                            )}
                        </div>
                    )}
                    <textarea
                        className="w-full h-32 resize-none border rounded-lg p-2"
                        placeholder="Enter text to preview voice..."
                    />
                    <div className="flex justify-end space-x-3">
                        <Button variant="ghost" onClick={() => setSelectedAgent(null)}>
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
