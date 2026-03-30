
import { UserRole } from '../shared/types';

export interface Campaign {
    id: string;
    name: string;
    audienceId: string;
    audienceName: string;
    status: 'Draft' | 'Scheduled' | 'Sent' | 'Active';
    sentCount: number;
    openRate?: number;
    clickRate?: number;
    scheduledDate?: string;
    subject: string;
    tenantId?: string;
}

export interface Audience {
    id: string;
    name: string;
    count: number;
    lastUsed?: string;
    filters?: {
        role?: UserRole[];
        plan?: string[];
        status?: string[];

    };
    tenantId?: string;
}
