/**
 * PGN 2.0 Core Types
 * Comprehensive type definitions for sessions, Zoom integration, AI processing, and SCALE-IT alignment.
 */

// =============================================================================
// SCALE-IT Framework Types
// =============================================================================

/**
 * SCALE-IT Pillar - The 5 core business pillars
 */
export type ScaleItPillar = 'Strategic' | 'CashFlow' | 'Alliance' | 'Leadership' | 'Execution';

export const SCALE_IT_PILLARS: Record<ScaleItPillar, { label: string; description: string; icon: string }> = {
  Strategic: { label: 'Strategic Vision', description: 'Long-term goals and direction', icon: 'Target' },
  CashFlow: { label: 'Cash Flow', description: 'Financial health and forecasting', icon: 'DollarSign' },
  Alliance: { label: 'Alliance of Team', description: 'Team structure and hiring', icon: 'Users' },
  Leadership: { label: 'Leadership', description: 'Personal and team development', icon: 'Award' },
  Execution: { label: 'Execution', description: 'Action items and task completion', icon: 'CheckCircle' }
};

// =============================================================================
// Session & Zoom Types
// =============================================================================

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type SessionType = 'mentor' | 'sales' | 'group' | 'workshop' | 'onboarding';
export type RecordingStatus = 'pending' | 'processing' | 'ready' | 'failed' | 'not_recorded';
export type SessionCategory = 'strategy' | 'mastermind' | 'lab_workshop' | 'huddle' | 'custom';
export type RSVPStatus = 'confirmed' | 'maybe' | 'declined' | null;
export type AttendanceStatus = 'attended' | 'not_attended' | null;

export interface ZoomMeeting {
  id: string;
  joinUrl: string;
  hostUrl: string;
  password?: string;
  startTime: string;
  duration: number;
  topic: string;
}

export interface Recording {
  id: string;
  meetingId: string;
  url: string;
  duration: number;
  fileSize: number;
  recordedAt: string;
  expiresAt?: string;
}

export interface Transcript {
  id: string;
  sessionId: string;
  content: string;
  wordCount: number;
  speakerLabels: SpeakerLabel[];
  createdAt: string;
}

export interface SpeakerLabel {
  speaker: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface Session {
  id: string;
  type: SessionType;
  status: SessionStatus;
  tenantId?: string;

  // Participants
  mentorId?: string;
  memberId: string;
  memberName: string;
  mentorName?: string;

  // Scheduling
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  timeZone: string;

  // Session Category & Classification
  category?: SessionCategory;
  categoryLabel?: string;         // Custom label when category is 'custom'
  isGlobalEvent?: boolean;        // PGN org-wide event vs mentor-specific

  // RSVP & Attendance
  rsvpStatus?: RSVPStatus;
  attendance?: AttendanceStatus;
  notificationsEnabled?: boolean;
  rsvpCount?: number;             // For upcoming PGN events
  attendeeCount?: number;         // For completed PGN events

  // Actual Timing (post-session)
  endedAt?: string;               // Actual end time
  actualDuration?: number;        // Actual minutes (may differ from scheduled)

  // Zoom Integration
  zoomMeeting?: ZoomMeeting;
  recording?: Recording;
  recordingStatus: RecordingStatus;
  transcript?: Transcript;

  // Video Retention & Bookmarks
  recordingExpiresAt?: string;    // When recording auto-deletes
  isBookmarked?: boolean;         // User bookmarked for preservation

  // AI Processing
  aiProcessed: boolean;
  aiProcessedAt?: string;

  // Metadata
  scaleItPillars: ScaleItPillar[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Suggested Prompts
export interface SuggestedPrompt {
  id: string;
  sessionId?: string;             // Which session this prompt is for
  text: string;
  originSessionId?: string;       // Where the prompt originated
  originDate?: string;
  isResolved: boolean;
  isDismissed: boolean;
  addedBy: 'ai' | 'mentor' | 'admin' | 'pin';
}

// Session Wins
export interface SessionWin {
  id: string;
  sessionId: string;
  description: string;
  detectedAt: string;
  source: 'mentor_callout' | 'ai_detected';
}

// =============================================================================
// AI Processing Types
// =============================================================================

export type AIOutputStatus = 'pending' | 'approved' | 'rejected' | 'edited';
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';
export type ImpactLevel = 'high' | 'medium' | 'low';

export interface AIMetadata {
  status: AIOutputStatus;
  confidence: number;
  generatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  editedContent?: string;
}

export interface SessionSummary {
  id: string;
  sessionId: string;
  executiveSummary: string;
  keyPoints: string[];
  duration: string;
  aiMetadata: AIMetadata;

  // Structured Briefing Data
  strategy?: { items: string[]; impact: string };
  execution?: { items: string[]; impact: string };
  risks?: { items: string[]; impact: string };
}

export interface Decision {
  id: string;
  sessionId: string;
  text: string;
  context: string;
  scaleItPillar: ScaleItPillar;
  sourceQuote: string;
  aiMetadata: AIMetadata;
}

export interface Commitment {
  id: string;
  sessionId: string;
  text: string;
  owner: 'member' | 'mentor';
  suggestedDeadline?: string;
  urgency: UrgencyLevel;
  scaleItPillar: ScaleItPillar;
  businessContext: string;
  sourceQuote: string;
  aiMetadata: AIMetadata;
}

export interface RiskSignal {
  id: string;
  sessionId: string;
  category: 'financial' | 'operational' | 'team' | 'strategic' | 'personal';
  severity: 'critical' | 'warning' | 'watch';
  description: string;
  indicators: string[];
  suggestedAction: string;
  sourceQuote: string;
  aiMetadata: AIMetadata;
}

export interface Opportunity {
  id: string;
  sessionId: string;
  type: 'growth' | 'efficiency' | 'partnership' | 'market';
  title: string;
  description: string;
  potentialImpact: ImpactLevel;
  suggestedNextSteps: string[];
  scaleItPillar: ScaleItPillar;
  aiMetadata: AIMetadata;
}

export interface ProcessedSession {
  sessionId: string;
  summary: SessionSummary;
  decisions: Decision[];
  commitments: Commitment[];
  risks: RiskSignal[];
  opportunities: Opportunity[];
  scaleItTags: ScaleItPillar[];
  processedAt: string;
}

// =============================================================================
// Proactive Agent Types
// =============================================================================

export type AgentUpdateType = 'realtime' | 'hourly' | 'daily';
export type AlertType = 'deadline' | 'risk' | 'anomaly' | 'milestone' | 'opportunity';
export type SuggestionType = 'action' | 'meeting' | 'followup' | 'learning' | 'delegation';

export interface FollowUpItem {
  id: string;
  type: 'session' | 'task' | 'commitment';
  sourceId: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: UrgencyLevel;
  relatedPerson?: string;
  scaleItPillar?: ScaleItPillar;
}

export interface PrioritizedAction {
  id: string;
  title: string;
  description: string;
  reasoning: string;
  impact: ImpactLevel;
  urgency: UrgencyLevel;
  estimatedTime: string;
  quickActions: QuickAction[];
  scaleItPillar: ScaleItPillar;
  sourceType: 'session' | 'task' | 'goal' | 'system';
  sourceId?: string;
}

export interface QuickAction {
  label: string;
  action: 'schedule' | 'complete' | 'delegate' | 'snooze' | 'dismiss';
  targetId?: string;
}

export interface ContextSummary {
  id: string;
  period: 'hour' | 'day' | 'week';
  title: string;
  highlights: string[];
  metricsSnapshot: Record<string, number>;
  scaleItBreakdown: Record<ScaleItPillar, number>;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  sourceType: string;
  sourceId: string;
  actionRequired: boolean;
  suggestedAction?: string;
  createdAt: string;
  dismissedAt?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueAt: string;
  recurring: boolean;
  recurrencePattern?: string;
  relatedTo?: { type: string; id: string };
  dismissed: boolean;
}

export interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  reasoning: string;
  impact: ImpactLevel;
  actionUrl?: string;
  quickActions: QuickAction[];
  expiresAt?: string;
  dismissed: boolean;
}

export interface AgentUpdate {
  id: string;
  type: AgentUpdateType;
  generatedAt: string;
  followUps: FollowUpItem[];
  actionItems: PrioritizedAction[];
  summaries: ContextSummary[];
  alerts: Alert[];
  reminders: Reminder[];
  suggestions: Suggestion[];
  reasoning: string;
}

// =============================================================================
// Sales & Handoff Types
// =============================================================================

export type FitScoreLevel = 'excellent' | 'good' | 'moderate' | 'poor';

export interface ProspectProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  companySize: string;
  revenue?: string;
  website?: string;
  source: string;
  createdAt: string;
}

export interface FitScore {
  overall: number;
  level: FitScoreLevel;
  breakdown: {
    programFit: number;
    readiness: number;
    commitment: number;
    coachability: number;
  };
  reasoning: string;
}

export interface RiskIndicator {
  id: string;
  category: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigationStrategy?: string;
}

export interface IdentifiedNeed {
  id: string;
  category: ScaleItPillar;
  description: string;
  urgency: UrgencyLevel;
  mentorNotes?: string;
}

export interface HandoffPackage {
  id: string;
  prospectId: string;
  prospect: ProspectProfile;
  salesSessionId: string;
  salesCallSummary: string;
  fitScore: FitScore;
  riskIndicators: RiskIndicator[];
  identifiedNeeds: IdentifiedNeed[];
  recommendedApproach: string;
  recordings: Recording[];
  transcripts: Transcript[];
  mentorId?: string;
  status: 'pending' | 'assigned' | 'accepted' | 'in_progress';
  createdAt: string;
  assignedAt?: string;
}

// =============================================================================
// Goals & Progress Types
// =============================================================================

export type GoalStatus = 'draft' | 'active' | 'at_risk' | 'on_track' | 'completed' | 'abandoned';
export type GoalPeriod = 'weekly' | 'monthly' | 'quarterly' | 'annual';

export interface Goal {
  id: string;
  memberId: string;
  title: string;
  description: string;
  scaleItPillar: ScaleItPillar;
  period: GoalPeriod;
  startDate: string;
  endDate: string;
  status: GoalStatus;
  progress: number;
  milestones: Milestone[];
  linkedTasks: string[];
  linkedSessions: string[];
  aiGenerated: boolean;
  aiMetadata?: AIMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProgressSignal {
  id: string;
  goalId: string;
  sessionId: string;
  type: 'progress' | 'blocker' | 'pivot' | 'completion';
  description: string;
  impact: number;
  detectedAt: string;
  sourceQuote?: string;
}

// =============================================================================
// Dashboard Types
// =============================================================================

export interface DashboardMetrics {
  // Engagement
  sessionsThisMonth: number;
  sessionsLastMonth: number;
  sessionsTrend: number;

  // Tasks
  pendingTasks: number;
  overdueTasks: number;
  completedTasksThisMonth: number;
  taskCompletionRate: number;

  // Goals
  activeGoals: number;
  goalsAtRisk: number;
  goalsOnTrack: number;

  // SCALE-IT Distribution
  scaleItBreakdown: Record<ScaleItPillar, {
    tasks: number;
    goals: number;
    sessions: number;
    health: 'healthy' | 'attention' | 'critical';
  }>;
}

export interface MentorDashboardData {
  clientCount: number;
  clientsAtRisk: number;
  upcomingSessions: Session[];
  pendingReviews: ProcessedSession[];
  redFlags: Alert[];
  topActions: PrioritizedAction[];
}

export interface AdminDashboardData {
  totalMembers: number;
  activeMembers: number;
  totalMentors: number;
  programHealth: {
    engagement: number;
    momentum: number;
    outcomes: number;
  };
  alerts: Alert[];
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// Communication Types
// =============================================================================

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  editedAt?: string;
  readBy: string[];
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

export interface MessageThread {
  id: string;
  type: 'direct' | 'group' | 'cohort';
  title?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Notification Types
// =============================================================================

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';
export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  actionUrl?: string;
  read: boolean;
  sentAt: string;
  readAt?: string;
}
