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
    ChartBarSquareIcon,
    CheckCircleIcon
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
import { useAuthStore } from '~/store/authStore';

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
    id: number;
    name: string;
    description: string;
    status: 'draft' | 'active' | 'paused' | 'completed';
    company_id: number;
    working_days: string[];
    team_members: any[];
    tags: string[];
    created_at: string;
    updated_at: string;
    owner_id: number;
    leads: {
        total: number;
        completed: number;
        successful: number;
        failed: number;
        noAnswer: number;
        successRate: number;
        averageDuration: number;
    };
    metrics: {
        accuracy: number;
        clarity: number;
        engagement: number;
        adherenceToScript: number;
        sentimentScore: number;
        averageCallQuality: number;
        positiveResponseRate: number;
        negativeResponseRate: number;
        averageResponseTime: string;
        commonKeywords: Array<{
            word: string;
            count: number;
        }>;
    };
}

export const VoiceCampaignDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'calls' | 'analytics'>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        if (type === 'success') {
            // toast.success(message);
        } else {
            // toast.error(message);
        }
    };

    useEffect(() => {
        const fetchCampaignDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                if (!user?.company?.id) {
                    throw new Error('Authentication required. Please log in.');
                }

                const response = await fetch(`/api/voice-campaigns/${id}?company_id=${user.company.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch campaign details');
                }

                const data = await response.json();
                if (data.data) {
                    setCampaign(data.data);
                }
            } catch (error) {
                console.error('Error fetching campaign details:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch campaign details');
                showNotification(error instanceof Error ? error.message : 'Failed to fetch campaign details', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCampaignDetails();
        }
    }, [id, user?.company?.id]);

    const handleStart = async () => {
        try {
            await makeApiRequest('/start');
            showNotification('Campaign started successfully');
        } catch (error) {
            console.error('Failed to start campaign:', error);
            showNotification(error instanceof Error ? error.message : 'Failed to start campaign', 'error');
        }
    };

    const handlePause = async () => {
        try {
            await makeApiRequest('/pause');
            showNotification('Campaign paused successfully');
        } catch (error) {
            console.error('Failed to pause campaign:', error);
            showNotification(error instanceof Error ? error.message : 'Failed to pause campaign', 'error');
        }
    };

    const handleResume = async () => {
        try {
            await makeApiRequest('/resume');
            showNotification('Campaign resumed successfully');
        } catch (error) {
            console.error('Failed to resume campaign:', error);
            showNotification(error instanceof Error ? error.message : 'Failed to resume campaign', 'error');
        }
    };

    const makeApiRequest = async (endpoint: string, method: string = 'POST') => {
        if (!user?.company?.id) {
            throw new Error('Authentication required. Please log in.');
        }

        const response = await fetch(`/api/voice-campaigns/${id}${endpoint}?company_id=${user.company.id}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update campaign status');
        }

        const data = await response.json();
        if (data.data) {
            setCampaign(data.data);
        }
        return data;
    };

    const renderOverviewTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Campaign Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="mt-1">{campaign?.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="mt-1">{campaign?.description}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <p className="mt-1 capitalize">{campaign?.status}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Working Days</label>
                        <p className="mt-1">{campaign?.working_days?.join(', ')}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Created At</label>
                        <p className="mt-1">{new Date(campaign?.created_at || '').toLocaleString()}</p>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Lead Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Leads</p>
                        <p className="text-2xl font-semibold">{campaign?.leads?.total || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Completed Calls</p>
                        <p className="text-2xl font-semibold">{campaign?.leads?.completed || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Successful Calls</p>
                        <p className="text-2xl font-semibold">{campaign?.leads?.successful || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="text-2xl font-semibold">{campaign?.leads?.successRate || 0}%</p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Accuracy</p>
                        <p className="text-2xl font-semibold">{campaign?.metrics?.accuracy || 0}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Clarity</p>
                        <p className="text-2xl font-semibold">{campaign?.metrics?.clarity || 0}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Engagement</p>
                        <p className="text-2xl font-semibold">{campaign?.metrics?.engagement || 0}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Script Adherence</p>
                        <p className="text-2xl font-semibold">{campaign?.metrics?.adherenceToScript || 0}%</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Common Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                        {campaign?.metrics?.commonKeywords?.map((keyword, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {keyword.word} ({keyword.count})
                            </span>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full">{error}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{campaign?.name}</h2>
                <div className="space-x-4">
                    {campaign?.status === 'draft' && (
                        <Button onClick={handleStart}>Start Campaign</Button>
                    )}
                    {campaign?.status === 'active' && (
                        <Button onClick={handlePause}>Pause Campaign</Button>
                    )}
                    {campaign?.status === 'paused' && (
                        <Button onClick={handleResume}>Resume Campaign</Button>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setSelectedTab('overview')}
                            className={`${
                                selectedTab === 'overview'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setSelectedTab('calls')}
                            className={`${
                                selectedTab === 'calls'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Calls
                        </button>
                        <button
                            onClick={() => setSelectedTab('analytics')}
                            className={`${
                                selectedTab === 'analytics'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Analytics
                        </button>
                    </nav>
                </div>
            </div>

            {selectedTab === 'overview' && renderOverviewTab()}
            {selectedTab === 'calls' && <div>Calls tab content</div>}
            {selectedTab === 'analytics' && <div>Analytics tab content</div>}
        </div>
    );
};