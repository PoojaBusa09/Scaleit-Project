/**
 * Session Types
 * Type definitions for the sessions feature module
 */

export type {
    Session,
    SessionStatus,
    SessionType,
    Recording,
    RecordingStatus,
    Transcript,
    SpeakerLabel,
    ZoomMeeting,
    ProcessedSession,
    SessionSummary,
    Decision,
    Commitment,
    RiskSignal,
    Opportunity
} from '../../shared/pgnTypes';

// Session Lifecycle Events
export type SessionLifecycleEvent =
    | 'created'
    | 'scheduled'
    | 'reminder_sent'
    | 'started'
    | 'ended'
    | 'recording_ready'
    | 'processing'
    | 'processed'
    | 'cancelled';

export interface SessionLifecycleLog {
    sessionId: string;
    event: SessionLifecycleEvent;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

// Session Creation Request
export interface CreateSessionRequest {
    type: 'mentor' | 'sales' | 'group' | 'workshop';
    title: string;
    description?: string;
    scheduledAt: string;
    duration: number; // minutes
    timeZone: string;
    memberId: string;
    mentorId?: string;
    createZoomMeeting: boolean;
}

// Session Update Request
export interface UpdateSessionRequest {
    title?: string;
    description?: string;
    scheduledAt?: string;
    duration?: number;
    status?: 'scheduled' | 'cancelled';
}

// Session Filters
export interface SessionFilters {
    status?: string[];
    type?: string[];
    dateFrom?: string;
    dateTo?: string;
    mentorId?: string;
    memberId?: string;
    hasRecording?: boolean;
    isProcessed?: boolean;
}

// Session List Response
export interface SessionListResponse {
    sessions: import('../../shared/pgnTypes').Session[];
    total: number;
    page: number;
    pageSize: number;
}
