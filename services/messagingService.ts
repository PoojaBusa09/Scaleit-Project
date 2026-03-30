/**
 * Messaging Service
 * Handles in-app messaging with AI-powered thread summarization,
 * notifications, and file sharing.
 */

import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Conversation } from '../features/communication/types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// =============================================================================
// Types
// =============================================================================

export interface MessageThread {
    id: string;
    conversationId: string;
    messages: ChatMessage[];
    participants: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ThreadSummary {
    id: string;
    threadId: string;
    summary: string;
    keyPoints: string[];
    actionItems: { text: string; assignee?: string }[];
    decisions: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    generatedAt: string;
}

export interface Notification {
    id: string;
    type: 'message' | 'mention' | 'reply' | 'event' | 'reminder' | 'system';
    title: string;
    body: string;
    link?: string;
    read: boolean;
    createdAt: string;
}

export interface FileAttachment {
    id: string;
    messageId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
    uploadedAt: string;
}

// =============================================================================
// Data Store (Mock)
// =============================================================================

const THREADS: Map<string, MessageThread> = new Map();
const SUMMARIES: Map<string, ThreadSummary> = new Map();
const NOTIFICATIONS: Notification[] = [];

// =============================================================================
// Thread Management
// =============================================================================

/**
 * Create a new message thread
 */
export function createThread(
    conversationId: string,
    participants: string[]
): MessageThread {
    const thread: MessageThread = {
        id: `thread_${Date.now()}`,
        conversationId,
        messages: [],
        participants,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    THREADS.set(thread.id, thread);
    return thread;
}

/**
 * Add message to thread
 */
export function addMessage(
    threadId: string,
    message: Omit<ChatMessage, 'id'>
): ChatMessage {
    const thread = THREADS.get(threadId);
    if (!thread) {
        throw new Error(`Thread ${threadId} not found`);
    }

    const newMessage: ChatMessage = {
        ...message,
        id: `msg_${Date.now()}`
    };

    thread.messages.push(newMessage);
    thread.updatedAt = new Date().toISOString();

    // Create notifications for other participants
    thread.participants
        .filter(p => p !== message.sender)
        .forEach(participant => {
            createNotification({
                type: 'message',
                title: `New message from ${message.sender}`,
                body: message.text.slice(0, 100),
                link: `/messages?thread=${threadId}`
            });
        });

    return newMessage;
}

/**
 * Get thread by ID
 */
export function getThread(threadId: string): MessageThread | null {
    return THREADS.get(threadId) ?? null;
}

/**
 * Get threads for a conversation
 */
export function getThreadsForConversation(conversationId: string): MessageThread[] {
    return Array.from(THREADS.values())
        .filter(t => t.conversationId === conversationId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

// =============================================================================
// AI Thread Summarization
// =============================================================================

/**
 * Generate AI summary for a message thread
 */
export async function summarizeThread(threadId: string): Promise<ThreadSummary> {
    const thread = THREADS.get(threadId);
    if (!thread) {
        throw new Error(`Thread ${threadId} not found`);
    }

    if (thread.messages.length === 0) {
        throw new Error('Cannot summarize empty thread');
    }

    const messagesText = thread.messages
        .map(m => `${m.sender}: ${m.text}`)
        .join('\n');

    const prompt = `Analyze this message thread and provide a structured summary.

Messages:
${messagesText}

Provide:
1. A brief summary (2-3 sentences)
2. Key points discussed (bullet points)
3. Any action items mentioned (with assignee if identifiable)
4. Decisions made
5. Overall sentiment (positive/neutral/negative)

Respond in JSON:
{
  "summary": "string",
  "keyPoints": ["string"],
  "actionItems": [{ "text": "string", "assignee": "string or null" }],
  "decisions": ["string"],
  "sentiment": "positive|neutral|negative"
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text ?? '{}');

        const summary: ThreadSummary = {
            id: `summary_${Date.now()}`,
            threadId,
            summary: result.summary || 'No summary available',
            keyPoints: result.keyPoints || [],
            actionItems: result.actionItems || [],
            decisions: result.decisions || [],
            sentiment: ['positive', 'neutral', 'negative'].includes(result.sentiment)
                ? result.sentiment
                : 'neutral',
            generatedAt: new Date().toISOString()
        };

        SUMMARIES.set(summary.id, summary);
        return summary;
    } catch (error) {
        console.error('[MessagingService] Thread summarization failed:', error);
        return {
            id: `summary_${Date.now()}`,
            threadId,
            summary: 'Unable to generate summary',
            keyPoints: [],
            actionItems: [],
            decisions: [],
            sentiment: 'neutral',
            generatedAt: new Date().toISOString()
        };
    }
}

/**
 * Get cached summary for thread
 */
export function getThreadSummary(threadId: string): ThreadSummary | null {
    return Array.from(SUMMARIES.values())
        .find(s => s.threadId === threadId) ?? null;
}

/**
 * Quick summarize recent messages (for long threads)
 */
export async function summarizeRecentMessages(
    threadId: string,
    messageCount: number = 20
): Promise<string> {
    const thread = THREADS.get(threadId);
    if (!thread || thread.messages.length === 0) {
        return 'No messages to summarize';
    }

    const recentMessages = thread.messages.slice(-messageCount);
    const messagesText = recentMessages
        .map(m => `${m.sender}: ${m.text}`)
        .join('\n');

    const prompt = `Summarize these recent messages in 1-2 sentences:

${messagesText}

Provide just the summary, no formatting.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text || 'No summary available';
    } catch (error) {
        return 'Unable to summarize messages';
    }
}

// =============================================================================
// Notifications
// =============================================================================

/**
 * Create a notification
 */
export function createNotification(
    data: Omit<Notification, 'id' | 'read' | 'createdAt'>
): Notification {
    const notification: Notification = {
        ...data,
        id: `notif_${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString()
    };

    NOTIFICATIONS.unshift(notification);
    return notification;
}

/**
 * Get unread notifications
 */
export function getUnreadNotifications(): Notification[] {
    return NOTIFICATIONS.filter(n => !n.read);
}

/**
 * Get all notifications
 */
export function getAllNotifications(limit: number = 50): Notification[] {
    return NOTIFICATIONS.slice(0, limit);
}

/**
 * Mark notification as read
 */
export function markAsRead(notificationId: string): void {
    const notification = NOTIFICATIONS.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
    }
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
    NOTIFICATIONS.forEach(n => n.read = true);
}

// =============================================================================
// File Sharing (Mock)
// =============================================================================

/**
 * Upload file attachment (mock)
 */
export function uploadAttachment(
    messageId: string,
    file: { name: string; type: string; size: number }
): FileAttachment {
    const attachment: FileAttachment = {
        id: `file_${Date.now()}`,
        messageId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: `https://storage.example.com/files/${file.name}`,
        uploadedAt: new Date().toISOString()
    };

    return attachment;
}

// =============================================================================
// Smart Reply Suggestions
// =============================================================================

/**
 * Generate smart reply suggestions based on context
 */
export async function getSmartReplySuggestions(
    threadId: string
): Promise<string[]> {
    const thread = THREADS.get(threadId);
    if (!thread || thread.messages.length === 0) {
        return ['Thanks!', 'Got it', 'I\'ll look into this'];
    }

    const lastMessage = thread.messages[thread.messages.length - 1];

    const prompt = `Given this message, suggest 3 short, natural replies:

Message: "${lastMessage.text}"

Provide 3 brief reply options (1-10 words each) as a JSON array:
["reply1", "reply2", "reply3"]`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const suggestions = JSON.parse(response.text ?? '[]');
        return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
    } catch (error) {
        return ['Thanks!', 'Got it', 'I\'ll get back to you'];
    }
}

export default {
    // Thread Management
    createThread,
    addMessage,
    getThread,
    getThreadsForConversation,

    // AI Summarization
    summarizeThread,
    getThreadSummary,
    summarizeRecentMessages,

    // Notifications
    createNotification,
    getUnreadNotifications,
    getAllNotifications,
    markAsRead,
    markAllAsRead,

    // File Sharing
    uploadAttachment,

    // Smart Replies
    getSmartReplySuggestions
};
