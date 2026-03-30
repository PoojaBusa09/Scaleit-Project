import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRightIcon,
    ChevronLeftIcon,
    RotateCcwIcon,
    AwardIcon,
    StarIcon,
    CheckCircleIcon
} from 'lucide-react';

// =============================================================================
// Data & Types
// =============================================================================

interface LeadershipQuestion {
    id: number;
    text: string;
}

const QUESTIONS: LeadershipQuestion[] = [
    { id: 1, text: "You stay focused most of the time so you don't put your team into a tail spin." },
    { id: 2, text: "You keep your direction clear and consistent so you're not confusing the heck out of your team." },
    { id: 3, text: "You empower your team to come up with solutions rather than micro-manage their work." },
    { id: 4, text: "You accept feedback with \"Thank You\" instead of \"Yes, but...\"" },
    { id: 5, text: "You give credit to your team in a way that's meaningful to them." },
    { id: 6, text: "You put your phone down and give attention in a meeting to the person or people you are with like they are the only one in the Universe at the moment." },
    { id: 7, text: "You take responsibility instead of making excuses." },
    { id: 8, text: "You show up with a positive attitude when working with the team." },
    { id: 9, text: "You respond calmly when angry with no angry emails or texts." },
    { id: 10, text: "When a team member offers an idea, you acknowledge it instead of explaining why it's not going to work." },
    { id: 11, text: "You show interest in your team by asking your team members questions about their family, their weekend, their passions." },
    { id: 12, text: "You admit when you're wrong." }
];

interface QuizResult {
    totalScore: number;
    completionDate: string;
}

// =============================================================================
// Components
// =============================================================================

const IntroScreen: React.FC<{ onStart: () => void; lastResult: QuizResult | null }> = ({ onStart, lastResult }) => (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <AwardIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Leadership Assessment</h1>
        <p className="text-lg text-slate-600 mb-6 max-w-2xl text-center leading-relaxed">
            Answer each leadership question to bring awareness to how you are showing up in your company and with your team.
        </p>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 w-full max-w-lg text-left">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                <StarIcon className="w-4 h-4 text-yellow-500 fill-current" /> Instructions
            </h3>
            <ul className="space-y-2 text-slate-600 text-sm font-medium">
                <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Rank yourself between 1-10 on each statement.</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>Calculate your score to see where you stand.</span>
                </li>
            </ul>
        </div>

        {lastResult && (
            <div className="mb-6 inline-block bg-slate-100/80 px-4 py-1.5 rounded-lg text-slate-500 text-xs font-bold uppercase tracking-wider">
                Last score: <span className="text-slate-900">{lastResult.totalScore}</span> <span className="text-slate-400 mx-1">•</span> {new Date(lastResult.completionDate).toLocaleDateString()}
            </div>
        )}

        <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-10 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
            Start Assessment
        </button>
    </div>
);

const QuestionCard: React.FC<{
    question: LeadershipQuestion;
    value: number;
    onChange: (val: number) => void;
    onNext: () => void;
    onPrev: () => void;
    isFirst: boolean;
    isLast: boolean;
    progress: number;
}> = ({ question, value, onChange, onNext, onPrev, isFirst, isLast, progress }) => {
    return (
        <div className="flex flex-col justify-center h-full max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Progress Bar */}
            <div className="mb-6 w-full max-w-xl mx-auto">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center w-full">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider mb-4">
                    Question {question.id} of {QUESTIONS.length}
                </span>

                <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-snug">{question.text}</h2>

                <div className="mb-10 px-4 max-w-lg mx-auto">
                    <div className="relative pt-6 pb-2">
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={value}
                            onChange={(e) => onChange(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 accent-blue-600"
                        />
                        {/* Tick Marks */}
                        <div className="absolute top-7 left-0 right-0 flex justify-between px-1 pointer-events-none">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <div key={n} className="w-0.5 h-1 bg-slate-300/50"></div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>0</span>
                        <span className="text-blue-600 text-2xl font-black -mt-1">{value}</span>
                        <span>10</span>
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                    <button
                        onClick={onPrev}
                        disabled={isFirst}
                        className={`flex items-center gap-1 text-sm font-bold transition-colors ${isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <ChevronLeftIcon className="w-4 h-4" /> Previous
                    </button>

                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-all transform hover:translate-x-1 shadow-md hover:shadow-lg"
                    >
                        {isLast ? "Finish" : "Next"} <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ResultsScreen: React.FC<{ result: QuizResult; onRetake: () => void }> = ({ result, onRetake }) => {
    const maxScore = QUESTIONS.length * 10;

    // Simple logic: if less than ~75% (90 points), show the "below average" message.
    // Otherwise show a positive message.
    const isBelowAverage = result.totalScore < 90;

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-6 animate-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Assessment Complete</h2>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 mb-8 relative overflow-hidden w-full max-w-xl text-center">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${isBelowAverage ? 'bg-orange-500' : 'bg-green-500'}`}></div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Your Leadership Score</p>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="text-7xl font-black text-slate-900">{result.totalScore}</span>
                    <span className="text-xl font-bold text-slate-300 self-end mb-3">/ {maxScore}</span>
                </div>

                {isBelowAverage ? (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-6">
                        <h3 className="text-lg font-bold text-orange-800 mb-2">Your leadership score is below that of an average business owner.</h3>
                        <p className="text-sm text-orange-700 leading-relaxed">
                            If you struggle with team communication, motivation, and things are slipping through the cracks, it's most likely a leadership issue.
                        </p>
                    </div>
                ) : (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                        <h3 className="text-lg font-bold text-green-800 mb-2">Great Job!</h3>
                        <p className="text-sm text-green-700 leading-relaxed">
                            You are showing strong leadership qualities. Continue to refine your skills and support your team.
                        </p>
                    </div>
                )}

                <p className="text-sm text-slate-500 font-medium">
                    We can help you fix it. <a href="https://www.pinnacleglobalnetwork.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.pinnacleglobalnetwork.com</a>
                </p>
            </div>

            <button
                onClick={onRetake}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-6 py-2 rounded-full hover:bg-slate-100 transition-colors text-sm"
            >
                <RotateCcwIcon className="w-4 h-4" /> Retake Assessment
            </button>
        </div>
    );
};


export const LeadershipAssessment: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'intro' | 'quiz' | 'results'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [lastResult, setLastResult] = useState<QuizResult | null>(null);
    const [showInstructions, setShowInstructions] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_leadership_score');
        if (saved) {
            setLastResult(JSON.parse(saved));
        }
    }, []);

    const handleStart = () => {
        setStep('quiz');
        setCurrentQuestionIndex(0);
        // Initialize all answers to 5 (neutral)
        const initialAnswers: Record<number, number> = {};
        QUESTIONS.forEach(q => initialAnswers[q.id] = 5);
        setAnswers(initialAnswers);
    };

    const handleAnswerChange = (val: number) => {
        const questionId = QUESTIONS[currentQuestionIndex].id;
        setAnswers(prev => ({ ...prev, [questionId]: val }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const finishQuiz = () => {
        const totalScore = Object.values(answers).reduce((acc: number, val: number) => acc + val, 0);
        const result: QuizResult = {
            totalScore,
            completionDate: new Date().toISOString()
        };

        localStorage.setItem('scaleit_leadership_score', JSON.stringify(result));
        setLastResult(result);
        setStep('results');
    };

    const getProgress = () => {
        return Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100);
    }

    return (
        <div className="h-screen bg-slate-50 overflow-hidden flex flex-col">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Leadership Assessment"
                subtitle="Self-evaluation tool to bring awareness to your leadership style."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <AwardIcon className="w-5 h-5 text-blue-600" /> Purpose
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            Answer each leadership question to bring awareness to how you are showing up in your company and with your team.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <StarIcon className="w-4 h-4 text-blue-600 fill-current" /> Directions
                        </h3>
                        <ul className="space-y-2 text-blue-800 text-sm font-medium">
                            <li className="flex items-start gap-2">
                                <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Rank yourself between 1-10 on each statement.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Calculate your score to see where you stand.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Leadership Assessment"
                description="Self-evaluation tool for leadership growth."
                backPath="/scaleit-method"
                backLabel="Back to SCALEit Method"
                onBack={() => navigate('/scaleit-method')}
                className="shrink-0"
            >
                <div className="flex gap-2">
                    <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                        <StarIcon className="w-4 h-4" /> Instructions
                    </button>
                </div>
            </PageHeader>

            <div className="flex-1 overflow-hidden relative">
                {step === 'intro' && (
                    <IntroScreen onStart={handleStart} lastResult={lastResult} />
                )}

                {step === 'quiz' && (
                    <QuestionCard
                        question={QUESTIONS[currentQuestionIndex]}
                        value={answers[QUESTIONS[currentQuestionIndex].id]}
                        onChange={handleAnswerChange}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        isFirst={currentQuestionIndex === 0}
                        isLast={currentQuestionIndex === QUESTIONS.length - 1}
                        progress={getProgress()}
                    />
                )}

                {step === 'results' && lastResult && (
                    <ResultsScreen result={lastResult} onRetake={handleStart} />
                )}
            </div>
        </div>
    );
};

export default LeadershipAssessment;
