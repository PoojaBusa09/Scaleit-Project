/**
 * CEO Agent Service
 * Central intelligence hub that aggregates context from all modules and provides
 * proactive intelligence updates: follow-ups, action items, summaries, alerts,
 * reminders, and suggestions.
 */

import { GoogleGenAI, Type } from "@google/genai";
import {
    AgentUpdate,
    AgentUpdateType,
    FollowUpItem,
    PrioritizedAction,
    ContextSummary,
    Alert,
    Reminder,
    Suggestion,
    ScaleItPillar,
    UrgencyLevel,
    ImpactLevel,
    Session,
    ProcessedSession,
    Goal,
    DashboardMetrics
} from '../types';
import { MOCK_TASKS } from '../data/mockTasks';
import { MOCK_SESSIONS } from '../data/mockSessions';
import { MOCK_MEMBER_GOALS } from '../data/mockFinancials';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// =============================================================================
// Context Collection
// =============================================================================

interface FullBusinessContext {
    // User Info
    userId: string;
    userName: string;
    userRole: string;

    // Tasks
    pendingTasks: Array<{ id: string; text: string; dueDate?: string; priority?: string }>;
    overdueTasks: Array<{ id: string; text: string; dueDate: string }>;
    recentlyCompletedTasks: Array<{ id: string; text: string; completedAt: string }>;

    // Sessions
    upcomingSessions: Array<{ id: string; title: string; date: string; with: string }>;
    recentSessions: Array<{ id: string; title: string; date: string; summary?: string }>;
    missedSessions: Array<{ id: string; title: string; date: string }>;

    // Goals
    activeGoals: Array<{ id: string; title: string; progress: number; status: string }>;
    goalsAtRisk: Array<{ id: string; title: string; dueDate: string; blockers: string[] }>;

    // Recent AI Insights
    recentRisks: Array<{ description: string; severity: string }>;
    recentOpportunities: Array<{ title: string; impact: string }>;
    pendingCommitments: Array<{ text: string; dueDate?: string; owner: string }>;

    // Metrics
    metrics: {
        sessionsThisMonth: number;
        taskCompletionRate: number;
        goalsOnTrack: number;
    };

    // Time context
    currentTime: string;
    dayOfWeek: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening';
}

/**
 * Collect full business context for the agent
 */
export async function collectContext(userId: string): Promise<FullBusinessContext> {
    const now = new Date();
    const hour = now.getHours();

    // Get tasks
    const allTasks = MOCK_TASKS;
    const pendingTasks = allTasks.filter(t => !t.completed);
    const overdueTasks = pendingTasks.filter(t => t.dueDate && new Date(t.dueDate) < now);
    const recentlyCompleted = allTasks.filter(t => t.completed).slice(0, 5);

    // Get sessions
    const allSessions = MOCK_SESSIONS;
    const upcomingSessions = allSessions.filter(s => new Date(s.date) > now && !s.attended);
    const recentSessions = allSessions.filter(s => new Date(s.date) < now && s.attended).slice(0, 3);
    const missedSessions = allSessions.filter(s => new Date(s.date) < now && !s.attended);

    // Get goals
    const goals = MOCK_MEMBER_GOALS;
    const activeGoals = goals.filter((g: any) => g.status !== 'completed');
    const goalsAtRisk = goals.filter((g: any) => g.progress < 50 && g.status !== 'completed');

    return {
        userId,
        userName: 'CEO User', // Would come from auth context
        userRole: 'SC',

        pendingTasks: pendingTasks.map(t => ({
            id: t.id.toString(),
            text: t.text,
            dueDate: t.dueDate,
            priority: 'medium'
        })),
        overdueTasks: overdueTasks.map(t => ({
            id: t.id.toString(),
            text: t.text,
            dueDate: t.dueDate!
        })),
        recentlyCompletedTasks: recentlyCompleted.map((t: any) => ({
            id: t.id.toString(),
            text: t.text,
            completedAt: now.toISOString()
        })),

        upcomingSessions: upcomingSessions.map(s => ({
            id: s.id,
            title: s.title,
            date: s.date,
            with: 'Mentor'
        })),
        recentSessions: recentSessions.map(s => ({
            id: s.id,
            title: s.title,
            date: s.date
        })),
        missedSessions: missedSessions.map(s => ({
            id: s.id,
            title: s.title,
            date: s.date
        })),

        activeGoals: activeGoals.map((g: any) => ({
            id: g.id || 'goal-1',
            title: g.name || g.title,
            progress: g.progress || 0,
            status: g.status || 'active'
        })),
        goalsAtRisk: goalsAtRisk.map((g: any) => ({
            id: g.id || 'goal-1',
            title: g.name || g.title,
            dueDate: g.dueDate || now.toISOString(),
            blockers: []
        })),

        recentRisks: [],
        recentOpportunities: [],
        pendingCommitments: [],

        metrics: {
            sessionsThisMonth: allSessions.filter(s => {
                const sessionDate = new Date(s.date);
                return sessionDate.getMonth() === now.getMonth();
            }).length,
            taskCompletionRate: allTasks.length > 0
                ? Math.round((allTasks.filter(t => t.completed).length / allTasks.length) * 100)
                : 0,
            goalsOnTrack: activeGoals.filter((g: any) => g.progress >= 50).length
        },

        currentTime: now.toISOString(),
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()],
        timeOfDay: hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    };
}

// =============================================================================
// Agent Update Generation
// =============================================================================

/**
 * Generate a comprehensive agent update
 */
export async function generateAgentUpdate(
    context: FullBusinessContext,
    type: AgentUpdateType = 'daily'
): Promise<AgentUpdate> {
    console.log(`[CEOAgent] Generating ${type} update for ${context.userName}`);

    // Generate components in parallel
    const [followUps, actions, summaries, alerts, reminders, suggestions] = await Promise.all([
        generateFollowUps(context),
        generatePrioritizedActions(context),
        generateContextSummaries(context, type),
        generateAlerts(context),
        generateReminders(context),
        generateSuggestions(context)
    ]);

    // Generate overall reasoning
    const reasoning = await generateReasoning(context, {
        followUps, actions, summaries, alerts, reminders, suggestions
    });

    return {
        id: `update_${Date.now()}`,
        type,
        generatedAt: new Date().toISOString(),
        followUps,
        actionItems: actions,
        summaries,
        alerts,
        reminders,
        suggestions,
        reasoning
    };
}

// =============================================================================
// Follow-Up Generation
// =============================================================================

/**
 * Generate follow-up items from sessions and tasks
 */
export async function generateFollowUps(context: FullBusinessContext): Promise<FollowUpItem[]> {
    const followUps: FollowUpItem[] = [];

    // From recent sessions
    for (const session of context.recentSessions) {
        followUps.push({
            id: `fu_session_${session.id}`,
            type: 'session',
            sourceId: session.id,
            title: `Follow up on ${session.title}`,
            description: `Review action items and decisions from your session on ${new Date(session.date).toLocaleDateString()}`,
            priority: 'medium' as UrgencyLevel,
            relatedPerson: 'Mentor',
            scaleItPillar: 'Execution'
        });
    }

    // From pending commitments
    for (const commitment of context.pendingCommitments) {
        followUps.push({
            id: `fu_commit_${Date.now()}`,
            type: 'commitment',
            sourceId: 'commitment',
            title: commitment.text,
            description: `Commitment from mentoring session`,
            dueDate: commitment.dueDate,
            priority: 'high' as UrgencyLevel,
            scaleItPillar: 'Execution'
        });
    }

    // From overdue tasks
    for (const task of context.overdueTasks.slice(0, 3)) {
        followUps.push({
            id: `fu_task_${task.id}`,
            type: 'task',
            sourceId: task.id,
            title: `Overdue: ${task.text}`,
            description: `This task was due on ${new Date(task.dueDate).toLocaleDateString()}`,
            dueDate: task.dueDate,
            priority: 'critical' as UrgencyLevel,
            scaleItPillar: 'Execution'
        });
    }

    return followUps;
}

// =============================================================================
// Prioritized Actions Generation
// =============================================================================

/**
 * Generate prioritized actions using AI
 */
export async function generatePrioritizedActions(context: FullBusinessContext): Promise<PrioritizedAction[]> {
    const prompt = `You are an executive coach AI. Based on the CEO's current context, generate 3-5 prioritized actions they should take.

Context:
- Time: ${context.timeOfDay} on ${context.dayOfWeek}
- Pending tasks: ${context.pendingTasks.length}
- Overdue tasks: ${context.overdueTasks.length}
- Upcoming sessions: ${context.upcomingSessions.map(s => s.title).join(', ') || 'None'}
- Goals at risk: ${context.goalsAtRisk.length}
- Task completion rate: ${context.metrics.taskCompletionRate}%

Pending Tasks:
${context.pendingTasks.slice(0, 5).map(t => `- ${t.text}`).join('\n')}

Overdue Tasks:
${context.overdueTasks.slice(0, 3).map(t => `- ${t.text} (due: ${t.dueDate})`).join('\n')}

Upcoming Sessions:
${context.upcomingSessions.slice(0, 3).map(s => `- ${s.title} on ${s.date}`).join('\n')}

Generate prioritized actions in JSON:
{
  "actions": [
    {
      "title": "string",
      "description": "string",
      "reasoning": "Why this action matters now",
      "impact": "high|medium|low",
      "urgency": "critical|high|medium|low",
      "estimatedTime": "15 min",
      "scaleItPillar": "Strategic|CashFlow|Alliance|Leadership|Execution"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const result = JSON.parse(response.text ?? '{"actions":[]}');

        return (result.actions || []).map((a: any, i: number) => ({
            id: `action_${Date.now()}_${i}`,
            title: a.title,
            description: a.description,
            reasoning: a.reasoning,
            impact: a.impact || 'medium',
            urgency: a.urgency || 'medium',
            estimatedTime: a.estimatedTime || '15 min',
            quickActions: [
                { label: 'Start Now', action: 'complete' as const },
                { label: 'Schedule', action: 'schedule' as const },
                { label: 'Snooze', action: 'snooze' as const }
            ],
            scaleItPillar: a.scaleItPillar || 'Execution',
            sourceType: 'system' as const
        }));
    } catch (error) {
        console.error('[CEOAgent] Failed to generate actions:', error);
        return getDefaultActions(context);
    }
}

function getDefaultActions(context: FullBusinessContext): PrioritizedAction[] {
    const actions: PrioritizedAction[] = [];

    if (context.overdueTasks.length > 0) {
        actions.push({
            id: 'action_overdue',
            title: 'Address Overdue Tasks',
            description: `You have ${context.overdueTasks.length} overdue tasks that need attention.`,
            reasoning: 'Overdue tasks create bottlenecks and stress. Addressing them improves momentum.',
            impact: 'high',
            urgency: 'high',
            estimatedTime: '30 min',
            quickActions: [{ label: 'View Tasks', action: 'complete' }],
            scaleItPillar: 'Execution',
            sourceType: 'system'
        });
    }

    if (context.upcomingSessions.length > 0) {
        const nextSession = context.upcomingSessions[0];
        actions.push({
            id: 'action_prepare',
            title: `Prepare for: ${nextSession.title}`,
            description: `Your upcoming session is on ${new Date(nextSession.date).toLocaleDateString()}`,
            reasoning: 'Prepared sessions are more productive and lead to better outcomes.',
            impact: 'medium',
            urgency: 'medium',
            estimatedTime: '15 min',
            quickActions: [{ label: 'View Agenda', action: 'complete' }],
            scaleItPillar: 'Execution',
            sourceType: 'system'
        });
    }

    return actions;
}

// =============================================================================
// Context Summaries
// =============================================================================

/**
 * Generate context summaries
 */
export async function generateContextSummaries(
    context: FullBusinessContext,
    period: AgentUpdateType
): Promise<ContextSummary[]> {
    const highlights: string[] = [];

    if (context.recentlyCompletedTasks.length > 0) {
        highlights.push(`Completed ${context.recentlyCompletedTasks.length} tasks`);
    }

    if (context.recentSessions.length > 0) {
        highlights.push(`Attended ${context.recentSessions.length} mentoring sessions`);
    }

    if (context.metrics.taskCompletionRate > 70) {
        highlights.push(`Strong task completion rate: ${context.metrics.taskCompletionRate}%`);
    }

    if (context.goalsAtRisk.length > 0) {
        highlights.push(`${context.goalsAtRisk.length} goals need attention`);
    }

    return [{
        id: `summary_${Date.now()}`,
        period: period === 'hourly' ? 'hour' : period === 'daily' ? 'day' : 'week',
        title: `Your ${period === 'hourly' ? 'Hour' : period === 'daily' ? 'Day' : 'Week'} at a Glance`,
        highlights: highlights.length > 0 ? highlights : ['No major updates'],
        metricsSnapshot: {
            pendingTasks: context.pendingTasks.length,
            completedTasks: context.recentlyCompletedTasks.length,
            upcomingSessions: context.upcomingSessions.length,
            goalsOnTrack: context.metrics.goalsOnTrack
        },
        scaleItBreakdown: {
            Strategic: 20,
            CashFlow: 15,
            Alliance: 25,
            Leadership: 15,
            Execution: 25
        }
    }];
}

// =============================================================================
// Alerts Generation
// =============================================================================

/**
 * Generate alerts from context
 */
export async function generateAlerts(context: FullBusinessContext): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Overdue task alert
    if (context.overdueTasks.length > 0) {
        alerts.push({
            id: `alert_overdue_${Date.now()}`,
            type: 'deadline',
            severity: context.overdueTasks.length > 3 ? 'critical' : 'warning',
            title: `${context.overdueTasks.length} Overdue Tasks`,
            description: `You have tasks that are past their due date and need immediate attention.`,
            sourceType: 'task',
            sourceId: 'tasks',
            actionRequired: true,
            suggestedAction: 'Review and reschedule or complete these tasks',
            createdAt: new Date().toISOString()
        });
    }

    // Missed session alert
    if (context.missedSessions.length > 0) {
        alerts.push({
            id: `alert_missed_${Date.now()}`,
            type: 'risk',
            severity: 'warning',
            title: `${context.missedSessions.length} Missed Sessions`,
            description: `You have mentoring sessions that were not attended.`,
            sourceType: 'session',
            sourceId: 'sessions',
            actionRequired: true,
            suggestedAction: 'Reschedule these sessions with your mentor',
            createdAt: new Date().toISOString()
        });
    }

    // Goals at risk alert
    if (context.goalsAtRisk.length > 0) {
        alerts.push({
            id: `alert_goals_${Date.now()}`,
            type: 'risk',
            severity: 'warning',
            title: `${context.goalsAtRisk.length} Goals At Risk`,
            description: `Some goals are behind schedule and may not be met.`,
            sourceType: 'goal',
            sourceId: 'goals',
            actionRequired: true,
            suggestedAction: 'Review blocked goals and adjust timelines or resources',
            createdAt: new Date().toISOString()
        });
    }

    // Recent risks from sessions
    for (const risk of context.recentRisks) {
        alerts.push({
            id: `alert_risk_${Date.now()}`,
            type: 'risk',
            severity: risk.severity === 'critical' ? 'critical' : 'warning',
            title: 'Risk Detected in Session',
            description: risk.description,
            sourceType: 'session',
            sourceId: 'session',
            actionRequired: risk.severity === 'critical',
            createdAt: new Date().toISOString()
        });
    }

    return alerts;
}

// =============================================================================
// Reminders Generation
// =============================================================================

/**
 * Generate reminders from context
 */
export async function generateReminders(context: FullBusinessContext): Promise<Reminder[]> {
    const reminders: Reminder[] = [];

    // Upcoming session reminders
    for (const session of context.upcomingSessions.slice(0, 3)) {
        const sessionDate = new Date(session.date);
        const hoursUntil = (sessionDate.getTime() - Date.now()) / (1000 * 60 * 60);

        if (hoursUntil <= 24) {
            reminders.push({
                id: `remind_session_${session.id}`,
                title: `Upcoming: ${session.title}`,
                description: `Session with ${session.with} in ${Math.round(hoursUntil)} hours`,
                dueAt: session.date,
                recurring: false,
                relatedTo: { type: 'session', id: session.id },
                dismissed: false
            });
        }
    }

    // Weekly review reminder (if it's Friday afternoon)
    if (context.dayOfWeek === 'Friday' && context.timeOfDay === 'afternoon') {
        reminders.push({
            id: `remind_weekly_review`,
            title: 'Weekly Review',
            description: 'Take 15 minutes to review your week and plan for next week',
            dueAt: new Date().toISOString(),
            recurring: true,
            recurrencePattern: 'weekly',
            dismissed: false
        });
    }

    return reminders;
}

// =============================================================================
// Suggestions Generation
// =============================================================================

/**
 * Generate proactive suggestions using AI
 */
export async function generateSuggestions(context: FullBusinessContext): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = [];

    // Time-based suggestions
    if (context.timeOfDay === 'morning') {
        suggestions.push({
            id: 'suggest_morning_plan',
            type: 'action',
            title: 'Plan Your Day',
            description: "Good morning! Take 5 minutes to review today's priorities and set your focus.",
            reasoning: 'Morning planning leads to 40% more productive days.',
            impact: 'high',
            quickActions: [
                { label: 'View Tasks', action: 'complete' },
                { label: 'Skip', action: 'dismiss' }
            ],
            dismissed: false
        });
    }

    // Session preparation suggestions
    if (context.upcomingSessions.length > 0) {
        const nextSession = context.upcomingSessions[0];
        const hoursUntil = (new Date(nextSession.date).getTime() - Date.now()) / (1000 * 60 * 60);

        if (hoursUntil <= 4 && hoursUntil > 0.5) {
            suggestions.push({
                id: 'suggest_session_prep',
                type: 'meeting',
                title: 'Prepare for Your Session',
                description: `Your session "${nextSession.title}" is coming up. Review previous notes and prepare questions.`,
                reasoning: 'Prepared sessions are more valuable and action-oriented.',
                impact: 'high',
                quickActions: [
                    { label: 'View Notes', action: 'complete' },
                    { label: 'Later', action: 'snooze' }
                ],
                dismissed: false
            });
        }
    }

    // Goal focus suggestions
    if (context.activeGoals.length > 0) {
        const lowProgressGoal = context.activeGoals.find((g: any) => g.progress < 30);
        if (lowProgressGoal) {
            suggestions.push({
                id: 'suggest_goal_focus',
                type: 'action',
                title: `Focus on: ${lowProgressGoal.title}`,
                description: `This goal is at ${lowProgressGoal.progress}% progress. Consider dedicating time today.`,
                reasoning: 'Consistent progress on goals, even small steps, builds momentum.',
                impact: 'medium',
                quickActions: [
                    { label: 'View Goal', action: 'complete' },
                    { label: 'Dismiss', action: 'dismiss' }
                ],
                dismissed: false
            });
        }
    }

    return suggestions;
}

// =============================================================================
// Reasoning Generation
// =============================================================================

/**
 * Generate overall reasoning for the update
 */
async function generateReasoning(
    context: FullBusinessContext,
    updates: {
        followUps: FollowUpItem[];
        actions: PrioritizedAction[];
        summaries: ContextSummary[];
        alerts: Alert[];
        reminders: Reminder[];
        suggestions: Suggestion[];
    }
): Promise<string> {
    const criticalAlerts = updates.alerts.filter(a => a.severity === 'critical').length;
    const highPriorityActions = updates.actions.filter(a => a.urgency === 'high' || a.urgency === 'critical').length;

    let reasoning = `Good ${context.timeOfDay}, ${context.userName}. `;

    if (criticalAlerts > 0) {
        reasoning += `You have ${criticalAlerts} critical item${criticalAlerts > 1 ? 's' : ''} requiring immediate attention. `;
    }

    if (highPriorityActions > 0) {
        reasoning += `I've identified ${highPriorityActions} high-priority action${highPriorityActions > 1 ? 's' : ''} for you. `;
    }

    if (context.upcomingSessions.length > 0) {
        reasoning += `You have ${context.upcomingSessions.length} upcoming session${context.upcomingSessions.length > 1 ? 's' : ''} to prepare for. `;
    }

    if (context.metrics.taskCompletionRate > 80) {
        reasoning += `Great momentum - your task completion rate is ${context.metrics.taskCompletionRate}%! `;
    }

    return reasoning;
}

// =============================================================================
// Exports
// =============================================================================

export default {
    collectContext,
    generateAgentUpdate,
    generateFollowUps,
    generatePrioritizedActions,
    generateContextSummaries,
    generateAlerts,
    generateReminders,
    generateSuggestions
};
