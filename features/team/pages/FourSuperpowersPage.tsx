import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import {
    InfoIcon,
    XIcon,
    BriefcaseIcon,
    TargetIcon,
    TrendingUpIcon,
    SettingsIcon,
    UsersIcon,
    ZapIcon,
    SaveIcon,
    RotateCcwIcon,
    CheckCircleIcon,
    CopyIcon,
    PrinterIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// Types & Constants
// =============================================================================

type QuadrantKey = 'revenue' | 'marketing' | 'sales' | 'operations';

interface QuadrantData {
    who: string;
    responsibilities: string;
    isMySuperpower: boolean;
}

interface SuperpowersData {
    revenue: QuadrantData;
    marketing: QuadrantData;
    sales: QuadrantData;
    operations: QuadrantData;
}

const INITIAL_DATA: SuperpowersData = {
    revenue: { who: '', responsibilities: '', isMySuperpower: false },
    marketing: { who: '', responsibilities: '', isMySuperpower: false },
    sales: { who: '', responsibilities: '', isMySuperpower: false },
    operations: { who: '', responsibilities: '', isMySuperpower: false }
};

const QUADRANT_CONFIG: Record<QuadrantKey, { title: string; subtitle: string; icon: React.ElementType; color: string; bg: string }> = {
    revenue: {
        title: 'REVENUE STREAMS',
        subtitle: 'Products and Services',
        icon: TargetIcon,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    marketing: {
        title: 'MARKETING',
        subtitle: 'Driving Leads to Your Business',
        icon: UsersIcon,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
    },
    sales: {
        title: 'SALES',
        subtitle: 'Conversion of Buyers & Repeat Buyers',
        icon: TrendingUpIcon,
        color: 'text-green-600',
        bg: 'bg-green-50'
    },
    operations: {
        title: 'OPERATIONS',
        subtitle: 'Managing Team, Projects, Tech, Customers, Finances',
        icon: SettingsIcon,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    }
};

// =============================================================================
// Components
// =============================================================================



export const FourSuperpowersPage: React.FC = () => {
    const navigate = useNavigate();
    const [showInstructions, setShowInstructions] = useState(false);
    const [data, setData] = useState<SuperpowersData>(INITIAL_DATA);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_4_superpowers');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error(e);
                setShowInstructions(true);
            }
        } else {
            setShowInstructions(true);
        }
    }, []);

    // Save on Change
    useEffect(() => {
        localStorage.setItem('scaleit_4_superpowers', JSON.stringify(data));
    }, [data]);

    const updateQuadrant = (key: QuadrantKey, field: keyof QuadrantData, value: any) => {
        setData(prev => {
            const newData = { ...prev, [key]: { ...prev[key], [field]: value } };

            // If setting 'isMySuperpower' to true, ensure others are false (if we want single selection)
            // The prompt says "Determine which Quadrant of the 4 is YOUR Superpower", implying singular.
            if (field === 'isMySuperpower' && value === true) {
                (Object.keys(newData) as QuadrantKey[]).forEach(k => {
                    if (k !== key) newData[k].isMySuperpower = false;
                });
            }
            return newData;
        });
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to clear all data?")) {
            setData(INITIAL_DATA);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="4 Superpowers"
                subtitle="Build a Team-Managed Company."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Purpose</h3>
                        <div className="text-slate-600 space-y-4">
                            <p>
                                To Build a Team Managed Company that can run without you. There are so many areas of your company to manage that it often feels overwhelming.
                            </p>
                            <p>
                                To scale you must build a Team-Managed company run by leaders that can drive the growth of each area. Rather than juggling 10 areas, divide your business into 4 Quadrants: Your <strong>Revenue Streams</strong>, <strong>Marketing</strong>, <strong>Sales</strong> and <strong>Operations</strong>.
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Directions</h3>
                        <div className="text-slate-600 space-y-4">
                            <p>
                                <strong>1. Identify Your Superpower:</strong> Determine which Quadrant is YOUR Zone of Genius. The area you LOVE and are good at. Your goal is to live here 90% of the time.
                            </p>
                            <p>
                                <strong>2. Hire 3 Superpowers:</strong> Hire leaders for the other 3 Quadrants. They should have expertise and leadership ability.
                            </p>
                            <p>
                                <strong>3. Hire the 4th:</strong> Once stable, hire a replacement for your quadrant so you can step fully into the CEO role—working ON the company, not IN it.
                            </p>
                        </div>
                    </div>
                </div>
            </InstructionsModal>

            {/* Top Bar */}
            <PageHeader
                title="4 Superpowers"
                description="Build a Team-Managed Company by dividing responsibilities into 4 Quadrants."
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
                className="shrink-0"
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        <RotateCcwIcon className="w-4 h-4" />
                        Reset
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                        <CopyIcon className="w-4 h-4" />
                        Copy
                    </button>
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4" />
                        Instructions
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors bg-white border border-slate-200">
                        <PrinterIcon className="w-5 h-5" />
                    </button>
                </div>
            </PageHeader>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-0">
                        {(Object.keys(QUADRANT_CONFIG) as QuadrantKey[]).map((key) => {
                            const config = QUADRANT_CONFIG[key];
                            const quadrantData = data[key];

                            return (
                                <div
                                    key={key}
                                    className={`
                                        bg-white rounded-xl shadow-sm border-2 transition-all duration-300 flex flex-col h-full
                                        ${quadrantData.isMySuperpower ? 'border-primary ring-4 ring-primary/10 shadow-lg transform scale-[1.01]' : 'border-slate-200 hover:border-slate-300'}
                                    `}
                                >
                                    {/* Header */}
                                    <div className={`p-4 border-b border-slate-100 flex justify-between items-start rounded-t-xl shrink-0 ${config.bg}`}>
                                        <div className="flex gap-3">
                                            <div className={`p-2 bg-white rounded-lg shadow-sm ${config.color}`}>
                                                <config.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800 uppercase">{config.title}</h3>
                                                <p className="text-xs font-medium text-slate-500">{config.subtitle}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateQuadrant(key, 'isMySuperpower', !quadrantData.isMySuperpower)}
                                            className={`
                                                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                                                ${quadrantData.isMySuperpower
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-200'}
                                            `}
                                        >
                                            <ZapIcon className={`w-3 h-3 ${quadrantData.isMySuperpower ? 'fill-current' : ''}`} />
                                            {quadrantData.isMySuperpower ? 'MY SUPERPOWER' : 'Set as Superpower'}
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5 space-y-4 flex-1 flex flex-col overflow-y-auto">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                                WHO
                                            </label>
                                            <input
                                                type="text"
                                                value={quadrantData.who}
                                                onChange={(e) => updateQuadrant(key, 'who', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors"
                                                placeholder="Who leads this quadrant?"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                                RESPONSIBILITIES
                                            </label>
                                            <textarea
                                                value={quadrantData.responsibilities}
                                                onChange={(e) => updateQuadrant(key, 'responsibilities', e.target.value)}
                                                className="w-full h-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors resize-none text-sm leading-relaxed min-h-[120px]"
                                                placeholder={`List the key responsibilities for ${config.title.toLowerCase()}...`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FourSuperpowersPage;
