/**
 * Score Tracker Page (V1 Parity)
 * Phase-based view of business readiness and progress.
 * Members select current phase and assign Red/Yellow/Green status.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Save, TrendingUp, Info, Clock, History } from 'lucide-react';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// =============================================================================
// Types
// =============================================================================

type StatusColor = 'red' | 'yellow' | 'green';
type BusinessPhase = 'startup' | 'growth' | 'scaling' | 'maturity';

interface PhaseScore {
    phase: BusinessPhase;
    status: StatusColor;
    notes: string;
    updatedAt: string;
    history?: { status: StatusColor; notes: string; date: string }[];
}

interface PhaseInfo {
    id: BusinessPhase;
    name: string;
    description: string;
    characteristics: string[];
}

// =============================================================================
// Constants
// =============================================================================

const BUSINESS_PHASES: PhaseInfo[] = [
    {
        id: 'startup',
        name: 'Startup Phase',
        description: 'Building foundation and proving concept',
        characteristics: [
            'Establishing product-market fit',
            'Building initial customer base',
            'Defining core processes',
            'Revenue under $500K annually'
        ]
    },
    {
        id: 'growth',
        name: 'Growth Phase',
        description: 'Scaling operations and team',
        characteristics: [
            'Consistent revenue growth',
            'Expanding team size',
            'Formalizing operations',
            'Revenue $500K - $2M annually'
        ]
    },
    {
        id: 'scaling',
        name: 'Scaling Phase',
        description: 'Optimizing for efficiency and expansion',
        characteristics: [
            'Multiple revenue streams',
            'Professional management team',
            'Standardized processes',
            'Revenue $2M - $10M annually'
        ]
    },
    {
        id: 'maturity',
        name: 'Maturity Phase',
        description: 'Market leadership and optimization',
        characteristics: [
            'Market leadership position',
            'Strong brand recognition',
            'Focus on efficiency and innovation',
            'Revenue over $10M annually'
        ]
    }
];

const STATUS_CONFIG = {
    green: {
        color: 'bg-green-500',
        bgLight: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-500',
        text: 'text-green-700 dark:text-green-300',
        icon: CheckCircle,
        label: 'On Track'
    },
    yellow: {
        color: 'bg-yellow-500',
        bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-500',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: AlertTriangle,
        label: 'Needs Attention'
    },
    red: {
        color: 'bg-red-500',
        bgLight: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-500',
        text: 'text-red-700 dark:text-red-300',
        icon: XCircle,
        label: 'At Risk'
    }
};

// =============================================================================
// Components
// =============================================================================

const StatusButton: React.FC<{
    status: StatusColor;
    selected: boolean;
    onClick: () => void;
}> = ({ status, selected, onClick }) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${selected
                ? `${config.bgLight} ${config.border} ${config.text}`
                : 'border-outline-variant hover:border-outline bg-surface'
                }`}
        >
            <Icon className={`w-5 h-5 ${selected ? config.text : 'text-on-surface-variant'}`} />
            <span className={`font-medium ${selected ? config.text : 'text-on-surface'}`}>
                {config.label}
            </span>
        </button>
    );
};

const PhaseCard: React.FC<{
    phase: PhaseInfo;
    score?: PhaseScore;
    isSelected: boolean;
    onSelect: () => void;
    onStatusChange: (status: StatusColor) => void;
    onNotesChange: (notes: string) => void;
}> = ({ phase, score, isSelected, onSelect, onStatusChange, onNotesChange }) => {
    const currentStatus = score?.status || 'yellow';
    const config = STATUS_CONFIG[currentStatus];
    const [showHistory, setShowHistory] = React.useState(false);

    return (
        <div
            className={`rounded-xl border-2 transition-all ${isSelected
                ? `${config.border} ${config.bgLight}`
                : 'border-outline-variant bg-surface hover:border-outline'
                }`}
        >
            {/* Header */}
            <button
                onClick={onSelect}
                className="w-full p-4 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${config.color}`} />
                    <div>
                        <h3 className="text-lg font-semibold text-on-surface">{phase.name}</h3>
                        <p className="text-sm text-on-surface-variant">{phase.description}</p>
                    </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-on-surface-variant transition-transform ${isSelected ? 'rotate-90' : ''}`} />
            </button>

            {/* Expanded Content */}
            {isSelected && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Characteristics */}
                    <div>
                        <h4 className="text-sm font-medium text-on-surface mb-2">Characteristics</h4>
                        <ul className="space-y-1">
                            {phase.characteristics.map((char, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                                    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant" />
                                    {char}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Status Selection */}
                    <div>
                        <h4 className="text-sm font-medium text-on-surface mb-2">Your Status</h4>
                        <div className="flex flex-wrap gap-2">
                            {(['green', 'yellow', 'red'] as StatusColor[]).map(status => (
                                <StatusButton
                                    key={status}
                                    status={status}
                                    selected={currentStatus === status}
                                    onClick={() => onStatusChange(status)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <h4 className="text-sm font-medium text-on-surface mb-2">Notes</h4>
                        <textarea
                            value={score?.notes || ''}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Add notes about your current situation..."
                            className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                            rows={3}
                        />
                    </div>

                    {/* Historical Score Comparison View */}
                    {score?.history && score.history.length > 0 && (
                        <div className="mt-6 border-t border-outline-variant pt-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHistory(!showHistory);
                                }}
                                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                <History className="w-4 h-4" />
                                {showHistory ? 'Hide Score History' : 'View Score History'}
                            </button>

                            {showHistory && (
                                <div className="mt-4 space-y-4 pl-2 border-l-2 border-outline-variant/50">
                                    {score.history.map((record, idx) => (
                                        <div key={idx} className="relative pl-6">
                                            {/* Timeline dot */}
                                            <div className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-surface ${STATUS_CONFIG[record.status].color}`} />
                                            
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                                                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                                        {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[record.status].bgLight} ${STATUS_CONFIG[record.status].text}`}>
                                                    {STATUS_CONFIG[record.status].label}
                                                </span>
                                            </div>
                                            <div className="bg-surface-container rounded p-3 text-sm text-on-surface">
                                                {record.notes ? `"${record.notes}"` : <span className="text-on-surface-variant italic">No notes recorded</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// =============================================================================
// Main Component
// =============================================================================

const ScoreTracker: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [selectedPhase, setSelectedPhase] = useState<BusinessPhase>('growth');
    const [scores, setScores] = useState<Record<BusinessPhase, PhaseScore>>({
        startup: { 
            phase: 'startup', status: 'green', notes: 'Completed this phase successfully.', updatedAt: new Date().toISOString(),
            history: [
                { status: 'yellow', notes: 'Refining product-market fit.', date: '2025-04-10T10:00:00Z' },
                { status: 'red', notes: 'Initial testing phase.', date: '2025-01-15T10:00:00Z' }
            ]
        },
        growth: { 
            phase: 'growth', status: 'yellow', notes: 'Working on team expansion and process formalization.', updatedAt: new Date().toISOString(),
            history: [
                { status: 'red', notes: 'Just started hiring, operations are chaotic.', date: '2025-06-20T10:00:00Z' }
            ]
        },
        scaling: { phase: 'scaling', status: 'red', notes: '', updatedAt: new Date().toISOString() },
        maturity: { phase: 'maturity', status: 'red', notes: '', updatedAt: new Date().toISOString() }
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleStatusChange = (phase: BusinessPhase, status: StatusColor) => {
        setScores(prev => ({
            ...prev,
            [phase]: { ...prev[phase], status, updatedAt: new Date().toISOString() }
        }));
    };

    const handleNotesChange = (phase: BusinessPhase, notes: string) => {
        setScores(prev => ({
            ...prev,
            [phase]: { ...prev[phase], notes, updatedAt: new Date().toISOString() }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Mock save - would call API in production
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
    };

    // Calculate overall health
    const overallStatus = (): StatusColor => {
        const currentPhaseScore = scores[selectedPhase];
        return currentPhaseScore.status;
    };

    const navigate = useNavigate();

    return (
        <div className="space-y-6 animate-fade-in">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Score Tracker Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        The Score Tracker helps you assess your business readiness across four distinct growth phases.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Select a Phase:</strong> Click on a phase to expand it and see its characteristics.</li>
                        <li><strong>Set Status:</strong> Assign a Red, Yellow, or Green status based on how well you meet the characteristics.</li>
                        <li><strong>Add Notes:</strong> Document specifically what needs to happen to move to 'Green' or the next phase.</li>
                    </ul>
                    <p>
                        Review this regularly with your mentor to track your evolution from Startup to Maturity.
                    </p>
                </div>
            </InstructionsModal>
            <PageHeader
                title="Score Tracker"
                description="Track your business phase and readiness with Red/Yellow/Green status indicators."
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm mr-2"
                    >
                        <Info className="w-4 h-4 text-blue-600" />
                        Instructions
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Progress'}
                    </button>
                </div>
            </PageHeader>

            {/* Summary Card */}
            <div className="bg-surface-container rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-on-surface">Current Phase</h2>
                        <p className="text-on-surface-variant">
                            {BUSINESS_PHASES.find(p => p.id === selectedPhase)?.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-on-surface-variant">Overall Status</p>
                            <p className={`text-lg font-semibold ${STATUS_CONFIG[overallStatus()].text}`}>
                                {STATUS_CONFIG[overallStatus()].label}
                            </p>
                        </div>
                        <div className={`w-12 h-12 rounded-full ${STATUS_CONFIG[overallStatus()].color} flex items-center justify-center`}>
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase Cards */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-on-surface">Business Phases</h2>
                {BUSINESS_PHASES.map(phase => (
                    <PhaseCard
                        key={phase.id}
                        phase={phase}
                        score={scores[phase.id]}
                        isSelected={selectedPhase === phase.id}
                        onSelect={() => setSelectedPhase(phase.id)}
                        onStatusChange={(status) => handleStatusChange(phase.id, status)}
                        onNotesChange={(notes) => handleNotesChange(phase.id, notes)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ScoreTracker;
