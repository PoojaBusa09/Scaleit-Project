import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import { useNavigate } from 'react-router-dom';
import {
    InfoIcon,
    XIcon,
    PlusIcon,
    Trash2Icon,
    DollarSignIcon,
    BrainCircuitIcon,
    HeartIcon,
    ActivityIcon,
    TargetIcon
} from 'lucide-react';

// =============================================================================
// Components
// =============================================================================



interface MindsetRow {
    id: string;
    thoughts: string;
    feelings: string;
    actions: string;
    results: string;
}

export const MoneyMindsetEquationPage: React.FC = () => {
    const navigate = useNavigate();
    const [rows, setRows] = useState<MindsetRow[]>([]);
    const [showInstructions, setShowInstructions] = useState(false);

    // Load Data
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_money_mindset');
        if (saved) {
            try {
                setRows(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load mindset data", e);
                // Default start with one row
                setRows([{ id: Date.now().toString(), thoughts: '', feelings: '', actions: '', results: '' }]);
                setShowInstructions(true);
            }
        } else {
            setRows([{ id: Date.now().toString(), thoughts: '', feelings: '', actions: '', results: '' }]);
            setShowInstructions(true);
        }
    }, []);

    // Save Data
    useEffect(() => {
        if (rows.length > 0) {
            localStorage.setItem('scaleit_money_mindset', JSON.stringify(rows));
        }
    }, [rows]);

    const updateRow = (id: string, field: keyof MindsetRow, value: string) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const addRow = () => {
        setRows(prev => [...prev, { id: Date.now().toString(), thoughts: '', feelings: '', actions: '', results: '' }]);
    };

    const removeRow = (id: string) => {
        if (confirm("Are you sure you want to remove this row?")) {
            setRows(prev => {
                const newRows = prev.filter(r => r.id !== id);
                return newRows.length === 0 ? [{ id: Date.now().toString(), thoughts: '', feelings: '', actions: '', results: '' }] : newRows;
            });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Money Mindset Equation"
                subtitle="Shift your language, belief, and action around money."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Purpose</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Your <strong>Thoughts</strong> around money create <strong>Feelings</strong> which create your <strong>Action</strong> and ultimately create your <strong>Results</strong>.
                            Most business owners have a ceiling on what they feel they are worth. This tool helps you break through that belief ceiling.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-center font-serif text-lg text-blue-800 italic">
                            "If you change the way you look at things, the things you look at change." <br />
                            <span className="text-sm font-sans font-bold text-blue-600 not-italic mt-2 block">- Wayne Dyer</span>
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Directions</h3>
                        <ol className="list-decimal list-inside space-y-3 text-slate-600">
                            <li><strong>My Thoughts:</strong> List your current worries about Money.</li>
                            <li><strong>My Feelings:</strong> What are the emotions coming up around those thoughts?</li>
                            <li><strong>My Actions:</strong> What are the actions you are inspired to take when you feel this way?</li>
                            <li><strong>My Results:</strong> What happens when you think, feel and act in this way?</li>
                        </ol>
                        <p className="mt-4 text-slate-600 font-medium">
                            Then, <strong>Flip-Switch your language</strong> to a New and Positive cycle!
                        </p>
                    </div>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Money Mindset Equation"
                description="Map your cycle of thoughts, feelings, actions, and results."
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

            <div className="flex-1 overflow-hidden flex flex-col max-w-[1600px] w-full mx-auto p-6">

                {/* Header Row (Desktop) - Fixed */}
                <div className="hidden md:grid grid-cols-4 gap-6 px-6 mb-4 shrink-0">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-800 font-bold uppercase tracking-wider mb-1">
                            <BrainCircuitIcon className="w-5 h-5 text-purple-500" /> My Thoughts
                        </div>
                        <p className="text-xs text-slate-400 italic">(Current worries vs. Abundance)</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-800 font-bold uppercase tracking-wider mb-1">
                            <HeartIcon className="w-5 h-5 text-pink-500" /> My Feelings
                        </div>
                        <p className="text-xs text-slate-400 italic">(Anxious vs. Happy & Bold)</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-800 font-bold uppercase tracking-wider mb-1">
                            <ActivityIcon className="w-5 h-5 text-orange-500" /> My Actions
                        </div>
                        <p className="text-xs text-slate-400 italic">(Cautious vs. Creating)</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-800 font-bold uppercase tracking-wider mb-1">
                            <TargetIcon className="w-5 h-5 text-green-500" /> My Results
                        </div>
                        <p className="text-xs text-slate-400 italic">(No growth vs. Flourishing)</p>
                    </div>
                </div>

                {/* Scrollable Rows Area */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-6">
                    {rows.map((row, index) => (
                        <div key={row.id} className="relative bg-white p-6 rounded-xl shadow-sm border border-slate-200 group animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Remove Button */}
                            <button
                                onClick={() => removeRow(row.id)}
                                className="absolute -top-3 -right-3 p-2 bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-10"
                                title="Remove Row"
                            >
                                <Trash2Icon className="w-4 h-4" />
                            </button>

                            <div className="grid md:grid-cols-4 gap-6">
                                {/* Thoughts */}
                                <div className="space-y-2 h-full flex flex-col">
                                    <label className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">My Thoughts</label>
                                    <textarea
                                        value={row.thoughts}
                                        onChange={(e) => updateRow(row.id, 'thoughts', e.target.value)}
                                        placeholder="e.g., What if I lose my money?"
                                        className="w-full flex-1 bg-purple-50/30 border border-purple-100 rounded-lg p-4 text-slate-700 placeholder:text-purple-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-300 focus:outline-none transition-all resize-none min-h-[140px]"
                                    />
                                </div>

                                {/* Feelings */}
                                <div className="space-y-2 h-full flex flex-col">
                                    <label className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">My Feelings</label>
                                    <textarea
                                        value={row.feelings}
                                        onChange={(e) => updateRow(row.id, 'feelings', e.target.value)}
                                        placeholder="e.g., Anxious, heavy..."
                                        className="w-full flex-1 bg-pink-50/30 border border-pink-100 rounded-lg p-4 text-slate-700 placeholder:text-pink-300 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 focus:outline-none transition-all resize-none min-h-[140px]"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="space-y-2 h-full flex flex-col">
                                    <label className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">My Actions</label>
                                    <textarea
                                        value={row.actions}
                                        onChange={(e) => updateRow(row.id, 'actions', e.target.value)}
                                        placeholder="e.g., Hesitating, holding back..."
                                        className="w-full flex-1 bg-orange-50/30 border border-orange-100 rounded-lg p-4 text-slate-700 placeholder:text-orange-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-300 focus:outline-none transition-all resize-none min-h-[140px]"
                                    />
                                </div>

                                {/* Results */}
                                <div className="space-y-2 h-full flex flex-col">
                                    <label className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">My Results</label>
                                    <textarea
                                        value={row.results}
                                        onChange={(e) => updateRow(row.id, 'results', e.target.value)}
                                        placeholder="e.g., Stagnant revenue..."
                                        className="w-full flex-1 bg-green-50/30 border border-green-100 rounded-lg p-4 text-slate-700 placeholder:text-green-300 focus:ring-2 focus:ring-green-200 focus:border-green-300 focus:outline-none transition-all resize-none min-h-[140px]"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addRow}
                        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" /> Add New Row
                    </button>
                    <div className="h-10"></div> {/* Spacer */}
                </div>
            </div>
        </div>
    );
};

export default MoneyMindsetEquationPage;
