import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    ChevronLeftIcon,
    PlusIcon,
    Trash2Icon,
    FlagIcon,
    ClockIcon,
    UserIcon,
    InfoIcon,
    CopyIcon,
    PrinterIcon,
    XIcon,
    FileTextIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// =============================================================================
// Types & Constants
// =============================================================================

interface Touchpoint {
    id: string;
    day: number;
    title: string;
    description: string;
    owner: string;
}

const CHAMPION_PHASES = [
    { letter: 'C', name: 'Connect', color: 'bg-blue-100 text-blue-800' },
    { letter: 'H', name: 'Hire', color: 'bg-indigo-100 text-indigo-800' },
    { letter: 'A', name: 'Adopt', color: 'bg-violet-100 text-violet-800' },
    { letter: 'M', name: 'Measure', color: 'bg-purple-100 text-purple-800' },
    { letter: 'P', name: 'Partner', color: 'bg-fuchsia-100 text-fuchsia-800' },
    { letter: 'I', name: 'Impact', color: 'bg-pink-100 text-pink-800' },
    { letter: 'O', name: 'Own', color: 'bg-rose-100 text-rose-800' },
    { letter: 'N', name: 'Nominate', color: 'bg-orange-100 text-orange-800' },
];

const INITIAL_TOUCHPOINTS: Touchpoint[] = [
    { id: '1', day: 1, title: 'Welcome Email', description: 'Send automated welcome series regarding onboarding.', owner: 'Marketing' },
    { id: '2', day: 7, title: 'Check-in Call', description: 'Account Manager calls to ensure successful setup.', owner: 'Success Team' },
    { id: '3', day: 30, title: 'First Month Review', description: 'Send usage report and tips for optimization.', owner: 'System' },
];

// =============================================================================
// Components
// =============================================================================

export const ChampionCustomerJourneyPage: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [touchpoints, setTouchpoints] = useState<Touchpoint[]>(INITIAL_TOUCHPOINTS);

    // Form State
    const [day, setDay] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [owner, setOwner] = useState('');

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_champion_journey');
        if (saved) {
            try {
                setTouchpoints(JSON.parse(saved));
            } catch (e) { console.error(e); }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('scaleit_champion_journey', JSON.stringify(touchpoints));
    }, [touchpoints]);

    const handleAddTouchpoint = (e: React.FormEvent) => {
        e.preventDefault();
        if (!day || !title) return;

        const newPoint: Touchpoint = {
            id: Date.now().toString(),
            day: parseInt(day),
            title,
            description,
            owner
        };

        setTouchpoints(prev => [...prev, newPoint].sort((a, b) => a.day - b.day));

        // Reset form
        setDay('');
        setTitle('');
        setDescription('');
        setOwner('');
    };

    const handleDelete = (id: string) => {
        setTouchpoints(prev => prev.filter(p => p.id !== id));
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="The Champion Customer Journey Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        The CHAMPION framework helps you design a world-class customer experience through 8 critical phases:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                        <div className="p-2 bg-blue-50 rounded">C - Connect</div>
                        <div className="p-2 bg-indigo-50 rounded">H - Hire</div>
                        <div className="p-2 bg-violet-50 rounded">A - Adopt</div>
                        <div className="p-2 bg-purple-50 rounded">M - Measure</div>
                        <div className="p-2 bg-fuchsia-50 rounded">P - Partner</div>
                        <div className="p-2 bg-pink-50 rounded">I - Impact</div>
                        <div className="p-2 bg-rose-50 rounded">O - Own</div>
                        <div className="p-2 bg-orange-50 rounded">N - Nominate</div>
                    </div>
                    <p>
                        For each phase, identify the key touchpoints, who owns the interaction, and what day it should occur. This ensures no customer feels abandoned.
                    </p>
                </div>
            </InstructionsModal>

            {/* Header / Nav */}
            <PageHeader
                title="The Champion Customer Journey"
                description=""
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
            >
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                        <FileTextIcon className="w-4 h-4" />
                        New Version
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                        <CopyIcon className="w-4 h-4" />
                        Copy
                    </button>
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4 text-blue-600" />
                        Instructions
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors bg-white border border-slate-200">
                        <PrinterIcon className="w-5 h-5" />
                    </button>
                </div>
            </PageHeader>

            <div className="max-w-7xl mx-auto p-6">

                {/* CHAMPION Phases */}
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
                    {CHAMPION_PHASES.map((phase) => (
                        <div key={phase.letter} className={`flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200/60 shadow-sm ${phase.color} bg-opacity-50`}>
                            <span className="text-2xl font-black">{phase.letter}</span>
                            <span className="text-xs uppercase font-bold tracking-wider opacity-80">{phase.name}</span>
                        </div>
                    ))}
                </div>

                {/* Add Touchpoint Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2 text-blue-600" />
                        Add Touchpoint
                    </h3>
                    <form onSubmit={handleAddTouchpoint} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Day #</label>
                            <input
                                type="number"
                                required
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 1"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Touchpoint Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Check-in Call"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description / Notes</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Optional description..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-700 transition-colors text-sm"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>

                {/* Timeline Visualization */}
                <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8 pb-8">
                    {touchpoints.length === 0 && (
                        <div className="pl-6 text-slate-400 italic">No touchpoints added yet. Start by adding one above.</div>
                    )}

                    {touchpoints.map((tp) => (
                        <div key={tp.id} className="relative pl-8 group">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[9px] top-4 bg-white border-4 border-blue-500 w-5 h-5 rounded-full z-10"></div>

                            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
                                <button
                                    onClick={() => handleDelete(tp.id)}
                                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2Icon className="w-4 h-4" />
                                </button>

                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                    <div className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded inline-flex items-center">
                                        <ClockIcon className="w-3 h-3 mr-1" />
                                        Day {tp.day}
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800">{tp.title}</h4>
                                </div>

                                {tp.description && (
                                    <p className="text-slate-600 mb-3">{tp.description}</p>
                                )}

                                {tp.owner && (
                                    <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 inline-flex px-2 py-1 rounded border border-slate-100">
                                        <UserIcon className="w-3 h-3 mr-1" />
                                        Owner: {tp.owner || 'Unassigned'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ChampionCustomerJourneyPage;
