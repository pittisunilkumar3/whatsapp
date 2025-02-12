import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Phone, BarChart2, Clock, Users } from 'lucide-react';

interface VoiceCampaignCardProps {
    campaign: {
        id: string;
        name: string;
        status: 'active' | 'paused' | 'completed';
        totalCalls: number;
        successRate: number;
        duration: string;
        reachRate: number;
    };
    onViewDetails: (id: string) => void;
}

export const VoiceCampaignCard: React.FC<VoiceCampaignCardProps> = ({
    campaign,
    onViewDetails,
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold">{campaign.name}</h3>
                        <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                                campaign.status
                            )}`}
                        >
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(campaign.id)}
                    >
                        View Details
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Total Calls</p>
                            <p className="font-semibold">{campaign.totalCalls}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <BarChart2 className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Success Rate</p>
                            <p className="font-semibold">{campaign.successRate}%</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold">{campaign.duration}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Reach Rate</p>
                            <p className="font-semibold">{campaign.reachRate}%</p>
                        </div>
                    </div>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${campaign.successRate}%` }}
                    />
                </div>
            </div>
        </Card>
    );
};
