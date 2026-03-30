import { Conversation, ChatMessage, ForumChannel, ForumPost, SupportTicket, TeamMember } from '../types.ts';
import { professionalAvatars } from './mockUsers.ts';

export const MOCK_CONVERSATIONS: Conversation[] = [
    { id: 'c1', name: 'Jordan Lee (Mentor)', avatarUrl: professionalAvatars[1], online: true, lastMessage: 'Great, let\'s discuss that in our next session.', timestamp: '10:45 AM', unreadCount: 1, role: 'Mentor' },
    { id: 'c2', name: 'MasterMind Group Alpha', avatarUrl: `https://api.dicebear.com/8.x/shapes/svg?seed=groupalpha`, online: false, lastMessage: 'Anyone have experience with international shipping?', timestamp: 'Yesterday', unreadCount: 0, role: 'Member' },
    { id: 'c3', name: 'Scale Support', avatarUrl: `https://ui-avatars.com/api/?name=Scale+Support&background=0c2340&color=fff`, online: true, lastMessage: 'Your ticket #1025 has been updated.', timestamp: 'Yesterday', unreadCount: 2, role: 'Admin' },
    { id: 'c4', name: 'Sarah Jones', avatarUrl: professionalAvatars[2], online: false, lastMessage: 'Thanks for the referral!', timestamp: '2 days ago', unreadCount: 0, role: 'Member' },
];

export const MOCK_MESSAGES: { [key: string]: ChatMessage[] } = {
    'c1': [
        { id: 'm1', text: 'Hi Alexandre, just wanted to follow up on our last session. How is the CRM research going?', sender: 'Jordan Lee', timestamp: '10:40 AM', avatarUrl: professionalAvatars[1], senderType: 'peer' },
        { id: 'm2', text: 'Hey Jordan! It\'s going well. I\'ve narrowed it down to two options. I\'ll have a decision by end of day.', sender: 'Alexandre Dubois', timestamp: '10:42 AM', avatarUrl: professionalAvatars[0], senderType: 'user' },
        { id: 'm3', text: 'When you have a moment, ask me "What are the key factors to consider when choosing a CRM?"', sender: 'Pinnacle AI', timestamp: '10:43 AM', avatarUrl: '', senderType: 'ai-suggestion' },
    ]
};

export const MOCK_FORUM_CHANNELS: ForumChannel[] = [{ id: 'general', name: 'General Discussion', description: 'Talk about anything related to business.' }, { id: 'marketing', name: 'Marketing & Sales', description: 'Strategies for growth.' }, { id: 'tech', name: 'Technology & SaaS', description: 'Discuss tools and tech.' }];

export const MOCK_FORUM_POSTS: ForumPost[] = [{ id: 'p1', channelId: 'marketing', title: 'What CRM are you all using?', contentSnippet: 'Looking for recommendations for a small team...', author: { name: 'Isabella Rossi', avatarUrl: professionalAvatars[3] }, upvotes: 23, commentsCount: 8, timestamp: '2 hours ago' }, { id: 'p2', channelId: 'marketing', title: 'Best lead generation tactics for B2B?', contentSnippet: 'We\'ve tried cold email, but looking for something more scalable...', author: { name: 'Liam Chen', avatarUrl: professionalAvatars[4] }, upvotes: 45, commentsCount: 12, timestamp: '1 day ago' }];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [{ id: '#1024', subject: 'Billing question', category: 'Billing', status: 'Closed', lastUpdated: '2025-07-12' }, { id: '#1025', subject: 'Cannot access resources', category: 'Technical', status: 'In Progress', lastUpdated: '2025-07-15' }];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [{ id: 1, name: 'Sofia Rodriguez', role: 'COO', avatarUrl: professionalAvatars[3] }, { id: 2, name: 'Ben Carter', role: 'CTO', avatarUrl: professionalAvatars[4] }];
