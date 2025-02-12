import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DataTable } from '../ui/DataTable';
import { StatusPill } from '../ui/StatusPill';
import { MessageSquare, Phone, Mail, AlertCircle } from 'lucide-react';
import { KanbanBoard } from '../ui/KanbanBoard';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'new' | 'contacted' | 'engaged' | 'converted' | 'unresponsive';
    channel: 'whatsapp' | 'sms' | 'voice' | 'email';
    score: number;
    lastContact: string;
}

const mockLeads: Lead[] = [
    {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'new',
        channel: 'whatsapp',
        score: 85,
        lastContact: '2024-02-15'
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1987654321',
        status: 'engaged',
        channel: 'sms',
        score: 92,
        lastContact: '2024-02-14'
    },
    {
        id: '3',
        name: 'Mike Brown',
        email: 'mike@example.com',
        phone: '+1122334455',
        status: 'unresponsive',
        channel: 'email',
        score: 45,
        lastContact: '2024-02-10'
    }
];

const ChannelIcon = ({ channel }: { channel: Lead['channel'] }) => {
    const icons = {
        whatsapp: <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-whatsapp-green" />,
        sms: <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />,
        voice: <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />,
        email: <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
    };
    return icons[channel];
};

export const LeadsTab: React.FC = () => {
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
            cell: (info: any) => (
                <div className="flex items-center gap-2">
                    <ChannelIcon channel={info.row.original.channel} />
                    <span className="text-sm sm:text-base">{info.getValue()}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (info: any) => <StatusPill status={info.getValue()} />
        },
        {
            header: 'Score',
            accessorKey: 'score',
            cell: (info: any) => (
                <div className="flex items-center">
                    <span className={`text-sm sm:text-base font-medium ${
                        info.getValue() < 50 ? 'text-red-500' : 
                        info.getValue() < 70 ? 'text-yellow-500' : 
                        'text-green-500'
                    }`}>
                        {info.getValue()}
                    </span>
                    {info.getValue() < 50 && (
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 ml-2" />
                    )}
                </div>
            )
        },
        {
            header: 'Last Contact',
            accessorKey: 'lastContact',
            cell: (info: any) => (
                <span className="text-sm sm:text-base">{info.getValue()}</span>
            )
        },
        {
            header: 'Actions',
            cell: () => (
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                    View Details
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('table')}
                        className="flex-1 sm:flex-none"
                    >
                        Table View
                    </Button>
                    <Button
                        variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('kanban')}
                        className="flex-1 sm:flex-none"
                    >
                        Kanban View
                    </Button>
                </div>
                <Button className="w-full sm:w-auto">Import Leads</Button>
            </div>

            {viewMode === 'table' ? (
                <Card className="p-3 sm:p-6">
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                        <DataTable
                            columns={columns}
                            data={mockLeads}
                            pagination
                            className="min-w-[700px]"
                        />
                    </div>
                </Card>
            ) : (
                <div className="overflow-x-auto -mx-3 sm:mx-0 pb-4">
                    <div className="min-w-[800px] px-3 sm:px-0">
                        <KanbanBoard
                            columns={[
                                {
                                    id: 'new',
                                    title: 'New Leads',
                                    items: mockLeads.filter(lead => lead.status === 'new').map(lead => ({
                                        id: lead.id,
                                        title: lead.name,
                                        description: `${lead.email} • ${lead.phone}`,
                                        status: lead.status
                                    })),
                                    color: 'bg-blue-400'
                                },
                                {
                                    id: 'contacted',
                                    title: 'Contacted',
                                    items: mockLeads.filter(lead => lead.status === 'contacted').map(lead => ({
                                        id: lead.id,
                                        title: lead.name,
                                        description: `${lead.email} • ${lead.phone}`,
                                        status: lead.status
                                    })),
                                    color: 'bg-yellow-400'
                                },
                                {
                                    id: 'engaged',
                                    title: 'Engaged',
                                    items: mockLeads.filter(lead => lead.status === 'engaged').map(lead => ({
                                        id: lead.id,
                                        title: lead.name,
                                        description: `${lead.email} • ${lead.phone}`,
                                        status: lead.status
                                    })),
                                    color: 'bg-green-400'
                                },
                                {
                                    id: 'converted',
                                    title: 'Converted',
                                    items: mockLeads.filter(lead => lead.status === 'converted').map(lead => ({
                                        id: lead.id,
                                        title: lead.name,
                                        description: `${lead.email} • ${lead.phone}`,
                                        status: lead.status
                                    })),
                                    color: 'bg-purple-400'
                                },
                                {
                                    id: 'unresponsive',
                                    title: 'Unresponsive',
                                    items: mockLeads.filter(lead => lead.status === 'unresponsive').map(lead => ({
                                        id: lead.id,
                                        title: lead.name,
                                        description: `${lead.email} • ${lead.phone}`,
                                        status: lead.status
                                    })),
                                    color: 'bg-red-400'
                                }
                            ]}
                            onItemMove={(itemId, sourceColumn, targetColumn) => {
                                console.log(`Moving lead ${itemId} from ${sourceColumn} to ${targetColumn}`);
                                // TODO: Implement lead status update logic
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};