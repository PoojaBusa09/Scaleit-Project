/**
 * Session Service
 * Handles session CRUD operations, lifecycle management, and integration
 * with Zoom and AI processing services.
 */

import {
    Session,
    SessionStatus,
    ProcessedSession,
    ScaleItPillar
} from '../../types';
import {
    CreateSessionRequest,
    UpdateSessionRequest,
    SessionFilters,
    SessionListResponse,
    SessionLifecycleEvent,
    SessionLifecycleLog
} from './types';
import * as zoomService from '../../services/zoomService';
import * as aiProcessingService from '../../services/aiProcessingService';

// =============================================================================
// Mock Data Store
// =============================================================================

const SESSIONS_STORE: Map<string, Session> = new Map();
const LIFECYCLE_LOGS: SessionLifecycleLog[] = [];
const PROCESSED_SESSIONS: Map<string, ProcessedSession> = new Map();

// =============================================================================
// Session CRUD
// =============================================================================

/**
 * Create a new session
 */
export async function createSession(request: CreateSessionRequest): Promise<Session> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Zoom meeting if requested
    let zoomMeeting;
    if (request.createZoomMeeting) {
        zoomMeeting = await zoomService.createMeeting({
            topic: request.title,
            startTime: request.scheduledAt,
            duration: request.duration,
            timeZone: request.timeZone,
            hostEmail: 'mentor@pgn.com', // Would come from mentor lookup
            participantEmails: ['member@company.com'], // Would come from member lookup
            sessionId
        });
    }

    const session: Session = {
        id: sessionId,
        type: request.type,
        status: 'scheduled',

        memberId: request.memberId,
        memberName: 'Member', // Would lookup from user service
        mentorId: request.mentorId,
        mentorName: request.mentorId ? 'Mentor' : undefined,

        title: request.title,
        description: request.description,
        scheduledAt: request.scheduledAt,
        duration: request.duration,
        timeZone: request.timeZone,

        zoomMeeting,
        recordingStatus: 'pending',

        aiProcessed: false,

        scaleItPillars: [],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    SESSIONS_STORE.set(sessionId, session);
    logLifecycleEvent(sessionId, 'created');
    logLifecycleEvent(sessionId, 'scheduled');

    return session;
}

/**
 * Get a session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
    return SESSIONS_STORE.get(sessionId) ?? null;
}

/**
 * Update a session
 */
export async function updateSession(
    sessionId: string,
    updates: UpdateSessionRequest
): Promise<Session> {
    const session = SESSIONS_STORE.get(sessionId);
    if (!session) {
        throw new Error(`Session ${sessionId} not found`);
    }

    const updated: Session = {
        ...session,
        title: updates.title ?? session.title,
        description: updates.description ?? session.description,
        scheduledAt: updates.scheduledAt ?? session.scheduledAt,
        duration: updates.duration ?? session.duration,
        status: updates.status ?? session.status,
        updatedAt: new Date().toISOString()
    };

    // Update Zoom meeting if exists and time changed
    if (session.zoomMeeting && updates.scheduledAt) {
        updated.zoomMeeting = await zoomService.updateMeeting(session.zoomMeeting.id, {
            startTime: updates.scheduledAt,
            duration: updates.duration,
            topic: updates.title
        });
    }

    if (updates.status === 'cancelled') {
        logLifecycleEvent(sessionId, 'cancelled');
        if (session.zoomMeeting) {
            await zoomService.deleteMeeting(session.zoomMeeting.id);
        }
    }

    SESSIONS_STORE.set(sessionId, updated);
    return updated;
}

/**
 * List sessions with filters
 */
export async function listSessions(filters: SessionFilters = {}): Promise<SessionListResponse> {
    let sessions = Array.from(SESSIONS_STORE.values());

    // Apply filters
    if (filters.status?.length) {
        sessions = sessions.filter(s => filters.status!.includes(s.status));
    }
    if (filters.type?.length) {
        sessions = sessions.filter(s => filters.type!.includes(s.type));
    }
    if (filters.memberId) {
        sessions = sessions.filter(s => s.memberId === filters.memberId);
    }
    if (filters.mentorId) {
        sessions = sessions.filter(s => s.mentorId === filters.mentorId);
    }
    if (filters.hasRecording !== undefined) {
        sessions = sessions.filter(s =>
            filters.hasRecording ? s.recordingStatus === 'ready' : s.recordingStatus !== 'ready'
        );
    }
    if (filters.isProcessed !== undefined) {
        sessions = sessions.filter(s => s.aiProcessed === filters.isProcessed);
    }
    if (filters.dateFrom) {
        sessions = sessions.filter(s => new Date(s.scheduledAt) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
        sessions = sessions.filter(s => new Date(s.scheduledAt) <= new Date(filters.dateTo!));
    }

    // Sort by date descending
    sessions.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

    return {
        sessions,
        total: sessions.length,
        page: 1,
        pageSize: sessions.length
    };
}

// =============================================================================
// Session Lifecycle Management
// =============================================================================

/**
 * Start a session (when meeting begins)
 */
export async function startSession(sessionId: string): Promise<Session> {
    const session = SESSIONS_STORE.get(sessionId);
    if (!session) {
        throw new Error(`Session ${sessionId} not found`);
    }

    const updated: Session = {
        ...session,
        status: 'in_progress',
        updatedAt: new Date().toISOString()
    };

    SESSIONS_STORE.set(sessionId, updated);
    logLifecycleEvent(sessionId, 'started');

    return updated;
}

/**
 * End a session (when meeting ends)
 */
export async function endSession(sessionId: string): Promise<Session> {
    const session = SESSIONS_STORE.get(sessionId);
    if (!session) {
        throw new Error(`Session ${sessionId} not found`);
    }

    const updated: Session = {
        ...session,
        status: 'completed',
        recordingStatus: 'processing',
        updatedAt: new Date().toISOString()
    };

    SESSIONS_STORE.set(sessionId, updated);
    logLifecycleEvent(sessionId, 'ended');

    // Trigger recording fetch (async)
    fetchAndProcessRecording(sessionId);

    return updated;
}

/**
 * Mark session as no-show
 */
export async function markNoShow(sessionId: string): Promise<Session> {
    const session = SESSIONS_STORE.get(sessionId);
    if (!session) {
        throw new Error(`Session ${sessionId} not found`);
    }

    const updated: Session = {
        ...session,
        status: 'no_show',
        updatedAt: new Date().toISOString()
    };

    SESSIONS_STORE.set(sessionId, updated);

    return updated;
}

// =============================================================================
// Recording & AI Processing
// =============================================================================

/**
 * Fetch recording and process with AI
 */
async function fetchAndProcessRecording(sessionId: string): Promise<void> {
    const session = SESSIONS_STORE.get(sessionId);
    if (!session || !session.zoomMeeting) {
        return;
    }

    try {
        // Fetch recording
        const recording = await zoomService.fetchRecording(session.zoomMeeting.id);
        if (!recording) {
            updateSessionField(sessionId, 'recordingStatus', 'not_recorded');
            return;
        }

        // Update session with recording
        updateSessionField(sessionId, 'recording', recording);
        updateSessionField(sessionId, 'recordingStatus', 'ready');
        logLifecycleEvent(sessionId, 'recording_ready');

        // Process transcript
        const transcript = await zoomService.processTranscript(recording);
        updateSessionField(sessionId, 'transcript', transcript);

        // AI processing
        logLifecycleEvent(sessionId, 'processing');
        const processed = await aiProcessingService.processTranscript(transcript);

        // Store processed results
        PROCESSED_SESSIONS.set(sessionId, processed);

        // Update session with AI results
        updateSessionField(sessionId, 'aiProcessed', true);
        updateSessionField(sessionId, 'aiProcessedAt', new Date().toISOString());
        updateSessionField(sessionId, 'scaleItPillars', processed.scaleItTags);

        logLifecycleEvent(sessionId, 'processed');

    } catch (error) {
        console.error(`[SessionService] Failed to process session ${sessionId}:`, error);
        updateSessionField(sessionId, 'recordingStatus', 'failed');
    }
}

/**
 * Get processed session data
 */
export async function getProcessedSession(sessionId: string): Promise<ProcessedSession | null> {
    return PROCESSED_SESSIONS.get(sessionId) ?? null;
}

/**
 * Manually trigger AI processing for a session with transcript
 */
export async function processSessionManually(sessionId: string): Promise<ProcessedSession | null> {
    const session = SESSIONS_STORE.get(sessionId);
    if (!session || !session.transcript) {
        return null;
    }

    logLifecycleEvent(sessionId, 'processing');
    const processed = await aiProcessingService.processTranscript(session.transcript);

    PROCESSED_SESSIONS.set(sessionId, processed);
    updateSessionField(sessionId, 'aiProcessed', true);
    updateSessionField(sessionId, 'aiProcessedAt', new Date().toISOString());
    updateSessionField(sessionId, 'scaleItPillars', processed.scaleItTags);

    logLifecycleEvent(sessionId, 'processed');

    return processed;
}

// =============================================================================
// Lifecycle Logging
// =============================================================================

function logLifecycleEvent(sessionId: string, event: SessionLifecycleEvent, metadata?: Record<string, unknown>): void {
    LIFECYCLE_LOGS.push({
        sessionId,
        event,
        timestamp: new Date().toISOString(),
        metadata
    });
    console.log(`[SessionService] ${sessionId}: ${event}`);
}

/**
 * Get lifecycle logs for a session
 */
export function getSessionLifecycleLogs(sessionId: string): SessionLifecycleLog[] {
    return LIFECYCLE_LOGS.filter(log => log.sessionId === sessionId);
}

// =============================================================================
// Utility Functions
// =============================================================================

function updateSessionField<K extends keyof Session>(
    sessionId: string,
    field: K,
    value: Session[K]
): void {
    const session = SESSIONS_STORE.get(sessionId);
    if (session) {
        (session as any)[field] = value;
        session.updatedAt = new Date().toISOString();
        SESSIONS_STORE.set(sessionId, session);
    }
}

/**
 * Get upcoming sessions for a user
 */
export async function getUpcomingSessions(userId: string, limit = 5): Promise<Session[]> {
    const now = new Date();
    const { sessions } = await listSessions({
        memberId: userId,
        status: ['scheduled']
    });

    return sessions
        .filter(s => new Date(s.scheduledAt) > now)
        .slice(0, limit);
}

/**
 * Get recent sessions for a user
 */
export async function getRecentSessions(userId: string, limit = 5): Promise<Session[]> {
    const { sessions } = await listSessions({
        memberId: userId,
        status: ['completed']
    });

    return sessions.slice(0, limit);
}

/**
 * Get sessions pending review (processed but not approved)
 */
export async function getPendingReviewSessions(mentorId: string): Promise<Session[]> {
    const { sessions } = await listSessions({
        mentorId,
        isProcessed: true
    });

    // Filter to those with pending AI outputs
    return sessions.filter(s => {
        const processed = PROCESSED_SESSIONS.get(s.id);
        if (!processed) return false;

        return processed.commitments.some(c => c.aiMetadata.status === 'pending') ||
            processed.decisions.some(d => d.aiMetadata.status === 'pending');
    });
}

export default {
    createSession,
    getSession,
    updateSession,
    listSessions,
    startSession,
    endSession,
    markNoShow,
    getProcessedSession,
    processSessionManually,
    getSessionLifecycleLogs,
    getUpcomingSessions,
    getRecentSessions,
    getPendingReviewSessions
};
