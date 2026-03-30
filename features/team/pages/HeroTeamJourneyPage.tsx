import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import { useNavigate } from 'react-router-dom';
import {
    InfoIcon,
    XIcon,
    CalendarIcon,
    PlusIcon,
    Trash2Icon,
    RotateCcwIcon,
    CheckSquareIcon,
    UsersIcon
} from 'lucide-react';

// =============================================================================
// Types & Constants
// =============================================================================

interface PhaseAction {
    id: string;
    text: string;
    completed: boolean;
}

interface HeroPhase {
    id: 'hire' | 'educate' | 'reinforce' | 'optimize';
    title: string;
    description: string;
    color: string;
    bg: string;
    borderColor: string;
    startDate: string;
    endDate: string;
    actions: PhaseAction[];
}

interface HeroJourneyData {
    hire: HeroPhase;
    educate: HeroPhase;
    reinforce: HeroPhase;
    optimize: HeroPhase;
}

const INITIAL_DATA: HeroJourneyData = {
    hire: {
        id: 'hire',
        title: 'HIRE',
        description: 'Interviewing, Hiring, Culture Fit, Vision & Values.',
        color: 'text-cyan-500',
        bg: 'bg-cyan-50',
        borderColor: 'border-cyan-200',
        startDate: '',
        endDate: '',
        actions: [{ id: '1', text: '', completed: false }]
    },
    educate: {
        id: 'educate',
        title: 'EDUCATE',
        description: 'Orientation, Company Structure, Positional Training.',
        color: 'text-pink-500',
        bg: 'bg-pink-50',
        borderColor: 'border-pink-200',
        startDate: '',
        endDate: '',
        actions: [{ id: '1', text: '', completed: false }]
    },
    reinforce: {
        id: 'reinforce',
        title: 'REINFORCE',
        description: 'Supplemental Orientation & Ongoing Training.',
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        borderColor: 'border-purple-200',
        startDate: '',
        endDate: '',
        actions: [{ id: '1', text: '', completed: false }]
    },
    optimize: {
        id: 'optimize',
        title: 'OPTIMIZE',
        description: 'Role Clarity, Autonomy, Accountability, Strategy.',
        color: 'text-green-500',
        bg: 'bg-green-50',
        borderColor: 'border-green-200',
        startDate: '',
        endDate: '',
        actions: [{ id: '1', text: '', completed: false }]
    }
};

// =============================================================================
// Components
// =============================================================================



export const HeroTeamJourneyPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<HeroJourneyData>(INITIAL_DATA);
    const [showInstructions, setShowInstructions] = useState(false);

    // Load Data
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_hero_journey');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load data", e);
                setShowInstructions(true);
            }
        } else {
            setShowInstructions(true);
        }
    }, []);

    // Save Data
    useEffect(() => {
        localStorage.setItem('scaleit_hero_journey', JSON.stringify(data));
    }, [data]);

    const updatePhaseDate = (phaseId: keyof HeroJourneyData, field: 'startDate' | 'endDate', value: string) => {
        setData(prev => ({
            ...prev,
            [phaseId]: { ...prev[phaseId], [field]: value }
        }));
    };

    const updateAction = (phaseId: keyof HeroJourneyData, actionId: string, text: string) => {
        setData(prev => ({
            ...prev,
            [phaseId]: {
                ...prev[phaseId],
                actions: prev[phaseId].actions.map(a => a.id === actionId ? { ...a, text } : a)
            }
        }));
    };

    const addAction = (phaseId: keyof HeroJourneyData) => {
        setData(prev => ({
            ...prev,
            [phaseId]: {
                ...prev[phaseId],
                actions: [...prev[phaseId].actions, { id: Date.now().toString(), text: '', completed: false }]
            }
        }));
    };

    const removeAction = (phaseId: keyof HeroJourneyData, actionId: string) => {
        setData(prev => ({
            ...prev,
            [phaseId]: {
                ...prev[phaseId],
                actions: prev[phaseId].actions.length > 1
                    ? prev[phaseId].actions.filter(a => a.id !== actionId)
                    : [{ id: Date.now().toString(), text: '', completed: false }] // Keep at least one
            }
        }));
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to start a new journey? This will clear all data.")) {
            setData(INITIAL_DATA);
        }
    }

    const phases = ['hire', 'educate', 'reinforce', 'optimize'] as const;

    return (

        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Brand Hero Team Journey"
                subtitle="A comprehensive process for adding and retaining team members."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            Code Word: HERO
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            Recognize that each letter represents a phase in a new team member’s journey.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
                            <h4 className="font-bold text-cyan-800">H = HIRE</h4>
                            <p className="text-sm text-cyan-700 mt-1">Interviewing and Hiring, Administrative onboarding for Culture, Values, Vision and Skillset.</p>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                            <h4 className="font-bold text-pink-800">E = EDUCATE</h4>
                            <p className="text-sm text-pink-700 mt-1">Orientation with Vision and Values, company structure/culture, and positional training.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h4 className="font-bold text-purple-800">R = REINFORCEMENT</h4>
                            <p className="text-sm text-purple-700 mt-1">Supplemental orientation and positional training.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h4 className="font-bold text-green-800">O = OPTIMIZATION</h4>
                            <p className="text-sm text-green-700 mt-1">Role clarity, collaboration, autonomy, accountability, strategy. Continued emphasis on Vision and Values.</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 italic">
                        Note: The HIRE, EDUCATE, and REINFORCEMENT phases typically occur within the first 30 days. The OPTIMIZATION phase is more long term.
                    </p>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Brand Hero Team Journey"
                description="Timeline for hiring, onboarding, education, and optimization."
                backPath="/scaleit-method"
                backLabel="Back to SCALEit Method"
                onBack={() => navigate('/scaleit-method')}
                className="shrink-0"
            >
                <div className="flex gap-2">
                    <button onClick={handleReset} className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors" title="Reset">
                        <RotateCcwIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                        <InfoIcon className="w-4 h-4" /> Instructions
                    </button>
                </div>
            </PageHeader>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {phases.map((phaseId) => {
                        const phase = data[phaseId];
                        return (
                            <div key={phaseId} className={`rounded-xl border-2 shadow-sm bg-white overflow-hidden transition-all hover:shadow-md ${phase.borderColor}`}>
                                {/* Header */}
                                <div className={`${phase.bg} px-6 py-4 border-b ${phase.borderColor} flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10`}>
                                    <div>
                                        <h3 className={`text-xl font-bold uppercase tracking-wide ${phase.color}`}>{phase.title}</h3>
                                        <p className="text-sm font-medium text-slate-600 mt-1">{phase.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg border border-white/60 shadow-sm">
                                        <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                            <CalendarIcon className="w-3 h-3" /> Date Range
                                        </span>
                                        <input
                                            type="date"
                                            value={phase.startDate}
                                            onChange={(e) => updatePhaseDate(phaseId, 'startDate', e.target.value)}
                                            className="bg-transparent border-none text-sm font-medium text-slate-800 focus:ring-0 p-0 w-32"
                                        />
                                        <span className="text-slate-400">to</span>
                                        <input
                                            type="date"
                                            value={phase.endDate}
                                            onChange={(e) => updatePhaseDate(phaseId, 'endDate', e.target.value)}
                                            className="bg-transparent border-none text-sm font-medium text-slate-800 focus:ring-0 p-0 w-32"
                                        />
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {phase.actions.map((action, index) => (
                                            <div key={action.id} className="relative group">
                                                <input
                                                    value={action.text}
                                                    onChange={(e) => updateAction(phaseId, action.id, e.target.value)}
                                                    placeholder={`Action step ${index + 1}...`}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all"
                                                />
                                                {/* Delete trigger (only shows on hover) */}
                                                <button
                                                    onClick={() => removeAction(phaseId, action.id)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Remove Item"
                                                >
                                                    <Trash2Icon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add Button */}
                                        <button
                                            onClick={() => addAction(phaseId)}
                                            className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-bold text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                        >
                                            <PlusIcon className="w-4 h-4" /> Add Action
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default HeroTeamJourneyPage;
