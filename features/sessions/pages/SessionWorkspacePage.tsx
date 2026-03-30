/**
 * Session Workspace Page
 * Post-session view for reviewing AI-extracted insights, decisions, commitments,
 * risks, and opportunities with approval/rejection workflow.
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader';
import {
    Session,
    ProcessedSession,
    Decision,
    Commitment,
    RiskSignal,
    Opportunity,
    AIMetadata
} from '../../../types';
import {
    CheckCircle,
    XCircle,
    Edit3,
    AlertTriangle,
    Lightbulb,
    FileText,
    Clock,
    User,
    Target,
    ChevronDown,
    ChevronUp,
    Play,
    MessageSquare
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

// type SessionWorkspaceProps is not needed if we use useParams
// interface SessionWorkspaceProps {
//     sessionId: string;
// }

type TabType = 'summary' | 'decisions' | 'commitments' | 'risks' | 'opportunities' | 'transcript';

// =============================================================================
// Mock Data (would come from sessionService in production)
// =============================================================================

const MOCK_SESSION: Session = {
    id: 'session_1',
    type: 'onboarding',
    status: 'completed',
    memberId: 'member_1',
    memberName: 'John Smith',
    mentorId: 'mentor_1',
    mentorName: 'Sarah Johnson',
    title: 'Intro & Onboarding',
    description: 'First intro call with standard 5-topic checklist',
    scheduledAt: '2026-01-15T10:00:00Z',
    duration: 60,
    timeZone: 'America/New_York',
    recordingStatus: 'ready',
    aiProcessed: true,
    aiProcessedAt: '2026-01-15T11:30:00Z',
    scaleItPillars: ['CashFlow', 'Alliance', 'Execution'],
    tags: ['Q1 Planning', 'Cash Flow', 'Hiring'],
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-15T11:30:00Z'
};

const MOCK_PROCESSED: ProcessedSession = {
    sessionId: 'session_1',
    summary: {
        id: 'sum_1',
        sessionId: 'session_1',
        executiveSummary: 'Productive session focused on Q1 cash flow challenges and team expansion plans. Key decisions made around implementing milestone-based payments and hiring a part-time bookkeeper within 60 days.',
        keyPoints: [
            'Cash flow pressure from delayed client payment',
            'Decision to implement milestone-based payment structure',
            'Plan to research line of credit options',
            'Hiring a part-time bookkeeper prioritized'
        ],
        duration: '10 min',
        aiMetadata: { status: 'pending', confidence: 0.92, generatedAt: '2026-01-15T11:30:00Z' }
    },
    decisions: [
        {
            id: 'dec_1',
            sessionId: 'session_1',
            text: 'Implement milestone-based payment structure for all new contracts',
            context: 'To prevent cash flow issues from delayed payments',
            scaleItPillar: 'CashFlow',
            sourceQuote: "Let's work on a strategy to prevent this. Have you considered implementing milestone-based payments?",
            aiMetadata: { status: 'pending', confidence: 0.88, generatedAt: '2026-01-15T11:30:00Z' }
        },
        {
            id: 'dec_2',
            sessionId: 'session_1',
            text: 'Hire a part-time bookkeeper within 60 days',
            context: 'To improve financial visibility and cash flow management',
            scaleItPillar: 'Alliance',
            sourceQuote: "We're considering hiring a part-time bookkeeper... I'd like to have someone in place within 60 days.",
            aiMetadata: { status: 'pending', confidence: 0.91, generatedAt: '2026-01-15T11:30:00Z' }
        }
    ],
    commitments: [
        {
            id: 'com_1',
            sessionId: 'session_1',
            text: 'Research line of credit options',
            owner: 'member',
            suggestedDeadline: '2026-01-22T00:00:00Z',
            urgency: 'high',
            scaleItPillar: 'CashFlow',
            businessContext: 'To establish a financial safety net for cash flow fluctuations',
            sourceQuote: "I'll commit to researching options this week.",
            aiMetadata: { status: 'pending', confidence: 0.85, generatedAt: '2026-01-15T11:30:00Z' }
        },
        {
            id: 'com_2',
            sessionId: 'session_1',
            text: 'Create job description for part-time bookkeeper role',
            owner: 'member',
            suggestedDeadline: '2026-01-29T00:00:00Z',
            urgency: 'medium',
            scaleItPillar: 'Alliance',
            businessContext: 'First step in the hiring process for bookkeeper',
            sourceQuote: "I'd like to have someone in place within 60 days.",
            aiMetadata: { status: 'pending', confidence: 0.82, generatedAt: '2026-01-15T11:30:00Z' }
        }
    ],
    risks: [
        {
            id: 'risk_1',
            sessionId: 'session_1',
            category: 'financial',
            severity: 'warning',
            description: 'Cash flow dependency on single large client',
            indicators: ['30-day payment delay impacted payroll', 'No credit line safety net in place'],
            suggestedAction: 'Diversify client base and establish emergency credit facility',
            sourceQuote: 'Our largest client delayed payment by 30 days, which put pressure on payroll.',
            aiMetadata: { status: 'pending', confidence: 0.87, generatedAt: '2026-01-15T11:30:00Z' }
        }
    ],
    opportunities: [
        {
            id: 'opp_1',
            sessionId: 'session_1',
            type: 'efficiency',
            title: 'Financial Process Automation',
            description: 'Hiring a bookkeeper could free up CEO time and improve financial visibility',
            potentialImpact: 'high',
            suggestedNextSteps: [
                'Define bookkeeper responsibilities',
                'Research accounting software integration',
                'Create hiring timeline'
            ],
            scaleItPillar: 'Alliance',
            aiMetadata: { status: 'pending', confidence: 0.79, generatedAt: '2026-01-15T11:30:00Z' }
        }
    ],
    scaleItTags: ['CashFlow', 'Alliance', 'Execution'],
    processedAt: '2026-01-15T11:30:00Z'
};

// =============================================================================
// Components
// =============================================================================

const StatusBadge: React.FC<{ status: AIMetadata['status'] }> = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        edited: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
            {status === 'pending' ? 'Needs Review' : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const PillarBadge: React.FC<{ pillar: string }> = ({ pillar }) => {
    const colors: Record<string, string> = {
        Strategic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        CashFlow: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        Alliance: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        Leadership: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        Execution: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[pillar] || colors.Execution}`}>
            {pillar}
        </span>
    );
};

const ConfidenceBar: React.FC<{ confidence: number }> = ({ confidence }) => {
    const percentage = Math.round(confidence * 100);
    const color = percentage >= 85 ? 'bg-green-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
            </div>
            <span className="text-xs text-on-surface-variant">{percentage}%</span>
        </div>
    );
};

const ApprovalButtons: React.FC<{
    onApprove: () => void;
    onReject: () => void;
    onEdit: () => void;
}> = ({ onApprove, onReject, onEdit }) => (
    <div className="flex gap-2">
        <button
            onClick={onApprove}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
            <CheckCircle className="w-4 h-4" />
            Approve
        </button>
        <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-on-surface bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors"
        >
            <Edit3 className="w-4 h-4" />
            Edit
        </button>
        <button
            onClick={onReject}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
            <XCircle className="w-4 h-4" />
            Reject
        </button>
    </div>
);

// =============================================================================
// Tab Content Components
// =============================================================================

const SummaryTab: React.FC<{ processed: ProcessedSession }> = ({ processed }) => (
    <div className="space-y-6">
        <div className="bg-surface-container rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-on-surface">Executive Summary</h3>
                <div className="flex items-center gap-3">
                    <ConfidenceBar confidence={processed.summary.aiMetadata.confidence} />
                    <StatusBadge status={processed.summary.aiMetadata.status} />
                </div>
            </div>
            <p className="text-on-surface-variant leading-relaxed mb-4">
                {processed.summary.executiveSummary}
            </p>
            <div className="border-t border-outline-variant pt-4">
                <h4 className="text-sm font-medium text-on-surface mb-2">Key Points</h4>
                <ul className="space-y-2">
                    {processed.summary.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                            <span className="w-1.5 h-1.5 mt-1.5 bg-primary rounded-full flex-shrink-0" />
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="flex gap-2">
            {processed.scaleItTags.map(pillar => (
                <PillarBadge key={pillar} pillar={pillar} />
            ))}
        </div>
    </div>
);

const DecisionsTab: React.FC<{ decisions: Decision[] }> = ({ decisions }) => {
    const handleApprove = (id: string) => console.log('Approve decision:', id);
    const handleReject = (id: string) => console.log('Reject decision:', id);
    const handleEdit = (id: string) => console.log('Edit decision:', id);

    return (
        <div className="space-y-4">
            {decisions.map(decision => (
                <div key={decision.id} className="bg-surface-container rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            <PillarBadge pillar={decision.scaleItPillar} />
                        </div>
                        <StatusBadge status={decision.aiMetadata.status} />
                    </div>

                    <h4 className="text-lg font-medium text-on-surface mb-2">{decision.text}</h4>
                    <p className="text-sm text-on-surface-variant mb-4">{decision.context}</p>

                    <div className="bg-surface-container-low rounded-lg p-3 mb-4">
                        <p className="text-sm italic text-on-surface-variant">"{decision.sourceQuote}"</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <ConfidenceBar confidence={decision.aiMetadata.confidence} />
                        {decision.aiMetadata.status === 'pending' && (
                            <ApprovalButtons
                                onApprove={() => handleApprove(decision.id)}
                                onReject={() => handleReject(decision.id)}
                                onEdit={() => handleEdit(decision.id)}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const CommitmentsTab: React.FC<{ commitments: Commitment[] }> = ({ commitments }) => {
    const handleApprove = (id: string) => console.log('Approve commitment:', id);
    const handleReject = (id: string) => console.log('Reject commitment:', id);
    const handleEdit = (id: string) => console.log('Edit commitment:', id);

    const urgencyColors = {
        critical: 'text-red-600',
        high: 'text-orange-600',
        medium: 'text-yellow-600',
        low: 'text-green-600'
    };

    return (
        <div className="space-y-4">
            {commitments.map(commitment => (
                <div key={commitment.id} className="bg-surface-container rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            <PillarBadge pillar={commitment.scaleItPillar} />
                            <span className={`text-xs font-medium ${urgencyColors[commitment.urgency]}`}>
                                {commitment.urgency.toUpperCase()}
                            </span>
                        </div>
                        <StatusBadge status={commitment.aiMetadata.status} />
                    </div>

                    <h4 className="text-lg font-medium text-on-surface mb-2">{commitment.text}</h4>

                    <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-3">
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {commitment.owner === 'member' ? 'Member' : 'Mentor'}
                        </span>
                        {commitment.suggestedDeadline && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(commitment.suggestedDeadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-on-surface-variant mb-4">{commitment.businessContext}</p>

                    <div className="bg-surface-container-low rounded-lg p-3 mb-4">
                        <p className="text-sm italic text-on-surface-variant">"{commitment.sourceQuote}"</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <ConfidenceBar confidence={commitment.aiMetadata.confidence} />
                        {commitment.aiMetadata.status === 'pending' && (
                            <ApprovalButtons
                                onApprove={() => handleApprove(commitment.id)}
                                onReject={() => handleReject(commitment.id)}
                                onEdit={() => handleEdit(commitment.id)}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const RisksTab: React.FC<{ risks: RiskSignal[] }> = ({ risks }) => {
    const severityStyles = {
        critical: 'border-red-500 bg-red-50 dark:bg-red-900/10',
        warning: 'border-orange-500 bg-orange-50 dark:bg-orange-900/10',
        watch: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
    };

    return (
        <div className="space-y-4">
            {risks.map(risk => (
                <div key={risk.id} className={`rounded-xl p-6 border-l-4 ${severityStyles[risk.severity]}`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-5 h-5 ${risk.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                            <span className="text-sm font-medium text-on-surface capitalize">{risk.category}</span>
                            <span className={`text-xs font-bold uppercase ${risk.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>
                                {risk.severity}
                            </span>
                        </div>
                        <StatusBadge status={risk.aiMetadata.status} />
                    </div>

                    <h4 className="text-lg font-medium text-on-surface mb-2">{risk.description}</h4>

                    <div className="mb-4">
                        <h5 className="text-sm font-medium text-on-surface mb-2">Indicators:</h5>
                        <ul className="space-y-1">
                            {risk.indicators.map((indicator, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                                    <span className="w-1 h-1 mt-2 bg-on-surface-variant rounded-full" />
                                    {indicator}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-surface rounded-lg p-3 mb-4">
                        <h5 className="text-sm font-medium text-on-surface mb-1">Suggested Action:</h5>
                        <p className="text-sm text-on-surface-variant">{risk.suggestedAction}</p>
                    </div>

                    <ConfidenceBar confidence={risk.aiMetadata.confidence} />
                </div>
            ))}

            {risks.length === 0 && (
                <div className="text-center py-8 text-on-surface-variant">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No risks detected in this session</p>
                </div>
            )}
        </div>
    );
};

const OpportunitiesTab: React.FC<{ opportunities: Opportunity[] }> = ({ opportunities }) => {
    const impactColors = {
        high: 'text-green-600 bg-green-100 dark:bg-green-900/20',
        medium: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
        low: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    };

    return (
        <div className="space-y-4">
            {opportunities.map(opp => (
                <div key={opp.id} className="bg-surface-container rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            <PillarBadge pillar={opp.scaleItPillar} />
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${impactColors[opp.potentialImpact]}`}>
                                {opp.potentialImpact.toUpperCase()} IMPACT
                            </span>
                        </div>
                        <StatusBadge status={opp.aiMetadata.status} />
                    </div>

                    <h4 className="text-lg font-medium text-on-surface mb-2">{opp.title}</h4>
                    <p className="text-sm text-on-surface-variant mb-4">{opp.description}</p>

                    <div className="mb-4">
                        <h5 className="text-sm font-medium text-on-surface mb-2">Suggested Next Steps:</h5>
                        <ol className="space-y-1">
                            {opp.suggestedNextSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                                    <span className="w-5 h-5 flex items-center justify-center text-xs font-medium bg-primary text-on-primary rounded-full flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>

                    <ConfidenceBar confidence={opp.aiMetadata.confidence} />
                </div>
            ))}
        </div>
    );
};

const TranscriptTab: React.FC<{ session: Session }> = ({ session }) => {
    const [expanded, setExpanded] = useState(false);

    const mockTranscript = `[00:00] Mentor: Welcome to today's session. How has your week been?

[00:15] Member: It's been challenging. We had some issues with cash flow this week.

[01:30] Mentor: Let's dig into that. What specifically happened with the cash flow?

[02:00] Member: Our largest client delayed payment by 30 days, which put pressure on payroll.

[03:15] Mentor: That's a common challenge. Let's work on a strategy to prevent this. Have you considered implementing milestone-based payments?

[04:00] Member: I haven't, but that sounds like it could help.

[05:00] Mentor: Great. Let's add that as an action item. Also, have you looked into a line of credit as a safety net?

[06:00] Member: That's something I've been putting off. I'll commit to researching options this week.

[07:00] Mentor: Perfect. Let's also review your team structure - any updates there?

[08:00] Member: We're considering hiring a part-time bookkeeper.

[09:00] Mentor: That would definitely help with the cash flow visibility. What's your timeline for that hire?

[10:00] Member: I'd like to have someone in place within 60 days.`;

    return (
        <div className="bg-surface-container rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Session Transcript
                </h3>
                <div className="flex items-center gap-3">
                    {session.recording && (
                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                            <Play className="w-4 h-4" />
                            Play Recording
                        </button>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface"
                    >
                        {expanded ? 'Collapse' : 'Expand'}
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <pre className={`whitespace-pre-wrap font-mono text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-4 ${expanded ? '' : 'max-h-64 overflow-hidden'}`}>
                {mockTranscript}
            </pre>

            {!expanded && (
                <div className="text-center pt-2">
                    <button
                        onClick={() => setExpanded(true)}
                        className="text-sm text-primary hover:underline"
                    >
                        Show full transcript
                    </button>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// Main Component
// =============================================================================

const OnboardingTab: React.FC<{ session: Session }> = ({ session }) => {
    return (
        <div className="space-y-6">
            <div className="bg-surface-container rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-on-surface">Onboarding Checklist</h3>
                        <p className="text-sm text-on-surface-variant">First Intro Call: 5 Priority Topics</p>
                    </div>
                    <div className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-bold px-2.5 py-1 rounded-full">
                        AI DETECTED: 3/5 COMPLETED
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Simulated Checklist */}
                    {[
                        { title: 'Current Business Cash Flow Status', completed: true },
                        { title: 'Immediate Core Challenges', completed: true },
                        { title: 'Introduce SCALEit Methodology Core Concepts', completed: true },
                        { title: 'Define 90-Day North Star Metric', completed: false },
                        { title: 'Schedule Recurring One-on-Ones', completed: false },
                    ].map((item, idx) => (
                        <div key={idx} className={`flex items-center gap-4 p-3 rounded-lg border ${item.completed ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30' : 'border-outline-variant bg-surface'}`}>
                            {item.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex-shrink-0" />
                            )}
                            <span className={`text-sm font-medium ${item.completed ? 'text-green-900 dark:text-green-100' : 'text-on-surface'}`}>
                                {item.title}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-outline-variant flex items-center justify-between">
                    <p className="text-sm text-on-surface-variant flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        2 topics were missed. You should schedule a follow-up.
                    </p>
                    <button className="px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                        Schedule Follow-Up Session
                    </button>
                </div>
            </div>
        </div>
    );
};

const SessionWorkspacePage: React.FC = () => {
    const { id: sessionId } = useParams<{ id: string }>();
    const [session] = useState<Session>(MOCK_SESSION);
    const [processed] = useState<ProcessedSession>(MOCK_PROCESSED);
    const [activeTab, setActiveTab] = useState<TabType | 'onboarding'>(session.type === 'onboarding' ? 'onboarding' : 'summary');

    const tabs: { id: TabType | 'onboarding'; label: string; count?: number }[] = [
        ...(session.type === 'onboarding' ? [{ id: 'onboarding' as const, label: 'Onboarding' }] : []),
        { id: 'summary', label: 'Summary' },
        { id: 'decisions', label: 'Decisions', count: processed.decisions.length },
        { id: 'commitments', label: 'Commitments', count: processed.commitments.length },
        { id: 'risks', label: 'Risks', count: processed.risks.length },
        { id: 'opportunities', label: 'Opportunities', count: processed.opportunities.length },
        { id: 'transcript', label: 'Transcript' }
    ];

    const pendingCount = [
        ...processed.decisions,
        ...processed.commitments,
        ...processed.risks,
        ...processed.opportunities
    ].filter(item => item.aiMetadata.status === 'pending').length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Session Workspace"
                description={`${session.title} • ${new Date(session.scheduledAt).toLocaleDateString()}`}
            >
                {pendingCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">
                        <MessageSquare className="w-4 h-4" />
                        {pendingCount} items need review
                    </div>
                )}
            </PageHeader>

            {/* Session Info Bar */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-surface-container rounded-xl">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-sm text-on-surface">{session.memberName}</span>
                    <span className="text-on-surface-variant">with</span>
                    <span className="text-sm text-on-surface">{session.mentorName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-sm text-on-surface-variant">{session.duration} min</span>
                </div>
                <div className="flex gap-1">
                    {session.scaleItPillars.map(pillar => (
                        <PillarBadge key={pillar} pillar={pillar} />
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-outline-variant">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-on-surface-variant hover:text-on-surface'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'onboarding' && <OnboardingTab session={session} />}
                {activeTab === 'summary' && <SummaryTab processed={processed} />}
                {activeTab === 'decisions' && <DecisionsTab decisions={processed.decisions} />}
                {activeTab === 'commitments' && <CommitmentsTab commitments={processed.commitments} />}
                {activeTab === 'risks' && <RisksTab risks={processed.risks} />}
                {activeTab === 'opportunities' && <OpportunitiesTab opportunities={processed.opportunities} />}
                {activeTab === 'transcript' && <TranscriptTab session={session} />}
            </div>
        </div>
    );
};

export default SessionWorkspacePage;
