import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import { useNavigate } from 'react-router-dom';
import {
    InfoIcon,
    XIcon,
    PlusIcon,
    Trash2Icon,
    ZapIcon,
    RocketIcon,
    AlertTriangleIcon
} from 'lucide-react';

// =============================================================================
// Components
// =============================================================================



interface FearLeap {
    id: string;
    bigLeap: string;
    costOfInaction: string;
}

export const FearLeapingPage: React.FC = () => {
    const navigate = useNavigate();
    const [leaps, setLeaps] = useState<FearLeap[]>([]);
    const [showInstructions, setShowInstructions] = useState(false);

    // Load Data
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_fear_leaping');
        if (saved) {
            try {
                setLeaps(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load fear leaps", e);
                // Default start with one leap
                setLeaps([{ id: Date.now().toString(), bigLeap: '', costOfInaction: '' }]);
                setShowInstructions(true);
            }
        } else {
            setLeaps([{ id: Date.now().toString(), bigLeap: '', costOfInaction: '' }]);
            setShowInstructions(true);
        }
    }, []);

    // Save Data
    useEffect(() => {
        if (leaps.length > 0) {
            localStorage.setItem('scaleit_fear_leaping', JSON.stringify(leaps));
        }
    }, [leaps]);

    const updateLeap = (id: string, field: 'bigLeap' | 'costOfInaction', value: string) => {
        setLeaps(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const addLeap = () => {
        setLeaps(prev => [...prev, { id: Date.now().toString(), bigLeap: '', costOfInaction: '' }]);
    };

    const removeLeap = (id: string) => {
        if (confirm("Are you sure you want to remove this leap?")) {
            setLeaps(prev => {
                const newLeaps = prev.filter(l => l.id !== id);
                return newLeaps.length === 0 ? [{ id: Date.now().toString(), bigLeap: '', costOfInaction: '' }] : newLeaps;
            });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Fear Leaping"
                subtitle="Stop allowing fear to be a roadblack to your success."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Purpose</h3>
                        <p className="text-slate-600 leading-relaxed">
                            To what degree you allow fear to keep you from moving forward is a choice.
                            The level of your success is directly related to the leaps you are willing to take.
                            Fear Leaping will help you see that fear is often just a story keeping you small.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Directions</h3>
                        <ol className="list-decimal list-inside space-y-3 text-slate-600">
                            <li>Write down the <strong>fear</strong> you want to overcome.</li>
                            <li>List <strong>what you would do</strong> if the fear did not exist (The Big Leap).</li>
                            <li>Determine <strong>what it is costing you</strong> financially and emotionally to postpone this action.</li>
                            <li><strong>Take Action!</strong></li>
                        </ol>
                    </div>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Fear Leaping"
                description="Overcome fear and calculate the cost of inaction."
                backPath="/scaleit-method"
                backLabel="Back to SCALEit Method"
                onBack={() => navigate('/scaleit-method')}
                className="shrink-0"
            >
                <div className="flex gap-2">
                    <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                        <InfoIcon className="w-4 h-4" /> Instructions
                    </button>
                </div>
            </PageHeader>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center mb-8 shrink-0">
                        <h2 className="text-xl font-bold text-blue-900 uppercase tracking-widest mb-1">Fear Leaping</h2>
                        <p className="text-sm text-blue-600 font-medium">Identify the action, quantify the cost, take the leap.</p>
                    </div>

                    <div className="space-y-6 flex-1">
                        {leaps.map((leap, index) => (
                            <div key={leap.id} className="grid md:grid-cols-2 gap-4 md:gap-8 group relative bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
                                {/* Remove Button */}
                                <button
                                    onClick={() => removeLeap(leap.id)}
                                    className="absolute -top-3 -right-3 md:top-4 md:right-4 p-2 bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-10"
                                    title="Remove Leap"
                                >
                                    <Trash2Icon className="w-4 h-4" />
                                </button>

                                {/* Big Leap */}
                                <div className="flex flex-col h-full">
                                    <label className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2 leading-relaxed">
                                        <RocketIcon className="w-4 h-4" />
                                        If fear was of no consequence, I would take the big leap of...
                                    </label>
                                    <textarea
                                        value={leap.bigLeap}
                                        onChange={(e) => updateLeap(leap.id, 'bigLeap', e.target.value)}
                                        placeholder="e.g., Hiring a GM to run daily operations..."
                                        className="flex-1 w-full bg-indigo-50/30 border border-indigo-100 rounded-lg p-5 text-slate-700 placeholder:text-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:outline-none transition-all resize-none min-h-[160px] text-lg font-medium"
                                    />
                                </div>

                                {/* Cost of Inaction */}
                                <div className="flex flex-col h-full">
                                    <label className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2 leading-relaxed">
                                        <AlertTriangleIcon className="w-4 h-4" />
                                        What is it costing me financially and emotionally to postpone this action?
                                    </label>
                                    <textarea
                                        value={leap.costOfInaction}
                                        onChange={(e) => updateLeap(leap.id, 'costOfInaction', e.target.value)}
                                        placeholder="e.g., Losing $20k/mo in potential revenue and feeling constantly exhausted..."
                                        className="flex-1 w-full bg-orange-50/30 border border-orange-100 rounded-lg p-5 text-slate-700 placeholder:text-orange-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all resize-none min-h-[160px] text-lg font-medium"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Add Button */}
                        <button
                            onClick={addLeap}
                            className="w-full py-5 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            <PlusIcon className="w-6 h-6" /> Add Another Leap
                        </button>
                        <div className="h-10"></div> {/* Spacer */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FearLeapingPage;
