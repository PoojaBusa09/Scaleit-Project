/**
 * Decision Matrix Page (V1 Parity)
 * Tool for evaluating new business initiatives.
 * Members answer predefined questions and rate preparedness 1-5.
 * Total score indicates risk tolerance and readiness.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    CheckCircle,
    AlertTriangle,
    XCircle,
    RefreshCw,
    Download,
    ChevronDown,
    ChevronUp,
    Target,
    DollarSign,
    Users,
    Clock,
    Shield,
    Info
} from 'lucide-react';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// =============================================================================
// Types
// =============================================================================

interface Question {
    id: string;
    category: string;
    icon: React.ElementType;
    text: string;
    description: string;
}

interface QuestionAnswer {
    questionId: string;
    score: number;
    notes: string;
}

// =============================================================================
// Constants
// =============================================================================

const DECISION_QUESTIONS: Question[] = [
    {
        id: 'market_demand',
        category: 'Market',
        icon: Target,
        text: 'Market Demand',
        description: 'Is there clear, validated demand for this initiative?'
    },
    {
        id: 'financial_viability',
        category: 'Financial',
        icon: DollarSign,
        text: 'Financial Viability',
        description: 'Do the numbers make sense? Is ROI clear and achievable?'
    },
    {
        id: 'team_capability',
        category: 'Team',
        icon: Users,
        text: 'Team Capability',
        description: 'Does your team have the skills and bandwidth to execute?'
    },
    {
        id: 'timeline_fit',
        category: 'Timing',
        icon: Clock,
        text: 'Timeline Fit',
        description: 'Is the timing right? Can you commit the necessary time?'
    },
    {
        id: 'risk_tolerance',
        category: 'Risk',
        icon: Shield,
        text: 'Risk Assessment',
        description: 'Are the risks understood and manageable?'
    }
];

const SCORE_LABELS = [
    { value: 1, label: 'Not Ready', color: 'bg-red-500' },
    { value: 2, label: 'Needs Work', color: 'bg-orange-500' },
    { value: 3, label: 'Uncertain', color: 'bg-yellow-500' },
    { value: 4, label: 'Mostly Ready', color: 'bg-lime-500' },
    { value: 5, label: 'Fully Ready', color: 'bg-green-500' }
];

// =============================================================================
// Components
// =============================================================================

const ScoreSelector: React.FC<{
    value: number;
    onChange: (value: number) => void;
}> = ({ value, onChange }) => (
    <div className="flex gap-2">
        {SCORE_LABELS.map(({ value: score, label, color }) => (
            <button
                key={score}
                onClick={() => onChange(score)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${value === score
                    ? 'ring-2 ring-primary bg-primary/10'
                    : 'hover:bg-surface-container-high'
                    }`}
            >
                <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold`}>
                    {score}
                </div>
                <span className="text-xs text-on-surface-variant">{label}</span>
            </button>
        ))}
    </div>
);

const QuestionCard: React.FC<{
    question: Question;
    answer: QuestionAnswer | undefined;
    isExpanded: boolean;
    onToggle: () => void;
    onScoreChange: (score: number) => void;
    onNotesChange: (notes: string) => void;
}> = ({ question, answer, isExpanded, onToggle, onScoreChange, onNotesChange }) => {
    const Icon = question.icon;
    const score = answer?.score || 0;
    const scoreConfig = SCORE_LABELS.find(s => s.value === score);

    return (
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-surface-container-high transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-medium text-on-surface">{question.text}</h3>
                        <p className="text-sm text-on-surface-variant">{question.category}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {score > 0 && (
                        <div className={`w-8 h-8 rounded-full ${scoreConfig?.color} flex items-center justify-center text-white font-bold text-sm`}>
                            {score}
                        </div>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-on-surface-variant" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-on-surface-variant" />
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-outline-variant pt-4">
                    <p className="text-on-surface-variant">{question.description}</p>

                    <div>
                        <h4 className="text-sm font-medium text-on-surface mb-3">Rate Your Preparedness (1-5)</h4>
                        <ScoreSelector value={score} onChange={onScoreChange} />
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-on-surface mb-2">Notes (Optional)</h4>
                        <textarea
                            value={answer?.notes || ''}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Add context or considerations..."
                            className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                            rows={2}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const ResultsCard: React.FC<{
    totalScore: number;
    maxScore: number;
    answeredCount: number;
    totalQuestions: number;
}> = ({ totalScore, maxScore, answeredCount, totalQuestions }) => {
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    const getRecommendation = () => {
        if (answeredCount < totalQuestions) {
            return {
                status: 'incomplete',
                icon: AlertTriangle,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                title: 'Assessment Incomplete',
                message: 'Answer all questions to get a complete recommendation.'
            };
        }
        if (percentage >= 80) {
            return {
                status: 'go',
                icon: CheckCircle,
                color: 'text-green-600',
                bgColor: 'bg-green-50 dark:bg-green-900/20',
                title: 'Strong Go Signal',
                message: 'High readiness across all areas. Consider proceeding with this initiative.'
            };
        }
        if (percentage >= 60) {
            return {
                status: 'caution',
                icon: AlertTriangle,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                title: 'Proceed with Caution',
                message: 'Some areas need attention. Address gaps before fully committing.'
            };
        }
        return {
            status: 'stop',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            title: 'Not Recommended',
            message: 'Significant gaps exist. Consider delaying or re-evaluating this initiative.'
        };
    };

    const rec = getRecommendation();
    const Icon = rec.icon;

    return (
        <div className={`rounded-xl p-6 ${rec.bgColor}`}>
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${rec.color}`} />
                </div>
                <div className="flex-1">
                    <h3 className={`text-xl font-semibold ${rec.color}`}>{rec.title}</h3>
                    <p className="text-on-surface-variant mt-1">{rec.message}</p>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-2xl font-bold text-on-surface">{totalScore}/{maxScore}</p>
                            <p className="text-sm text-on-surface-variant">Total Score</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-on-surface">{percentage}%</p>
                            <p className="text-sm text-on-surface-variant">Readiness</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-on-surface">{answeredCount}/{totalQuestions}</p>
                            <p className="text-sm text-on-surface-variant">Answered</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// Main Component
// =============================================================================

const DecisionMatrix: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [initiativeName, setInitiativeName] = useState('New Product Launch');
    const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(DECISION_QUESTIONS[0].id);

    const handleScoreChange = (questionId: string, score: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: { ...prev[questionId], questionId, score, notes: prev[questionId]?.notes || '' }
        }));
    };

    const handleNotesChange = (questionId: string, notes: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: { ...prev[questionId], questionId, notes, score: prev[questionId]?.score || 0 }
        }));
    };

    const handleReset = () => {
        setAnswers({});
        setInitiativeName('');
    };

    const { totalScore, maxScore, answeredCount } = useMemo(() => {
        const answered = (Object.values(answers) as QuestionAnswer[]).filter((a) => a.score > 0);
        return {
            totalScore: answered.reduce((sum, a) => sum + a.score, 0),
            maxScore: DECISION_QUESTIONS.length * 5,
            answeredCount: answered.length
        };
    }, [answers]);

    const navigate = useNavigate();

    return (
        <div className="space-y-6 animate-fade-in">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Decision Matrix Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        The Decision Matrix is used to evaluate the potential of new business initiatives, products, or major projects.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Initiative Name:</strong> Give your project a clear name.</li>
                        <li><strong>Evaluate:</strong> Rate your preparedness from 1 (Not Ready) to 5 (Fully Ready) across 5 key areas.</li>
                        <li><strong>Result:</strong> Review the Readiness score to determine if you should Proceed, use Caution, or Re-evaluate.</li>
                    </ul>
                    <p>
                        A score above 80% is generally considered a strong signal to move forward.
                    </p>
                </div>
            </InstructionsModal>
            <PageHeader
                title="Decision Matrix"
                description="Evaluate new business initiatives by rating your preparedness across key factors."
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
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-on-surface bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </PageHeader>

            {/* Initiative Name */}
            <div className="bg-surface-container rounded-xl p-4">
                <label className="block text-sm font-medium text-on-surface mb-2">
                    Initiative Name
                </label>
                <input
                    type="text"
                    value={initiativeName}
                    onChange={(e) => setInitiativeName(e.target.value)}
                    placeholder="Enter the initiative you're evaluating..."
                    className="w-full p-3 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            {/* Results Card */}
            <ResultsCard
                totalScore={totalScore}
                maxScore={maxScore}
                answeredCount={answeredCount}
                totalQuestions={DECISION_QUESTIONS.length}
            />

            {/* Questions */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-on-surface">Evaluation Criteria</h2>
                {DECISION_QUESTIONS.map(question => (
                    <QuestionCard
                        key={question.id}
                        question={question}
                        answer={answers[question.id]}
                        isExpanded={expandedQuestion === question.id}
                        onToggle={() => setExpandedQuestion(
                            expandedQuestion === question.id ? null : question.id
                        )}
                        onScoreChange={(score) => handleScoreChange(question.id, score)}
                        onNotesChange={(notes) => handleNotesChange(question.id, notes)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DecisionMatrix;
