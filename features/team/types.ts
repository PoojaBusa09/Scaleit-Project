
export interface OrgNode {
    id: number;
    name: string;
    title: string;
    children?: OrgNode[];
}

export interface Member {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    company: string;
    industry: string;
    plan: string;
    city: string;
    state: string;
    masterMindGroup: string;
    mentors: string[];
    years: number;
    engagement: number;
}

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    avatarUrl: string;
    bio?: string;
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
    skills?: string[];
    tenantId?: string;
    email?: string;
}
