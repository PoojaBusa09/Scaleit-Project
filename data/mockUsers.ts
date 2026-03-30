import { Member, AdminUser } from '../types.ts';

const professionalAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    'https://images.unsplash.com/photo-1580852300654-03c803a15e75?w=200',
    'https://images.unsplash.com/photo-1542596594-649ed6e6b342?w=200',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
];

export const MOCK_USER = {
    name: 'Alexandre Dubois',
    avatarUrl: professionalAvatars[0],
    mentors: ['Jordan Lee', 'Maria Garcia'],
    address: {
        street: '123 Innovation Drive, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
        country: 'USA'
    }
};

export const MOCK_MENTOR_USER = {
    name: 'Jordan Lee',
    avatarUrl: professionalAvatars[1]
};

export const MOCK_ADMIN_USER = {
    name: 'Casey Miller',
    avatarUrl: professionalAvatars[2]
};

export const MOCK_USERS_MAP = {
    'Member': { name: 'Alexandre Dubois', avatarUrl: professionalAvatars[0] },
    'Mentor': { name: 'Jordan Lee', avatarUrl: professionalAvatars[1] },
    'Super Admin': { name: 'Casey Miller', avatarUrl: professionalAvatars[2] },
    'Scale Team Member': { name: 'Sarah Jenkins', avatarUrl: professionalAvatars[3] },
    'Mentor Manager': { name: 'Robert Fox', avatarUrl: professionalAvatars[4] },
    'PGN Staff': { name: 'Emily Chen', avatarUrl: professionalAvatars[5] },
};

export const MOCK_MEMBERS: Member[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    firstName: `Member${i + 1}`,
    lastName: `User`,
    avatarUrl: `https://i.pravatar.cc/150?u=member${i + 1}`,
    email: `member${i + 1}@example.com`,
    phone: `(555) 123-45${i < 10 ? '0' : ''}${i}`,
    company: `Innovate Co ${i + 1}`,
    industry: ['Tech', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'][i % 5],
    plan: ['Growth', 'Pro', 'Enterprise'][i % 3],
    city: 'New York',
    state: 'NY',
    masterMindGroup: `Group ${String.fromCharCode(65 + (i % 4))}`,
    mentors: [['Jordan Lee', 'Maria Garcia'], ['David Chen'], ['Emily Carter']][i % 3],
    years: Math.random() * 10 + 1,
    engagement: Math.floor(Math.random() * 100) + 1,
}));

export const MOCK_ADMIN_USERS: AdminUser[] = [
    { id: 1, name: 'Casey Miller', avatarUrl: professionalAvatars[2], email: 'casey.m@scaleit.com', role: 'SA', lastLogin: '2025-07-16 10:30 AM', status: 'Active', tenantId: 'pgn-HQ' },
    { id: 2, name: 'Jordan Lee', avatarUrl: professionalAvatars[1], email: 'jordan.l@scaleit.com', role: 'M', lastLogin: '2025-07-16 09:00 AM', status: 'Active', tenantId: 'pgn-HQ' },
    { id: 3, name: 'Alexandre Dubois', avatarUrl: professionalAvatars[0], email: 'alex.d@example.com', role: 'EC', lastLogin: '2025-07-15 02:00 PM', status: 'Active', tenantId: 'tenant-demo' },
    { id: 4, name: 'Tom Wilson', avatarUrl: professionalAvatars[6], email: 'tom.w@scaleit.com', role: 'M', lastLogin: '2025-07-14 11:00 AM', status: 'Inactive', tenantId: 'pgn-HQ' },
];

export { professionalAvatars };
