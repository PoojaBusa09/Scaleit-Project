import { AdminKPI, SystemMetric, AuditLog, AssessmentAttempt } from '../types.ts';

export const LEADERSHIP_ASSESSMENT_QUESTIONS: string[] = ["I clearly communicate the company vision to my team.", "My team understands how their work contributes to the company's goals.", "I provide regular, constructive feedback to my direct reports.", "I delegate tasks effectively and trust my team to complete them.", "I hold regular one-on-one meetings with each direct report.", "I actively listen to my team's ideas and concerns.", "I empower my team to make decisions within their roles.", "I hold myself and my team accountable for results.", "I invest in the professional development of my team members.", "I lead by example and embody our company's core values.", "I effectively manage conflict within the team."];

export const MOCK_ADMIN_KPIS: AdminKPI[] = [{ title: 'Active Members', value: '842', change: 5, period: 'month' }, { title: 'Monthly Recurring Revenue', value: '$126.3k', change: 2.1, period: 'month' }, { title: 'Member Churn Rate', value: '1.2%', change: -10, period: 'month' }, { title: 'Mentor Utilization', value: '88%', change: 3, period: 'month' }];

export const MOCK_ASSESSMENT_HISTORY: AssessmentAttempt[] = [{ id: 'a1', date: '2025-07-01', version: '2.0', score: 85 }, { id: 'a2', date: '2025-04-02', version: '1.0', score: 72 }];

export const MOCK_SYSTEM_METRICS: SystemMetric[] = [
    { id: '1', name: 'API Uptime', value: '99.98', unit: '%', change: 0.01 },
    { id: '2', name: 'Active Users (24h)', value: '1.2k', unit: '', change: 5 },
    { id: '3', name: 'Avg. API Response', value: '120', unit: 'ms', change: -8 },
    { id: '4', name: 'DB Connections', value: '85', unit: '/100', change: 2 },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: '1', timestamp: '2025-07-16 10:32 AM', user: 'Casey Miller', action: 'ROLE_UPDATED', details: 'Updated permissions for Mentor role.' },
    { id: '2', timestamp: '2025-07-16 09:15 AM', user: 'System', action: 'DB_BACKUP', details: 'Database backup completed successfully.' },
    { id: '3', timestamp: '2025-07-15 04:00 PM', user: 'Casey Miller', action: 'USER_IMPERSONATION_END', details: 'Stopped impersonating Alex Dubois.' },
    { id: '4', timestamp: '2025-07-15 03:55 PM', user: 'Casey Miller', action: 'USER_IMPERSONATION_START', details: 'Started impersonating Alex Dubois.' },
];
