
export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    avatarUrl: string;
    senderType: 'user' | 'peer' | 'ai-suggestion';
    status?: 'sent' | 'delivered' | 'read';
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    authorAvatar: string;
    timestamp: string;
    category: string;
    imageUrl?: string;
    tags?: string[];
}

export interface Conversation {
    id: string;
    name: string;
    avatarUrl: string;
    online: boolean;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    role?: 'Member' | 'Mentor' | 'Team' | 'Admin';
    tenantId?: string;
}

export interface ForumPostAuthor {
    name: string;
    avatarUrl: string;
}

export interface ForumPost {
    id: string;
    channelId: string;
    title: string;
    contentSnippet: string;
    author: ForumPostAuthor;
    upvotes: number;
    commentsCount: number;
    unreadCount: number;
    timestamp: string;
    tenantId?: string;
}

export interface ForumChannel {
    id: string;
    name: string;
    description: string;
}
