/**
 * Mock Messages Data
 * Comprehensive messaging mock data with 1-on-1 and group conversations
 */

import { Conversation, ChatMessage, Announcement } from '../features/communication/types';

// =============================================================================
// Users for Messaging
// =============================================================================

export const MESSAGING_USERS = [
    { id: 'user_1', name: 'Alexandre Dubois', avatarUrl: 'https://i.pravatar.cc/150?u=alex', role: 'Member', online: true },
    { id: 'user_2', name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/150?u=jordan', role: 'Mentor', online: true },
    { id: 'user_3', name: 'Sarah Mitchell', avatarUrl: 'https://i.pravatar.cc/150?u=sarah', role: 'Member', online: false },
    { id: 'user_4', name: 'Michael Chen', avatarUrl: 'https://i.pravatar.cc/150?u=michael', role: 'Mentor', online: true },
    { id: 'user_5', name: 'Emily Rodriguez', avatarUrl: 'https://i.pravatar.cc/150?u=emily', role: 'Admin', online: false },
    { id: 'user_6', name: 'David Kim', avatarUrl: 'https://i.pravatar.cc/150?u=david', role: 'Member', online: true },
    { id: 'user_7', name: 'Lisa Thompson', avatarUrl: 'https://i.pravatar.cc/150?u=lisa', role: 'Member', online: false },
    { id: 'user_8', name: 'James Wilson', avatarUrl: 'https://i.pravatar.cc/150?u=james', role: 'Mentor', online: true },
];

// =============================================================================
// Conversations (1-on-1 and Groups)
// =============================================================================

export const MOCK_CONVERSATIONS: Conversation[] = [
    // 1-on-1 Conversations
    {
        id: 'conv_1',
        name: 'Jordan Lee',
        avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
        online: true,
        lastMessage: 'Great progress on the Q3 goals! Let\'s discuss the CRM selection tomorrow.',
        timestamp: '2 min ago',
        unreadCount: 2,
        role: 'Mentor'
    },
    {
        id: 'conv_2',
        name: 'Michael Chen',
        avatarUrl: 'https://i.pravatar.cc/150?u=michael',
        online: true,
        lastMessage: 'I reviewed your financial forecasts - looking solid!',
        timestamp: '15 min ago',
        unreadCount: 0,
        role: 'Mentor'
    },
    {
        id: 'conv_3',
        name: 'Sarah Mitchell',
        avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
        online: false,
        lastMessage: 'Thanks for the referral! The new client is onboarding well.',
        timestamp: '1 hour ago',
        unreadCount: 1,
        role: 'Member'
    },
    {
        id: 'conv_4',
        name: 'Emily Rodriguez',
        avatarUrl: 'https://i.pravatar.cc/150?u=emily',
        online: false,
        lastMessage: 'Your subscription has been updated. Let me know if you need anything.',
        timestamp: 'Yesterday',
        unreadCount: 0,
        role: 'Admin'
    },
    {
        id: 'conv_5',
        name: 'David Kim',
        avatarUrl: 'https://i.pravatar.cc/150?u=david',
        online: true,
        lastMessage: 'Would love to connect about the marketing strategy',
        timestamp: 'Yesterday',
        unreadCount: 0,
        role: 'Member'
    },
];

// Group Conversations
export const MOCK_GROUP_CONVERSATIONS: Conversation[] = [
    {
        id: 'group_1',
        name: 'Q3 Strategy Team',
        avatarUrl: '', // Groups use initials
        online: false,
        lastMessage: 'Jordan: Let\'s sync on the roadmap updates',
        timestamp: '30 min ago',
        unreadCount: 5,
        role: 'Team'
    },
    {
        id: 'group_2',
        name: 'Scale CEO Mastermind',
        avatarUrl: '',
        online: false,
        lastMessage: 'Sarah: Has anyone tried the new AI features?',
        timestamp: '2 hours ago',
        unreadCount: 12,
        role: 'Team'
    },
    {
        id: 'group_3',
        name: 'Leadership Circle',
        avatarUrl: '',
        online: false,
        lastMessage: 'Michael: Workshop slides are uploaded',
        timestamp: 'Yesterday',
        unreadCount: 0,
        role: 'Team'
    },
    {
        id: 'group_4',
        name: 'Mentor Pod - West Coast',
        avatarUrl: '',
        online: false,
        lastMessage: 'James: Client handoff complete for Thompson account',
        timestamp: '2 days ago',
        unreadCount: 0,
        role: 'Team'
    },
];

// =============================================================================
// Announcements / Posts (Feed Interface)
// =============================================================================

export const MOCK_POSTS: Announcement[] = [
    {
        id: 'post_1',
        title: 'New SCALEIT Method® Pillar: Innovation',
        content: `We are excited to announce the official launch of the "I" (Innovation) pillar in the SCALEIT Method® section. 

This pillar focuses on fostering a culture of creative problem-solving and systematic innovation within your organization. New tools include the "Innovation Audit" and "Systematic Inventive Thinking (SIT)" workshop templates.

Check it out now in the SCALEIT Method® tab!`,
        author: 'Pinnacle Team',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PN&backgroundColor=0C2340&textColor=ffffff',
        timestamp: '2 hours ago',
        category: 'New Feature',
        imageUrl: 'https://images.unsplash.com/photo-1454165833762-02c019946401?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'post_2',
        title: 'Q3 Goal Setting Workshop',
        content: `Join us next Tuesday for an interactive session on setting aggressive yet achievable Q3 goals. We'll be using the new Revenue Projection templates and discussing how to align your team's OKRs with your growth milestones.

Location: Zoom (link in Sessions)
Time: 2:00 PM EST`,
        author: 'Jordan Lee',
        authorAvatar: 'https://i.pravatar.cc/150?u=jordan',
        timestamp: 'Yesterday',
        category: 'Events',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'post_3',
        title: 'Community Feature Update',
        content: `Based on your feedback, we've simplified the navigation to focus on core growth tools. The Community Forum and Member Directory have been moved to a temporary archive as we redesign them for a more integrated experience.

Stay tuned for more updates!`,
        author: 'Pinnacle Product',
        authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PP&backgroundColor=C89720&textColor=ffffff',
        timestamp: '2 days ago',
        category: 'Update',
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'post_4',
        title: 'Mastermind Spotlight: Sarah Mitchell',
        content: `Meet Sarah Mitchell, founder of Elevate Dynamics. Sarah recently scaled her team from 5 to 25 using the SCALEIT "T" (Team) pillar strategies.

Read her full story on how she automated her onboarding process to save 20 hours a week.`,
        author: 'James Wilson',
        authorAvatar: 'https://i.pravatar.cc/150?u=james',
        timestamp: '3 days ago',
        category: 'Spotlight',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
    }
];

// =============================================================================
// Message Threads
// =============================================================================

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
    // Jordan Lee (Mentor) - Active mentoring conversation
    'conv_1': [
        {
            id: 'msg_1_1',
            text: 'Hi Alexandre! Ready for our Q3 strategy session today?',
            sender: 'Jordan Lee',
            timestamp: '9:00 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
            senderType: 'peer'
        },
        {
            id: 'msg_1_2',
            text: 'Yes! I\'ve prepared the revenue projections and team org chart updates.',
            sender: 'You',
            timestamp: '9:05 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'msg_1_3',
            text: 'Perfect. I also want to discuss the CRM decision. Have you narrowed down your options?',
            sender: 'Jordan Lee',
            timestamp: '9:07 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
            senderType: 'peer'
        },
        {
            id: 'msg_1_4',
            text: 'I\'m between HubSpot and Salesforce. HubSpot seems more user-friendly for our team size, but Salesforce has better integrations.',
            sender: 'You',
            timestamp: '9:10 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'msg_1_5',
            text: 'Good analysis. For a team of 15-20, HubSpot is often the better choice. The learning curve is lower and you can always migrate later. Let\'s make that our decision today.',
            sender: 'Jordan Lee',
            timestamp: '9:12 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
            senderType: 'peer'
        },
        {
            id: 'msg_1_ai',
            text: 'Based on your conversation, I recommend creating an action item: "Complete HubSpot trial signup by Friday" with Alexandre as owner.',
            sender: 'Pinnacle AI',
            timestamp: '9:13 AM',
            avatarUrl: '',
            senderType: 'ai-suggestion'
        },
        {
            id: 'msg_1_6',
            text: 'Great progress on the Q3 goals! Let\'s discuss the CRM selection tomorrow.',
            sender: 'Jordan Lee',
            timestamp: '2:30 PM',
            avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
            senderType: 'peer'
        },
        {
            id: 'msg_1_7',
            text: 'Also, I noticed your team hired 2 new people. How\'s onboarding going?',
            sender: 'Jordan Lee',
            timestamp: '2:31 PM',
            avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
            senderType: 'peer'
        },
    ],

    // Michael Chen (Mentor) - Financial discussion
    'conv_2': [
        {
            id: 'msg_2_1',
            text: 'Alexandre, I just reviewed your financial forecasts for Q4.',
            sender: 'Michael Chen',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            senderType: 'peer'
        },
        {
            id: 'msg_2_2',
            text: 'How do they look? I was conservative on the revenue projections.',
            sender: 'You',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'msg_2_3',
            text: 'Actually, I think you could be more aggressive. Your Q3 actuals exceeded projections by 18%. The market conditions support a 15% growth target.',
            sender: 'Michael Chen',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            senderType: 'peer'
        },
        {
            id: 'msg_2_4',
            text: 'That makes sense. I was being cautious because of the new hires.',
            sender: 'You',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'msg_2_5',
            text: 'I reviewed your financial forecasts - looking solid! Consider bumping the Q4 target to $180K.',
            sender: 'Michael Chen',
            timestamp: '15 min ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            senderType: 'peer'
        },
    ],

    // Sarah Mitchell (Member) - Peer networking
    'conv_3': [
        {
            id: 'msg_3_1',
            text: 'Hey Alexandre! I heard you had a great session with Jordan about scaling.',
            sender: 'Sarah Mitchell',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
            senderType: 'peer'
        },
        {
            id: 'msg_3_2',
            text: 'Yes! It was super helpful. We worked through some org chart challenges.',
            sender: 'You',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'msg_3_3',
            text: 'I\'m dealing with similar issues. Would you mind sharing some insights?',
            sender: 'Sarah Mitchell',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
            senderType: 'peer'
        },
        {
            id: 'msg_3_4',
            text: 'Of course! The biggest insight was separating strategic roles from operational ones. Happy to chat more about it.',
            sender: 'You',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'msg_3_5',
            text: 'Thanks for the referral! The new client is onboarding well.',
            sender: 'Sarah Mitchell',
            timestamp: '1 hour ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
            senderType: 'peer'
        },
    ],

    // Emily Rodriguez (Admin) - Support conversation
    'conv_4': [
        {
            id: 'msg_4_1',
            text: 'Hi Alexandre, this is Emily from PGN Support. I see you requested a subscription upgrade.',
            sender: 'Emily Rodriguez',
            timestamp: '2 days ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=emily',
            senderType: 'peer'
        },
        {
            id: 'msg_4_2',
            text: 'Yes, I need to add 3 team member seats to my Scale CEO plan.',
            sender: 'You',
            timestamp: '2 days ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'msg_4_3',
            text: 'Perfect! I\'ve processed that for you. The new seats are active immediately. Your next invoice will reflect the prorated charges.',
            sender: 'Emily Rodriguez',
            timestamp: '2 days ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=emily',
            senderType: 'peer'
        },
        {
            id: 'msg_4_4',
            text: 'Your subscription has been updated. Let me know if you need anything.',
            sender: 'Emily Rodriguez',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=emily',
            senderType: 'peer'
        },
    ],

    // David Kim (Member) - Networking
    'conv_5': [
        {
            id: 'msg_5_1',
            text: 'Hey Alexandre! I saw your post in the community forum about lead gen.',
            sender: 'David Kim',
            timestamp: '3 days ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=david',
            senderType: 'peer'
        },
        {
            id: 'msg_5_2',
            text: 'Thanks for reaching out! What questions do you have?',
            sender: 'You',
            timestamp: '3 days ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'msg_5_3',
            text: 'Would love to connect about the marketing strategy',
            sender: 'David Kim',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=david',
            senderType: 'peer'
        },
    ],

    // Q3 Strategy Team (Group)
    'group_1': [
        {
            id: 'grp1_1',
            text: 'Team, let\'s align on the Q3 roadmap before Friday\'s review.',
            sender: 'Jordan Lee',
            timestamp: '10:00 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
            senderType: 'peer'
        },
        {
            id: 'grp1_2',
            text: 'I\'ve uploaded the updated Gantt chart to the shared drive.',
            sender: 'You',
            timestamp: '10:15 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'grp1_3',
            text: 'Great work! I see the CRM migration is now on schedule.',
            sender: 'Sarah Mitchell',
            timestamp: '10:20 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
            senderType: 'peer'
        },
        {
            id: 'grp1_4',
            text: 'Can we discuss the budget allocation for the new hires?',
            sender: 'Michael Chen',
            timestamp: '10:45 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            senderType: 'peer'
        },
        {
            id: 'grp1_5',
            text: 'Let\'s sync on the roadmap updates',
            sender: 'Jordan Lee',
            timestamp: '30 min ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
            senderType: 'peer'
        },
    ],

    // Scale CEO Mastermind (Group)
    'group_2': [
        {
            id: 'grp2_1',
            text: 'Good morning everyone! Quick wins from this week?',
            sender: 'James Wilson',
            timestamp: '8:00 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=james',
            senderType: 'peer'
        },
        {
            id: 'grp2_2',
            text: 'Closed our biggest deal yet - $150K annual contract! 🎉',
            sender: 'David Kim',
            timestamp: '8:15 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=david',
            senderType: 'peer'
        },
        {
            id: 'grp2_3',
            text: 'That\'s amazing David! What was the key to landing it?',
            sender: 'You',
            timestamp: '8:20 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=alex',
            senderType: 'user'
        },
        {
            id: 'grp2_4',
            text: 'Focused on the ROI story instead of features. Jordan helped me refine the pitch.',
            sender: 'David Kim',
            timestamp: '8:25 AM',
            avatarUrl: 'https://i.pravatar.cc/150?u=david',
            senderType: 'peer'
        },
        {
            id: 'grp2_5',
            text: 'Has anyone tried the new AI features?',
            sender: 'Sarah Mitchell',
            timestamp: '2 hours ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
            senderType: 'peer'
        },
    ],

    // Leadership Circle (Group)
    'group_3': [
        {
            id: 'grp3_1',
            text: 'Reminder: Leadership workshop this Thursday at 2 PM EST',
            sender: 'Michael Chen',
            timestamp: 'Monday',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            senderType: 'peer'
        },
        {
            id: 'grp3_2',
            text: 'Looking forward to it! Will there be breakout sessions?',
            sender: 'Lisa Thompson',
            timestamp: 'Monday',
            avatarUrl: 'https://i.pravatar.cc/150?u=lisa',
            senderType: 'peer'
        },
        {
            id: 'grp3_3',
            text: 'Yes, we\'ll have 3 breakout rooms focused on different leadership styles.',
            sender: 'Michael Chen',
            timestamp: 'Monday',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            senderType: 'peer'
        },
        {
            id: 'grp3_4',
            text: 'Workshop slides are uploaded',
            sender: 'Michael Chen',
            timestamp: 'Yesterday',
            avatarUrl: 'https://i.pravatar.cc/150?u=michael',
            senderType: 'peer'
        },
    ],

    // Mentor Pod (Group)
    'group_4': [
        {
            id: 'grp4_1',
            text: 'Completed handoff for the Thompson account. All docs are in the shared folder.',
            sender: 'James Wilson',
            timestamp: '2 days ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=james',
            senderType: 'peer'
        },
        {
            id: 'grp4_2',
            text: 'Thanks James! I\'ll schedule the intro call for next week.',
            sender: 'Jordan Lee',
            timestamp: '2 days ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
            senderType: 'peer'
        },
        {
            id: 'grp4_3',
            text: 'Client handoff complete for Thompson account',
            sender: 'James Wilson',
            timestamp: '2 days ago',
            avatarUrl: 'https://i.pravatar.cc/150?u=james',
            senderType: 'peer'
        },
    ],
};

// =============================================================================
// Group Details
// =============================================================================

export interface GroupDetails {
    id: string;
    name: string;
    description: string;
    members: typeof MESSAGING_USERS;
    createdAt: string;
    adminIds: string[];
}

export const MOCK_GROUP_DETAILS: Record<string, GroupDetails> = {
    'group_1': {
        id: 'group_1',
        name: 'Q3 Strategy Team',
        description: 'Cross-functional team for Q3 strategic initiatives',
        members: [MESSAGING_USERS[0], MESSAGING_USERS[1], MESSAGING_USERS[2], MESSAGING_USERS[3]],
        createdAt: '2025-07-01',
        adminIds: ['user_2']
    },
    'group_2': {
        id: 'group_2',
        name: 'Scale CEO Mastermind',
        description: 'Peer group for Scale CEOs to share wins and challenges',
        members: [MESSAGING_USERS[0], MESSAGING_USERS[2], MESSAGING_USERS[5], MESSAGING_USERS[6], MESSAGING_USERS[7]],
        createdAt: '2025-01-15',
        adminIds: ['user_8']
    },
    'group_3': {
        id: 'group_3',
        name: 'Leadership Circle',
        description: 'Monthly leadership development discussions',
        members: [MESSAGING_USERS[0], MESSAGING_USERS[3], MESSAGING_USERS[6]],
        createdAt: '2025-03-01',
        adminIds: ['user_4']
    },
    'group_4': {
        id: 'group_4',
        name: 'Mentor Pod - West Coast',
        description: 'West coast mentors coordination hub',
        members: [MESSAGING_USERS[1], MESSAGING_USERS[3], MESSAGING_USERS[7]],
        createdAt: '2025-02-01',
        adminIds: ['user_2', 'user_4']
    },
};

// =============================================================================
// Helper Functions
// =============================================================================

export function getAllConversations(): Conversation[] {
    return [...MOCK_CONVERSATIONS, ...MOCK_GROUP_CONVERSATIONS];
}

export function getMessages(conversationId: string): ChatMessage[] {
    return MOCK_MESSAGES[conversationId] || [];
}

export function isGroupConversation(conversationId: string): boolean {
    return conversationId.startsWith('group_');
}

export function getGroupDetails(groupId: string): GroupDetails | null {
    return MOCK_GROUP_DETAILS[groupId] || null;
}

export function getGroupInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}
