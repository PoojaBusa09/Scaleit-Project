import { Mentor, MentorClient } from '../features/mentor/types.ts';
import { ScaleITSection } from '../features/shared/types.ts';
import { professionalAvatars } from './mockUsers.ts';

export const SCALEIT_METHOD_STRUCTURE: ScaleITSection[] = [
    {
        id: 'S',
        name: 'Strategic Vision',
        tools: [
            { name: 'My Strategic Plan', path: '/strategic-vision' },
            { name: '15 Scalable Models', path: '/tools/scalable-models' },
            { name: 'Gap Analysis', path: '/gap-analysis' },
            { name: 'North Star Metrics', path: '/north-star-metrics' }
        ]
    },
    {
        id: 'C',
        name: 'Cash Flow',
        tools: [
            { name: 'Sales & Marketing Blueprint', path: '/sales-marketing-blueprint' },
            { name: 'Perfect Client Decoder', path: '/perfect-client-decoder' },
            { name: 'Champion Customer Journey', path: '/champion-customer-journey' },
            { name: 'Marketing Methods', path: '/marketing-methods' }
        ]
    },
    {
        id: 'A',
        name: 'Alliance of the Team',
        tools: [
            { name: 'Perfect Employee Decoder', path: '/tools/perfect-employee-decoder' },
            { name: '4 Superpowers', path: '/tools/4-superpowers' },
            { name: 'My Success Team', path: '/tools/my-success-team' },
            { name: 'Hire for Growth', path: '/tools/hiring-assistant' },
            { name: 'Hero Team Journey', path: '/tools/hero-team-journey' },
            { name: 'Org Chart Builder', path: '/tools/org-chart' }
        ]
    },
    {
        id: 'L',
        name: 'Leadership',
        tools: [
            { name: 'Leadership Assessment', path: '/leadership-assessment' },
            { name: 'Old Story / New Story', path: '/tools/old-story-new-story' },
            { name: 'Money Mindset Equation', path: '/tools/money-mindset-equation' },
            { name: 'Fear Leaping', path: '/tools/fear-leaping' }
        ]
    },
    {
        id: 'E',
        name: 'Execution',
        tools: [
            { name: 'Quarterly Reflections', path: '/tools/quarterly-reflections' },
            { name: 'The Systemizer', path: '/tools/the-systemizer' },
            { name: 'RoadMap', path: '/tools/roadmap' },
            { name: 'Team Retreat Builder', path: '/tools/team-retreat-builder' },
            { name: 'Brainstorm Builder', path: '/tools/brainstorm-builder' },
            { name: 'Recurring Meeting Flow', path: '/tools/recurring-meeting-flow' },
            { name: 'Quarterly Action Plan', path: '/plan' }
        ]
    },
    {
        id: 'I',
        name: 'Innovation',
        tools: [
            { name: 'Innovation PDF', path: '/resources' }
        ]
    },
    {
        id: 'T',
        name: 'Technology',
        tools: [
            { name: 'Technology Assessments', path: '/assessments' }
        ]
    }
];

export const MOCK_MENTOR_CLIENTS: MentorClient[] = [
    { id: 1, name: 'Alexandre Dubois', company: 'Innovate Inc.', avatarUrl: professionalAvatars[0], status: 'onTrack', progress: 75, lastSessionDate: '2025-07-15', industry: 'Tech', yearsInBusiness: 5, isActive: true, renewalDate: '2026-09-01', wins: ['Closed $1.2M Series A', 'Launched v2 product'], mastermindGroup: 'Tech Founders' },
    { id: 2, name: 'Isabella Rossi', company: 'Cucina Bella', avatarUrl: professionalAvatars[3], status: 'excelling', progress: 90, lastSessionDate: '2025-07-14', industry: 'Retail', yearsInBusiness: 8, isActive: true, renewalDate: '2026-12-15', wins: ['Opened 3rd location', 'Revenue up 45%'], mastermindGroup: 'Retail Leaders' },
    { id: 3, name: 'Liam Chen', company: 'Construct Co.', avatarUrl: professionalAvatars[4], status: 'atRisk', progress: 40, lastSessionDate: '2025-06-20', industry: 'Manufacturing', yearsInBusiness: 10, isActive: true, renewalDate: '2026-06-01', wins: [], mastermindGroup: 'Tech Founders' },
    { id: 4, name: 'Sarah Jenkins', company: 'BrightFuture Ed', avatarUrl: professionalAvatars[2], status: 'onTrack', progress: 65, lastSessionDate: '2025-07-10', industry: 'Education', yearsInBusiness: 4, isActive: true, renewalDate: '2026-08-20', wins: ['Hired VP of Operations'], isShared: true },
    { id: 5, name: 'Marcus Johnson', company: 'Urban logistics', avatarUrl: professionalAvatars[5], status: 'excelling', progress: 85, lastSessionDate: '2025-07-18', industry: 'Logistics', yearsInBusiness: 6, isActive: true, renewalDate: '2027-01-10', wins: ['Expanded to 3 new markets', 'Landed Fortune 500 contract'] },
    { id: 6, name: 'Elena Rodriguez', company: 'Green Earth', avatarUrl: professionalAvatars[6], status: 'atRisk', progress: 30, lastSessionDate: '2025-06-15', industry: 'Energy', yearsInBusiness: 2, isActive: false, renewalDate: '2026-03-15', wins: [], isShared: true },
    { id: 7, name: 'Thomas Wright', company: 'Wright Design', avatarUrl: professionalAvatars[7], status: 'onTrack', progress: 55, lastSessionDate: '2025-07-05', industry: 'Creative', yearsInBusiness: 7, isActive: true, renewalDate: '2026-11-01', wins: ['Won Webby Award'] },
];

export const MOCK_MENTORS: Mentor[] = [
    { id: 1, name: 'Jordan Lee', avatarUrl: professionalAvatars[1], specialties: ['SaaS', 'Marketing'], clientCount: 4, assignedClients: [MOCK_MENTOR_CLIENTS[0]], schedulingUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ...' },
    { id: 2, name: 'Maria Garcia', avatarUrl: professionalAvatars[5], specialties: ['E-commerce', 'Finance'], clientCount: 3, assignedClients: [MOCK_MENTOR_CLIENTS[1]], schedulingUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ...' },
    { id: 3, name: 'David Chen', avatarUrl: professionalAvatars[6], specialties: ['B2B Sales', 'Operations'], clientCount: 5, assignedClients: [MOCK_MENTOR_CLIENTS[2]], schedulingUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ...' },
    { id: 4, name: 'Emily Carter', avatarUrl: professionalAvatars[7], specialties: ['Leadership', 'HR'], clientCount: 4, assignedClients: [], schedulingUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ...' },
];

export const MOCK_UNASSIGNED_CLIENTS: MentorClient[] = [
    { id: 4, name: 'Nia Adebayo', company: 'Healthful Foods', avatarUrl: 'https://i.pravatar.cc/150?u=nia', status: 'onTrack', progress: 0, lastSessionDate: '', industry: 'Retail', yearsInBusiness: 1 },
    { id: 5, name: 'Kenji Tanaka', company: 'CodeStream', avatarUrl: 'https://i.pravatar.cc/150?u=kenji', status: 'onTrack', progress: 0, lastSessionDate: '', industry: 'Tech', yearsInBusiness: 3 },
];


export const MOCK_MENTOR_USER = {
    id: 1,
    name: 'Jordan Lee',
    avatarUrl: professionalAvatars[1],
    email: 'jordan@scaleit.com',
    role: 'Mentor'
};

export const MOCK_ORG_CHART = { id: 1, name: 'Alexandre Dubois', title: 'CEO', children: [{ id: 2, name: 'Sofia Rodriguez', title: 'COO', children: [{ id: 4, name: 'Liam Chen', title: 'Operations Manager' }] }, { id: 3, name: 'Ben Carter', title: 'CTO', children: [{ id: 5, name: 'Ava Patel', title: 'Lead Engineer' }] }] };
