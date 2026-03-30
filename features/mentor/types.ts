
export type ClientStatus = 'onTrack' | 'atRisk' | 'excelling';

export interface MentorClient {
    id: number;
    name: string;
    company: string;
    avatarUrl: string;
    status: ClientStatus;
    tenantId?: string;
    progress: number;
    lastSessionDate: string;
    industry: string;
    yearsInBusiness: number;
    isActive?: boolean;
    renewalDate?: string;
    wins?: string[];
    isShared?: boolean;
    mastermindGroup?: string;
}

export interface Mentor {
    id: number;
    name: string;
    avatarUrl: string;
    specialties: string[];
    clientCount: number;
    schedulingUrl?: string;
    assignedClients: Pick<MentorClient, 'id' | 'name' | 'avatarUrl'>[];
}

export interface SuggestedActionItem {
    text: string;
    assignee: 'Mentor' | 'Client';
}

export interface MentorMatch extends Mentor {
    matchScore: number;
    reason: string;
}


