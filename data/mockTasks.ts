import { Task } from '../types.ts';

export const MOCK_TASKS: Task[] = [
    { id: 1, text: 'Finalize Q3 marketing budget', completed: false, isWin: false, quarter: 'this', dueDate: '2025-07-20', category: 'C', timeSpent: 45, notes: 'Need to review last year\'s spend first.' },
    { id: 2, text: 'Interview candidates for Senior Developer role', completed: false, isWin: false, quarter: 'this', category: 'A', timeSpent: 120 },
    { id: 3, text: 'Launch new website feature', completed: true, isWin: true, quarter: 'this', winDate: '2025-07-10', category: 'E', timeSpent: 480 },
    { id: 4, text: 'Onboard new marketing intern', completed: true, isWin: false, quarter: 'this', category: 'A' },
    { id: 5, text: 'Plan annual team offsite', completed: false, isWin: false, quarter: 'next', category: 'L' },
    { id: 6, text: 'Research new CRM software', completed: false, isWin: false, quarter: 'this', sourceSessionId: '1', category: 'E', notes: 'Comparing HubSpot and Salesforce.' },
    { id: 7, text: 'Explore expansion into European market', completed: false, isWin: false, quarter: 'next', category: 'S' },
    { id: 8, text: 'Develop Q4 product roadmap', completed: false, isWin: false, quarter: 'backlog', category: 'S' },
];

export const MOCK_IDEAS = [
    { id: 1, text: 'Create a podcast about our industry.', tags: ['marketing', 'content'], createdAt: '2025-07-12' },
    { id: 2, text: 'Gamify the user onboarding experience.', tags: ['product', 'ux'], createdAt: '2025-07-10' },
];
