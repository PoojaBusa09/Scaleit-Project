import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { CopyIcon, PrinterIcon, FileTextIcon, PlusIcon, Trash2Icon, DollarSignIcon, TargetIcon, UsersIcon, TrendingUpIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, ArrowLeftIcon, InfoIcon } from '../../../components/icons.tsx';
import { useStrategicVision } from '../hooks/useStrategicVision.ts';
import { RevenueStream } from '../types.ts';
import { StrategySection } from '../components/StrategySection.tsx';
import { GapAnalysisWidget } from '../components/GapAnalysisWidget.tsx';

import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

/**
 * Static mock data representing previous versions of the strategic plan.
 * TODO: Replace with real version history from backend/local storage.
 */
const MOCK_STRATEGY_HISTORY = [
    { id: 1, date: 'Oct 15, 2024', version: 'v1.0 - Initial Plan', projectedRevenue: '$1,250,000', status: 'Archived' },
    { id: 2, date: 'Nov 01, 2024', version: 'v1.1 - Q4 Revised', projectedRevenue: '$1,400,000', status: 'Active' },
];

/**
 * The 'My Strategic Plan' page.
 * Allows users to calculate revenue projections and document text-based strategies.
 * Features a 'History' view and an 'Editor' view.
 */
export const StrategicVision: React.FC = () => {
    const navigate = useNavigate();
    const [showInstructions, setShowInstructions] = useState(false);

    // Use the custom hook for all business logic
    const {
        isEditing, setIsEditing,
        lastYearRevenue, setLastYearRevenue,
        revenueGoal, setRevenueGoal,
        streams, addStream, deleteStream,
        totalProjectedRevenue, totalProjectedCustomers, percentOfGoal, gapToGoal,
        savePlan
    } = useStrategicVision();

    // Local UI state for new stream input form
    const [newStream, setNewStream] = useState<Partial<RevenueStream>>({ name: '', price: 0, salesCount: 0 });

    const handleAddStream = () => {
        if (newStream.name && newStream.price !== undefined && newStream.salesCount !== undefined) {
            addStream({
                name: newStream.name,
                price: Number(newStream.price),
                salesCount: Number(newStream.salesCount)
            });
            setNewStream({ name: '', price: 0, salesCount: 0 });
        }
    };

    // HISTORY VIEW
    if (!isEditing) {
        return (
            <div className="pb-10 animate-fade-in">
                <InstructionsModal
                    isOpen={showInstructions}
                    onClose={() => setShowInstructions(false)}
                    title="Strategic Vision Instructions"
                >
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Purpose</h3>
                            <p className="text-slate-600 leading-relaxed">
                                To help you determine your financial and strategic goals for the next 12 months.
                                Discuss these results with your Mentor to determine the best model(s) for your Scale.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Directions</h3>
                            <ul className="list-disc pl-5 space-y-3 text-slate-600">
                                <li>
                                    <strong>Revenue Streams:</strong> List your Products and/or Services and the Price for each.
                                </li>
                                <li>
                                    <strong>Unit Sales:</strong> List the number of units/clients you would need to sell to reach your Revenue Goal.
                                </li>
                                <li>
                                    <strong>Impact:</strong> Identify what impact you will make if you reach your goal.
                                </li>
                                <li>
                                    <strong>Strategies:</strong> List your Marketing and Sales Strategies to reach your goal.
                                </li>
                                <li>
                                    <strong>Team:</strong> Determine who you need on your team to reach your goal.
                                </li>
                            </ul>
                        </section>
                    </div>
                </InstructionsModal>

                <PageHeader
                    title="My Strategic Plan"
                    description="Version control your financial targets and execution strategies."
                    onBack={() => navigate('/scaleit-method')}
                    backLabel="Back to SCALEit Method"
                >
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowInstructions(true)}
                            className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                        >
                            <InfoIcon className="w-4 h-4 text-blue-600" />
                            Instructions
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-primary text-on-primary px-6 py-2.5 rounded-full hover:shadow-lg text-sm font-bold flex items-center justify-center whitespace-nowrap transition-all transform hover:scale-105"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                            Create New Version
                        </button>
                    </div>
                </PageHeader>

                <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">

                    <div className="overflow-x-auto">
                        <table className="min-w-full" aria-label="Strategic Plan History">
                            <thead>
                                <tr className="border-b border-outline">
                                    <th scope="col" className="px-5 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-5 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Version</th>
                                    <th scope="col" className="px-5 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Projected Revenue</th>
                                    <th scope="col" className="px-5 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-5 py-3 text-right text-sm font-bold text-black uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_STRATEGY_HISTORY.map((plan) => (
                                    <tr key={plan.id} className="border-b border-surface-variant hover:bg-black/5 transition-colors group">
                                        <td className="px-5 py-4 text-sm font-medium text-black">{plan.date}</td>
                                        <td className="px-5 py-4 text-sm font-medium text-black">{plan.version}</td>
                                        <td className="px-5 py-4 text-sm font-bold text-black">{plan.projectedRevenue}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-black'
                                                }`}>
                                                {plan.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center justify-end w-full"
                                                aria-label={`View version ${plan.version}`}
                                            >
                                                View <ChevronRightIcon className="h-4 w-4 ml-1" aria-hidden="true" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // EDITOR VIEW
    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Strategic Vision Instructions"
            >
                <div className="space-y-6">
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Purpose</h3>
                        <p className="text-slate-600 leading-relaxed">
                            To help you determine your financial and strategic goals for the next 12 months.
                            Discuss these results with your Mentor to determine the best model(s) for your Scale.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Directions</h3>
                        <ul className="list-disc pl-5 space-y-3 text-slate-600">
                            <li>
                                <strong>Revenue Streams:</strong> List your Products and/or Services and the Price for each.
                            </li>
                            <li>
                                <strong>Unit Sales:</strong> List the number of units/clients you would need to sell to reach your Revenue Goal.
                            </li>
                            <li>
                                <strong>Impact:</strong> Identify what impact you will make if you reach your goal.
                            </li>
                            <li>
                                <strong>Strategies:</strong> List your Marketing and Sales Strategies to reach your goal.
                            </li>
                            <li>
                                <strong>Team:</strong> Determine who you need on your team to reach your goal.
                            </li>
                        </ul>
                    </section>
                </div>
            </InstructionsModal>

            <PageHeader
                title="My Strategic Plan"
                onBack={() => setIsEditing(false)}
                backLabel="Back to History"
                className="shrink-0"
            >
                <div className="flex flex-col items-end">
                    <p className="text-sm text-black mb-2 opacity-70">Drafting v1.2</p>
                    <div className="flex space-x-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors shadow-sm">
                            <PlusIcon className="w-4 h-4" /> New Version
                        </button>
                        <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white shadow-sm" title="Copy" aria-label="Copy Plan">
                            <CopyIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => setShowInstructions(true)}
                            className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                        >
                            <PrinterIcon className="h-4 w-4" /> Instructions
                        </button>
                        <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white shadow-sm" title="Download" aria-label="Download Plan">
                            <FileTextIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </PageHeader>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Top Row: Revenue Goals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            <label htmlFor="last-year-revenue" className="block text-[10px] font-bold text-black uppercase tracking-wider mb-2">Last Year's Revenue</label>
                            <div className="relative">
                                <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" aria-hidden="true" />
                                <input
                                    id="last-year-revenue"
                                    type="number"
                                    value={lastYearRevenue || ''}
                                    onChange={(e) => setLastYearRevenue(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-lg font-bold text-black focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            <label htmlFor="revenue-goal" className="block text-[10px] font-bold text-black uppercase tracking-wider mb-2">Revenue Goal This Year</label>
                            <div className="relative">
                                <TargetIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" aria-hidden="true" />
                                <input
                                    id="revenue-goal"
                                    type="number"
                                    value={revenueGoal || ''}
                                    onChange={(e) => setRevenueGoal(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-lg font-bold text-black focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Revenue Streams Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <button onClick={() => setIsEditing(true)} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700">
                                <PlusIcon className="w-3.5 h-3.5" /> ADD ROW
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] font-bold text-black uppercase tracking-wider">
                                        <th className="px-5 py-3 font-semibold">Revenue Stream (Product/Service)</th>
                                        <th className="px-5 py-3 font-semibold w-32">Pricing</th>
                                        <th className="px-5 py-3 font-semibold w-32"># of Sales</th>
                                        <th className="px-5 py-3 font-semibold w-32">Sales Total</th>
                                        <th className="px-5 py-3 font-semibold w-24">GP%</th>
                                        <th className="px-5 py-3 font-semibold w-24 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* Add New Stream Row */}
                                    <tr className="bg-blue-50/30">
                                        <td className="px-5 py-2">
                                            <input
                                                type="text"
                                                placeholder="Revenue Stream Name..."
                                                value={newStream.name}
                                                onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
                                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-slate-500 text-black"
                                            />
                                        </td>
                                        <td className="px-5 py-2">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={newStream.price || ''}
                                                onChange={(e) => setNewStream({ ...newStream, price: Number(e.target.value) })}
                                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-black"
                                            />
                                        </td>
                                        <td className="px-5 py-2">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={newStream.salesCount || ''}
                                                onChange={(e) => setNewStream({ ...newStream, salesCount: Number(e.target.value) })}
                                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-black"
                                            />
                                        </td>
                                        <td className="px-5 py-2 text-sm font-bold text-black">$0</td>
                                        <td className="px-5 py-2">
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={newStream.gpPercent || ''}
                                                onChange={(e) => setNewStream({ ...newStream, gpPercent: Number(e.target.value) })}
                                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-black"
                                            />
                                        </td>
                                        <td className="px-5 py-2 text-center">
                                            <button
                                                onClick={handleAddStream}
                                                disabled={!newStream.name || !newStream.price}
                                                className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1 rounded-md transition-opacity disabled:opacity-30"
                                            >
                                                ADD
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Existing Streams */}
                                    {streams.map((stream) => (
                                        <tr key={stream.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-5 py-3 text-sm font-medium text-black">{stream.name}</td>
                                            <td className="px-5 py-3 text-sm text-black">${stream.price.toLocaleString()}</td>
                                            <td className="px-5 py-3 text-sm text-black">{stream.salesCount}</td>
                                            <td className="px-5 py-3 text-sm font-bold text-black">${(stream.price * stream.salesCount).toLocaleString()}</td>
                                            <td className="px-5 py-3 text-sm text-black">{stream.gpPercent || 0}%</td>
                                            <td className="px-5 py-3 text-center">
                                                <button
                                                    onClick={() => deleteStream(stream.id)}
                                                    className="p-1.5 text-black/30 hover:text-red-600 hover:bg-red-50 rounded-md transition-all sm:opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2Icon className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Totals Row */}
                                    <tr className="bg-slate-50/30 font-bold border-t border-slate-100">
                                        <td colSpan={3} className="px-5 py-4 text-[10px] uppercase text-black text-right">Gross Projected Sales</td>
                                        <td className="px-5 py-4 text-sm text-black bg-slate-100/50">${totalProjectedRevenue.toLocaleString()}</td>
                                        <td colSpan={2}></td>
                                    </tr>
                                    <tr className="bg-slate-50/30 font-bold">
                                        <td colSpan={3} className="px-5 py-4 text-[10px] uppercase text-black text-right"># of Projected Customers</td>
                                        <td className="px-5 py-4 text-sm text-black bg-slate-100/50">{totalProjectedCustomers.toLocaleString()}</td>
                                        <td colSpan={2}></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Strategy Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1">Marketing Strategies to Drive Leads</label>
                            <textarea
                                className="w-full h-24 p-4 bg-white border border-slate-200 rounded-xl shadow-sm italic text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="Enter marketing strategies..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1">Sales Conversion Strategies</label>
                            <textarea
                                className="w-full h-24 p-4 bg-white border border-slate-200 rounded-xl shadow-sm italic text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="Enter sales strategies..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black uppercase tracking-wider ml-1">Team Positions Needed to Fulfill Demand</label>
                            <textarea
                                className="w-full h-24 p-4 bg-white border border-slate-200 rounded-xl shadow-sm italic text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                                placeholder="Enter team requirements..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pb-10">
                        <button
                            onClick={savePlan}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 text-base font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                        >
                            <CheckCircleIcon className="h-5 w-5" /> Save Strategic Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
