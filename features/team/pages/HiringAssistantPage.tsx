import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import { useNavigate } from 'react-router-dom';
import {
    InfoIcon,
    XIcon,
    DollarSignIcon,
    TargetIcon,
    TrendingUpIcon,
    PlusIcon,
    Trash2Icon,
    SaveIcon,
    RotateCcwIcon,
    CalendarIcon,
    BriefcaseIcon,
    UserIcon,
    CheckCircleIcon
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface Benchmark {
    id: string;
    goal: string;
    value: string; // Stored as string to allow flexible formatting, but parsed for totals
    revenue: string;
}

interface MonthlyResult {
    month: number;
    notes: string;
    value: string;
    revenue: string;
}

interface HireForGrowthData {
    name: string;
    position: string;
    salary: string;
    why: string;
    expectedBenchmarks: Benchmark[];
    resultBenchmarks: MonthlyResult[];
    currency: string;
}

const INITIAL_DATA: HireForGrowthData = {
    name: '',
    position: '',
    salary: '',
    why: '',
    expectedBenchmarks: [
        { id: '1', goal: '', value: '', revenue: '' }
    ],
    resultBenchmarks: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        notes: '',
        value: '',
        revenue: ''
    })),
    currency: '$'
};

// =============================================================================
// Components
// =============================================================================



const StatCard: React.FC<{ label: string; value: string | number; subValue?: string; icon: React.ElementType; color: string }> = ({ label, value, subValue, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
            {subValue && <p className="text-xs font-medium text-slate-500 mt-0.5">{subValue}</p>}
        </div>
    </div>
);

const HiringAssistant: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<HireForGrowthData>(INITIAL_DATA);
    const [showInstructions, setShowInstructions] = useState(false);
    const [activeTab, setActiveTab] = useState<'plan' | 'track'>('plan');

    // Load Data
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_hire_for_growth');
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
        localStorage.setItem('scaleit_hire_for_growth', JSON.stringify(data));
    }, [data]);

    // Calculations
    const parseCurrency = (val: string) => parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0;
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const salary = parseCurrency(data.salary);
    const target3x = salary * 3;
    const target10x = salary * 10;

    const totalProjectedValue = data.expectedBenchmarks.reduce((acc, curr) => acc + parseCurrency(curr.value), 0);
    const totalProjectedRevenue = data.expectedBenchmarks.reduce((acc, curr) => acc + parseCurrency(curr.revenue), 0);
    const combinedProjected = totalProjectedValue + totalProjectedRevenue;

    const percentOf3x = target3x > 0 ? (combinedProjected / target3x) * 100 : 0;

    // Handlers
    const updateField = (field: keyof HireForGrowthData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const updateBenchmark = (id: string, field: keyof Benchmark, value: string) => {
        setData(prev => ({
            ...prev,
            expectedBenchmarks: prev.expectedBenchmarks.map(b => b.id === id ? { ...b, [field]: value } : b)
        }));
    };

    const addBenchmark = () => {
        setData(prev => ({
            ...prev,
            expectedBenchmarks: [...prev.expectedBenchmarks, { id: Date.now().toString(), goal: '', value: '', revenue: '' }]
        }));
    };

    const removeBenchmark = (id: string) => {
        setData(prev => ({
            ...prev,
            expectedBenchmarks: prev.expectedBenchmarks.filter(b => b.id !== id)
        }));
    };

    const updateResult = (month: number, field: keyof MonthlyResult, value: string) => {
        setData(prev => ({
            ...prev,
            resultBenchmarks: prev.resultBenchmarks.map(r => r.month === month ? { ...r, [field]: value } : r)
        }));
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
            setData(INITIAL_DATA);
        }
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Hire for Growth"
                subtitle="Ensure every hire fuels your company's growth."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <TargetIcon className="w-5 h-5 text-blue-600" /> Purpose
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            To determine the success benchmarks for every new and existing position to track their ongoing value.
                            The goal: for every team member to generate <strong>3-10x what you pay them</strong> to your bottom line.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 animate-fade-in">
                        <p className="font-medium">
                            💡 Concept: If they receive $100,000 in salary, set benchmarks for their position to generate $300k to $1M in Revenue yearly.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <TrendingUpIcon className="w-5 h-5 text-green-600" /> Direction
                        </h3>
                        <ol className="list-decimal pl-5 space-y-3 text-slate-600">
                            <li>
                                <strong>Define the Role:</strong> Input the team member's details and their base salary. The tool will automatically calculate the 3x and 10x ROI targets.
                            </li>
                            <li>
                                <strong>Set Benchmarks:</strong> List up to 5 main Success Benchmarks (e.g., direct sales, hours saved, new opportunities) and assign a monetary value to each.
                            </li>
                            <li>
                                <strong>Track Results:</strong> Review the actual outcome monthly or quarterly against your stated benchmarks to ensuring the position remains profitable.
                            </li>
                        </ol>
                    </div>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Hire for Growth"
                description="Success benchmarks and ROI tracking."
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
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* 1. Investment Profile */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center sticky top-0 z-10">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-slate-500" /> Position Profile
                            </h3>
                            <div className="flex bg-slate-200 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab('plan')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'plan' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Plan & Benchmarks
                                </button>
                                <button
                                    onClick={() => setActiveTab('track')}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'track' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Results Tracker
                                </button>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Inputs */}
                            <div className="md:col-span-8 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Team Member Name</label>
                                        <input
                                            value={data.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Position / Role</label>
                                        <input
                                            value={data.position}
                                            onChange={(e) => updateField('position', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="e.g. Sales Director"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Our 'Why' for this Position</label>
                                    <textarea
                                        value={data.why}
                                        onChange={(e) => updateField('why', e.target.value)}
                                        rows={2}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                        placeholder="Why is this role critical for our growth?"
                                    />
                                </div>
                            </div>

                            {/* Financials Calculator */}
                            <div className="md:col-span-4 bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-between">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Annual Salary (Investment)</label>
                                    <div className="relative">
                                        <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            value={data.salary}
                                            onChange={(e) => updateField('salary', e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 font-bold text-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-slate-600"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 mb-1">Target ROI (3x)</p>
                                        <p className="text-lg font-bold text-blue-400">{formatCurrency(target3x)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 mb-1">Hero ROI (10x)</p>
                                        <p className="text-lg font-bold text-green-400">{formatCurrency(target10x)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {activeTab === 'plan' && (
                        <section className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-end px-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Success Benchmarks</h3>
                                    <p className="text-slate-500 text-sm">Define how this role will pay for itself. Aim for the 3x Target.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Total Projected Impact</p>
                                    <p className={`text-2xl font-bold ${percentOf3x >= 100 ? 'text-green-600' : 'text-slate-800'}`}>
                                        {formatCurrency(combinedProjected)}
                                    </p>
                                    {target3x > 0 && (
                                        <p className="text-xs font-medium text-slate-400">
                                            {Math.round(percentOf3x)}% of 3x Target
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {target3x > 0 && (
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${percentOf3x >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                        style={{ width: `${Math.min(percentOf3x, 100)}%` }}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                {data.expectedBenchmarks.map((item, index) => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            <div className="bg-blue-50 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">
                                                {index + 1}
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 md:hidden">Goal / Metric</label>
                                            <input
                                                value={item.goal}
                                                onChange={(e) => updateBenchmark(item.id, 'goal', e.target.value)}
                                                className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 px-2 py-1 font-medium text-slate-800 focus:outline-none transition-colors"
                                                placeholder="Describe the benchmark (e.g. Increase direct sales by 20%)"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:min-w-[300px]">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Value ($)</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                    <input
                                                        value={item.value}
                                                        onChange={(e) => updateBenchmark(item.id, 'value', e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-5 pr-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Direct Revenue ($)</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                    <input
                                                        value={item.revenue}
                                                        onChange={(e) => updateBenchmark(item.id, 'revenue', e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-5 pr-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeBenchmark(item.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addBenchmark}
                                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="w-5 h-5" /> Add Success Benchmark
                            </button>
                            <div className="h-4"></div>
                        </section>
                    )}

                    {activeTab === 'track' && (
                        <section className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-end px-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Result Benchmarks</h3>
                                    <p className="text-slate-500 text-sm">Track actual outcomes against your goals monthly.</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 font-bold text-slate-500 uppercase w-20">Month</th>
                                                <th className="px-6 py-4 font-bold text-slate-500 uppercase">Metrics Check-in / Notes</th>
                                                <th className="px-6 py-4 font-bold text-slate-500 uppercase w-40">Value Created</th>
                                                <th className="px-6 py-4 font-bold text-slate-500 uppercase w-40">Revenue Gen</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {data.resultBenchmarks.map((row) => (
                                                <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-400">#{row.month}</td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            value={row.notes}
                                                            onChange={(e) => updateResult(row.month, 'notes', e.target.value)}
                                                            className="w-full bg-transparent focus:outline-none placeholder-slate-300 text-slate-700"
                                                            placeholder="Enter results..."
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="relative">
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                            <input
                                                                value={row.value}
                                                                onChange={(e) => updateResult(row.month, 'value', e.target.value)}
                                                                className="w-full bg-slate-100/50 border border-slate-200 rounded px-2 py-1.5 pl-5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="relative">
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                                            <input
                                                                value={row.revenue}
                                                                onChange={(e) => updateResult(row.month, 'revenue', e.target.value)}
                                                                className="w-full bg-slate-100/50 border border-slate-200 rounded px-2 py-1.5 pl-5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="h-4"></div>
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
};

export default HiringAssistant;
