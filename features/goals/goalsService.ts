/**
 * Goals Service
 * Handles AI-generated quarterly goals, progress tracking, and milestone management.
 */

import { GoogleGenAI, Type } from "@google/genai";
import {
    Goal,
    GoalStatus,
    GoalPeriod,
    Milestone,
    ProgressSignal,
    ScaleItPillar,
    ProcessedSession,
    AIMetadata
} from '../../types';
import { MOCK_MEMBER_GOALS } from '../../data/mockFinancials';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// =============================================================================
// Data Store (Mock)
// =============================================================================

const GOALS: Map<string, Goal> = new Map();
const PROGRESS_SIGNALS: ProgressSignal[] = [];

// Initialize with mock goals
MOCK_MEMBER_GOALS.forEach((g: any, i: number) => {
    const goal: Goal = {
        id: `goal_${i}`,
        memberId: 'member_1',
        title: g.name || g.title || `Goal ${i + 1}`,
        description: g.description || '',
        scaleItPillar: 'Execution',
        period: 'quarterly',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: g.progress >= 100 ? 'completed' : g.progress >= 50 ? 'on_track' : 'at_risk',
        progress: g.progress || 0,
        milestones: [],
        linkedTasks: [],
        linkedSessions: [],
        aiGenerated: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    GOALS.set(goal.id, goal);
});

// =============================================================================
// Goal CRUD
// =============================================================================

export interface CreateGoalRequest {
    memberId: string;
    title: string;
    description: string;
    scaleItPillar: ScaleItPillar;
    period: GoalPeriod;
    startDate: string;
    endDate: string;
    milestones?: Array<{ title: string; dueDate: string }>;
    aiGenerated?: boolean;
}

/**
 * Create a new goal
 */
export async function createGoal(request: CreateGoalRequest): Promise<Goal> {
    const goalId = `goal_${Date.now()}`;

    const milestones: Milestone[] = (request.milestones || []).map((m, i) => ({
        id: `milestone_${goalId}_${i}`,
        goalId,
        title: m.title,
        dueDate: m.dueDate,
        completed: false
    }));

    const goal: Goal = {
        id: goalId,
        memberId: request.memberId,
        title: request.title,
        description: request.description,
        scaleItPillar: request.scaleItPillar,
        period: request.period,
        startDate: request.startDate,
        endDate: request.endDate,
        status: 'active',
        progress: 0,
        milestones,
        linkedTasks: [],
        linkedSessions: [],
        aiGenerated: request.aiGenerated ?? false,
        aiMetadata: request.aiGenerated ? createAIMetadata(0.85) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    GOALS.set(goalId, goal);
    return goal;
}

/**
 * Get goal by ID
 */
export async function getGoal(goalId: string): Promise<Goal | null> {
    return GOALS.get(goalId) ?? null;
}

/**
 * List goals for a member
 */
export async function listGoals(memberId: string, filters?: {
    period?: GoalPeriod;
    status?: GoalStatus;
    scaleItPillar?: ScaleItPillar;
}): Promise<Goal[]> {
    let goals = Array.from(GOALS.values()).filter(g => g.memberId === memberId);

    if (filters?.period) {
        goals = goals.filter(g => g.period === filters.period);
    }
    if (filters?.status) {
        goals = goals.filter(g => g.status === filters.status);
    }
    if (filters?.scaleItPillar) {
        goals = goals.filter(g => g.scaleItPillar === filters.scaleItPillar);
    }

    return goals;
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(
    goalId: string,
    progress: number
): Promise<Goal> {
    const goal = GOALS.get(goalId);
    if (!goal) {
        throw new Error(`Goal ${goalId} not found`);
    }

    const newStatus: GoalStatus =
        progress >= 100 ? 'completed' :
            progress >= 70 ? 'on_track' :
                progress >= 40 ? 'at_risk' : 'at_risk';

    const updated: Goal = {
        ...goal,
        progress: Math.min(100, Math.max(0, progress)),
        status: newStatus,
        updatedAt: new Date().toISOString()
    };

    GOALS.set(goalId, updated);
    return updated;
}

/**
 * Complete a milestone
 */
export async function completeMilestone(
    goalId: string,
    milestoneId: string
): Promise<Goal> {
    const goal = GOALS.get(goalId);
    if (!goal) {
        throw new Error(`Goal ${goalId} not found`);
    }

    const milestones = goal.milestones.map(m =>
        m.id === milestoneId
            ? { ...m, completed: true, completedAt: new Date().toISOString() }
            : m
    );

    const completedCount = milestones.filter(m => m.completed).length;
    const progress = milestones.length > 0
        ? Math.round((completedCount / milestones.length) * 100)
        : goal.progress;

    const updated: Goal = {
        ...goal,
        milestones,
        progress,
        updatedAt: new Date().toISOString()
    };

    GOALS.set(goalId, updated);
    return updated;
}

// =============================================================================
// AI Goal Generation
// =============================================================================

/**
 * Generate quarterly goals from session patterns
 */
export async function generateQuarterlyGoals(
    memberId: string,
    recentSessions: ProcessedSession[],
    existingGoals: Goal[]
): Promise<Goal[]> {
    // Aggregate insights from recent sessions
    const commitments = recentSessions.flatMap(s => s.commitments);
    const decisions = recentSessions.flatMap(s => s.decisions);
    const opportunities = recentSessions.flatMap(s => s.opportunities);

    const prompt = `Based on recent mentoring session insights, generate 3-5 quarterly goals for this CEO.

Recent Commitments:
${commitments.slice(0, 5).map(c => `- ${c.text} (${c.scaleItPillar})`).join('\n')}

Recent Decisions:
${decisions.slice(0, 5).map(d => `- ${d.text} (${d.scaleItPillar})`).join('\n')}

Opportunities Identified:
${opportunities.slice(0, 3).map(o => `- ${o.title}: ${o.description}`).join('\n')}

Existing Goals (avoid duplication):
${existingGoals.slice(0, 3).map(g => `- ${g.title}`).join('\n')}

Generate goals that:
1. Are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
2. Align with SCALE-IT pillars (Strategic, CashFlow, Alliance, Leadership, Execution)
3. Have clear milestones

Respond in JSON:
{
  "goals": [
    {
      "title": "string",
      "description": "string",
      "scaleItPillar": "Strategic|CashFlow|Alliance|Leadership|Execution",
      "milestones": [
        { "title": "string", "weekNumber": 1-13 }
      ]
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text ?? '{"goals":[]}');
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);

        const generatedGoals: Goal[] = [];

        for (const g of result.goals || []) {
            const goal = await createGoal({
                memberId,
                title: g.title,
                description: g.description,
                scaleItPillar: validatePillar(g.scaleItPillar),
                period: 'quarterly',
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                milestones: (g.milestones || []).map((m: any) => ({
                    title: m.title,
                    dueDate: new Date(startDate.getTime() + m.weekNumber * 7 * 24 * 60 * 60 * 1000).toISOString()
                })),
                aiGenerated: true
            });

            generatedGoals.push(goal);
        }

        return generatedGoals;
    } catch (error) {
        console.error('[GoalsService] Goal generation failed:', error);
        return [];
    }
}

// =============================================================================
// Progress Signals from Sessions
// =============================================================================

/**
 * Detect progress signals from a processed session
 */
export async function detectProgressSignals(
    memberId: string,
    processedSession: ProcessedSession
): Promise<ProgressSignal[]> {
    const goals = await listGoals(memberId, { status: 'active' });
    if (goals.length === 0) return [];

    const prompt = `Analyze this session and detect progress on existing goals.

Session Summary: ${processedSession.summary.executiveSummary}

Commitments Discussed:
${processedSession.commitments.map(c => `- ${c.text}`).join('\n')}

Active Goals:
${goals.map(g => `- [${g.id}] ${g.title} (${g.progress}% complete)`).join('\n')}

For each goal that has progress or blockers mentioned, provide:
{
  "signals": [
    {
      "goalId": "goal ID from active goals",
      "type": "progress|blocker|pivot|completion",
      "description": "what happened",
      "impact": -20 to 20 (negative for blockers)
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text ?? '{"signals":[]}');
        const signals: ProgressSignal[] = [];

        for (const s of result.signals || []) {
            if (!goals.find(g => g.id === s.goalId)) continue;

            const signal: ProgressSignal = {
                id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                goalId: s.goalId,
                sessionId: processedSession.sessionId,
                type: ['progress', 'blocker', 'pivot', 'completion'].includes(s.type) ? s.type : 'progress',
                description: s.description,
                impact: Math.max(-20, Math.min(20, s.impact || 0)),
                detectedAt: new Date().toISOString()
            };

            signals.push(signal);
            PROGRESS_SIGNALS.push(signal);

            // Update goal progress
            const goal = goals.find(g => g.id === s.goalId);
            if (goal) {
                await updateGoalProgress(s.goalId, goal.progress + signal.impact);
            }
        }

        return signals;
    } catch (error) {
        console.error('[GoalsService] Progress signal detection failed:', error);
        return [];
    }
}

/**
 * Get progress signals for a goal
 */
export function getGoalProgressSignals(goalId: string): ProgressSignal[] {
    return PROGRESS_SIGNALS.filter(s => s.goalId === goalId);
}

// =============================================================================
// Utility Functions
// =============================================================================

function createAIMetadata(confidence: number): AIMetadata {
    return {
        status: 'pending',
        confidence,
        generatedAt: new Date().toISOString()
    };
}

function validatePillar(pillar: string): ScaleItPillar {
    const valid: ScaleItPillar[] = ['Strategic', 'CashFlow', 'Alliance', 'Leadership', 'Execution'];
    return valid.includes(pillar as ScaleItPillar) ? (pillar as ScaleItPillar) : 'Execution';
}

export default {
    createGoal,
    getGoal,
    listGoals,
    updateGoalProgress,
    completeMilestone,
    generateQuarterlyGoals,
    detectProgressSignals,
    getGoalProgressSignals
};
