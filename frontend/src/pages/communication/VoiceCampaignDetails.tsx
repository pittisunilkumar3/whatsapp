import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    ArrowLeftIcon,
    PhoneIcon,
    ChartBarIcon,
    ClockIcon,
    UsersIcon,
    CalendarIcon,
    PlayIcon,
    PauseIcon,
    StopIcon,
    ArrowDownTrayIcon,
    DocumentTextIcon,
    MicrophoneIcon,
    Cog6ToothIcon,
    ChartBarSquareIcon
} from '@heroicons/react/24/outline';
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

interface CallRecord {
    id: string;
    phoneNumber: string;
    duration: string;
    status: 'completed' | 'failed' | 'no-answer';
    timestamp: string;
    recordingUrl?: string;
    transcription?: string;
}

interface CampaignDetails {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'paused' | 'completed';
    voiceType: string;
    script: string;
    callAttempts: number;
    retryInterval: number;
    maxCallDuration: number;
    callStartTime: string;
    callEndTime: string;
    totalCalls: number;
    completedCalls: number;
    successRate: number;
    averageDuration: string;
    reachRate: number;
    startDate: string;
    lastRun: string;
    enableTranscription: boolean;
    enableRecording: boolean;
    sentimentScore: number;
    averageCallQuality: number;
    callCompletionRate: number;
    positiveResponseRate: number;
    negativeResponseRate: number;
    neutralResponseRate: number;
    averageResponseTime: string;
    peakCallHours: { hour: string; count: number }[];
    callTrends: { date: string; calls: number; success: number }[];
    commonKeywords: { word: string; count: number }[];
    agentPerformance: {
        accuracy: number;
        clarity: number;
        engagement: number;
        adherenceToScript: number;
    };
}

export const VoiceCampaignDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
    const [callRecords, setCallRecords] = useState<CallRecord[]>([]);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'calls' | 'analytics'>('overview');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch campaign details from API
        // This is mock data for now
        setCampaign({
            id: '1',
            name: 'Sales Follow-up Q1',
            description: 'Automated follow-up calls for Q1 sales leads',
            status: 'active',
            voiceType: 'female_natural',
            script: 'Hi {customer_name}, this is {agent_name} from {company_name}...',
            callAttempts: 3,
            retryInterval: 24,
            maxCallDuration: 180,
            callStartTime: '09:00',
            callEndTime: '18:00',
            totalCalls: 1500,
            completedCalls: 750,
            successRate: 68,
            averageDuration: '2m 30s',
            reachRate: 85,
            startDate: '2024-02-01',
            lastRun: '2024-02-10 08:30 AM',
            enableTranscription: true,
            enableRecording: true,
            sentimentScore: 7.8,
            averageCallQuality: 92,
            callCompletionRate: 85,
            positiveResponseRate: 45,
            negativeResponseRate: 15,
            neutralResponseRate: 40,
            averageResponseTime: '8.5s',
            peakCallHours: [
                { hour: '09:00', count: 120 },
                { hour: '10:00', count: 180 },
                { hour: '11:00', count: 150 },
                { hour: '14:00', count: 160 },
                { hour: '15:00', count: 140 }
            ],
            callTrends: [
                { date: '2024-02-01', calls: 300, success: 240 },
                { date: '2024-02-02', calls: 280, success: 230 },
                { date: '2024-02-03', calls: 320, success: 270 }
            ],
            commonKeywords: [
                { word: 'interested', count: 145 },
                { word: 'pricing', count: 98 },
                { word: 'features', count: 76 },
                { word: 'consider', count: 65 }
            ],
            agentPerformance: {
                accuracy: 95,
                clarity: 88,
                engagement: 92,
                adherenceToScript: 96
            }
        });

        setCallRecords([
            {
                id: '1',
                phoneNumber: '+1234567890',
                duration: '2m 15s',
                status: 'completed',
                timestamp: '2024-02-10 08:30 AM',
                recordingUrl: 'https://example.com/recording1.mp3',
                transcription: 'Hello, this is regarding your recent inquiry...'
            },
            // Add more mock call records
        ]);

        setIsLoading(false);
    }, [id]);

    const handleStatusChange = (newStatus: 'active' | 'paused' | 'completed') => {
        if (campaign) {
            // TODO: Update campaign status via API
            setCampaign({ ...campaign, status: newStatus });
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold flex items-center text-gray-900">
                        <DocumentTextIcon className="w-5 h-5 mr-2 text-primary" />
                        Campaign Information
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Description</h3>
                            <p className="mt-1 text-gray-900">{campaign?.description}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                            <p className="mt-1 text-gray-900">{campaign?.startDate}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Last Run</h3>
                            <p className="mt-1 text-gray-900">{campaign?.lastRun}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <p className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    campaign?.status === 'active' ? 'bg-green-100 text-green-800' :
                                    campaign?.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {campaign?.status.charAt(0).toUpperCase() + campaign?.status.slice(1)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold flex items-center text-gray-900">
                        <MicrophoneIcon className="w-5 h-5 mr-2 text-primary" />
                        Voice Settings
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Voice Type</h3>
                            <p className="mt-1 text-gray-900">{campaign?.voiceType}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Script</h3>
                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">{campaign?.script}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold flex items-center text-gray-900">
                        <Cog6ToothIcon className="w-5 h-5 mr-2 text-primary" />
                        Call Settings
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Call Window</h3>
                            <p className="mt-1 text-gray-900">{campaign?.callStartTime} - {campaign?.callEndTime}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Max Duration</h3>
                            <p className="mt-1 text-gray-900">{campaign?.maxCallDuration} seconds</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Call Attempts</h3>
                            <p className="mt-1 text-gray-900">{campaign?.callAttempts}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Retry Interval</h3>
                            <p className="mt-1 text-gray-900">{campaign?.retryInterval} hours</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Recording</h3>
                            <p className="mt-1 text-gray-900">{campaign?.enableRecording ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Transcription</h3>
                            <p className="mt-1 text-gray-900">{campaign?.enableTranscription ? 'Enabled' : 'Disabled'}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderCalls = () => (
        <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Call Records</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {callRecords.map((record) => (
                            <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.phoneNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.duration}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        record.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        record.status === 'failed' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {record.timestamp}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex space-x-2">
                                        {record.recordingUrl && (
                                            <Button variant="ghost" size="sm">
                                                <PlayIcon className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {record.transcription && (
                                            <Button variant="ghost" size="sm">
                                                <DocumentTextIcon className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    const renderAnalytics = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center">
                        <PhoneIcon className="w-8 h-8 text-primary mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Total Calls</p>
                            <p className="text-2xl font-semibold">{campaign?.totalCalls}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <ChartBarSquareIcon className="w-8 h-8 text-green-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Success Rate</p>
                            <p className="text-2xl font-semibold">{campaign?.successRate}%</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <ClockIcon className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Avg Duration</p>
                            <p className="text-2xl font-semibold">{campaign?.averageDuration}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <UsersIcon className="w-8 h-8 text-purple-500 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Reach Rate</p>
                            <p className="text-2xl font-semibold">{campaign?.reachRate}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Call Performance</h3>
                <div className="h-[300px]">
                    <Line
                        data={{
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [
                                {
                                    label: 'Completed Calls',
                                    data: [65, 59, 80, 81, 56, 55, 40],
                                    borderColor: 'rgb(75, 192, 192)',
                                    tension: 0.1
                                },
                                {
                                    label: 'Failed Calls',
                                    data: [28, 48, 40, 19, 86, 27, 90],
                                    borderColor: 'rgb(255, 99, 132)',
                                    tension: 0.1
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top' as const,
                                }
                            }
                        }}
                    />
                </div>
            </Card>
        </div>
    );

    const renderQuickStats = () => (
        <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Sentiment Score</p>
                            <h3 className="text-2xl font-bold mt-1">{campaign?.sentimentScore?.toFixed(1) ?? 'N/A'}/10</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            (campaign?.sentimentScore ?? 0) >= 7 ? 'bg-green-100' :
                            (campaign?.sentimentScore ?? 0) >= 5 ? 'bg-yellow-100' :
                            'bg-red-100'
                        }`}>
                            <ChartBarSquareIcon className={`w-6 h-6 ${
                                (campaign?.sentimentScore ?? 0) >= 7 ? 'text-green-600' :
                                (campaign?.sentimentScore ?? 0) >= 5 ? 'text-yellow-600' :
                                'text-red-600'
                            }`} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600">↑ 0.5</span>
                        <span className="text-gray-500 ml-2">from last week</span>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Call Quality</p>
                            <h3 className="text-2xl font-bold mt-1">{campaign?.averageCallQuality}%</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <PhoneIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600">↑ 2%</span>
                        <span className="text-gray-500 ml-2">from last month</span>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Response Rate</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-green-600 text-sm">+{campaign?.positiveResponseRate}%</span>
                                <span className="text-red-600 text-sm">-{campaign?.negativeResponseRate}%</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <UsersIcon className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${campaign?.positiveResponseRate}%` }}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Avg Response Time</p>
                            <h3 className="text-2xl font-bold mt-1">{campaign?.averageResponseTime}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                            <ClockIcon className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600">↓ 1.2s</span>
                        <span className="text-gray-500 ml-2">improvement</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-500">Accuracy</span>
                                <span className="text-sm font-medium">{campaign?.agentPerformance.accuracy}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${campaign?.agentPerformance.accuracy}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-500">Clarity</span>
                                <span className="text-sm font-medium">{campaign?.agentPerformance.clarity}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${campaign?.agentPerformance.clarity}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-500">Engagement</span>
                                <span className="text-sm font-medium">{campaign?.agentPerformance.engagement}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-purple-500 h-2 rounded-full"
                                    style={{ width: `${campaign?.agentPerformance.engagement}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-500">Script Adherence</span>
                                <span className="text-sm font-medium">{campaign?.agentPerformance.adherenceToScript}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full"
                                    style={{ width: `${campaign?.agentPerformance.adherenceToScript}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Common Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                        {campaign?.commonKeywords.map((keyword) => (
                            <div
                                key={keyword.word}
                                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                            >
                                <span className="font-medium">{keyword.word}</span>
                                <span className="text-gray-500 ml-2">{keyword.count}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    if (isLoading || !campaign) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="mr-4"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
                            <p className="text-sm text-gray-500 mt-1">Campaign Details</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {campaign.status === 'active' ? (
                            <Button onClick={() => handleStatusChange('paused')} variant="secondary">
                                <PauseIcon className="w-4 h-4 mr-2" />
                                Pause Campaign
                            </Button>
                        ) : campaign.status === 'paused' ? (
                            <Button onClick={() => handleStatusChange('active')} variant="secondary">
                                <PlayIcon className="w-4 h-4 mr-2" />
                                Resume Campaign
                            </Button>
                        ) : null}
                        <Button onClick={() => handleStatusChange('completed')} variant="secondary">
                            <StopIcon className="w-4 h-4 mr-2" />
                            End Campaign
                        </Button>
                        <Button variant="secondary">
                            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {renderQuickStats()}

                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setSelectedTab('overview')}
                                className={`${
                                    selectedTab === 'overview'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setSelectedTab('calls')}
                                className={`${
                                    selectedTab === 'calls'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Call Records
                            </button>
                            <button
                                onClick={() => setSelectedTab('analytics')}
                                className={`${
                                    selectedTab === 'analytics'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Analytics
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="mt-6">
                    {selectedTab === 'overview' && renderOverview()}
                    {selectedTab === 'calls' && renderCalls()}
                    {selectedTab === 'analytics' && renderAnalytics()}
                </div>
            </div>
        </div>
    );
}; 