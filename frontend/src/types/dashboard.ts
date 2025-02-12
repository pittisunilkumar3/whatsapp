import { LucideIcon } from 'lucide-react';

export type Channel = 'all' | 'whatsapp' | 'sms' | 'voice' | 'email';

export interface DashboardMetric {
	label: string;
	value: number | string;
	change: string;
	trend: 'up' | 'down';
	icon: LucideIcon;
	color: string;
}

export interface ChannelMetrics {
	messagesSent?: number;
	responseRate?: number;
	avgResponseTime?: string;
	conversionRate: number;
	callsMade?: number;
	answerRate?: number;
	avgCallDuration?: string;
	emailsSent?: number;
	openRate?: number;
	clickRate?: number;
}

export interface ActivityItem {
	id: string;
	leadName: string;
	action: string;
	time: string;
	status: 'active' | 'warning' | 'inactive';
}
