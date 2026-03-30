import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileText, Printer, ChevronLeft, Calendar, TrendingUp, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { MOCK_BRIEFINGS, ExecutiveBriefing } from '../../../data/mockBriefings';
import { Link } from 'react-router-dom';

export default function ExecutiveBriefingsPage() {
    const [selectedBriefing, setSelectedBriefing] = useState<ExecutiveBriefing>(MOCK_BRIEFINGS[0]);
    const printRef = useRef<HTMLDivElement>(null);
    const printAllRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Executive_Briefing_${selectedBriefing.date}`,
        removeAfterPrint: true
    });

    const handlePrintAll = useReactToPrint({
        content: () => printAllRef.current,
        documentTitle: `All_Executive_Briefings`,
        removeAfterPrint: true
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Executive Briefings
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">AI-generated summaries from your strategy sessions</p>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
                >
                    <Printer className="w-4 h-4" />
                    Print Report
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-80px)]">
                {/* Sidebar: History List */}
                <div className="w-80 border-r border-slate-200 bg-white overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">History</h3>
                        <div className="space-y-2">
                            {MOCK_BRIEFINGS.map(briefing => (
                                <button
                                    key={briefing.id}
                                    onClick={() => setSelectedBriefing(briefing)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedBriefing.id === briefing.id
                                        ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200'
                                        : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${selectedBriefing.id === briefing.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {briefing.date}
                                        </span>
                                    </div>
                                    <h4 className={`font-semibold text-sm ${selectedBriefing.id === briefing.id ? 'text-blue-900' : 'text-slate-800'}`}>
                                        {briefing.title}
                                    </h4>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content: Printable Report Area */}
                <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex justify-center">
                    <div className="max-w-3xl w-full">
                        {/* Printable Container */}
                        <div ref={printRef} className="bg-white shadow-xl rounded-xl p-12 min-h-[1000px] print:shadow-none">
                            {/* Report Structure */}
                            <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
                                <div>
                                    <h2 className="text-4xl font-serif font-black text-slate-900 mb-2">EXECUTIVE BRIEFING</h2>
                                    <p className="text-slate-500 font-medium text-lg">ScaleIt Strategy Session</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                    <p className="text-xl font-bold text-slate-900">{new Date(selectedBriefing.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-10">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Executive Summary</h3>
                                <p className="text-lg text-slate-800 leading-relaxed font-serif italic">
                                    "{selectedBriefing.summary}"
                                </p>
                            </div>

                            <div className="space-y-8">
                                {/* Strategy Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-blue-900 tracking-tight">Strategy Updates</h3>
                                    </div>
                                    <div className="border-l-2 border-blue-100 pl-6 ml-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-2">{selectedBriefing.strategy.title}</h4>
                                                <ul className="space-y-1">
                                                    {selectedBriefing.strategy.items.map((item, i) => (
                                                        <li key={i} className="text-slate-700 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                                {selectedBriefing.strategy.impact}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-slate-100" />

                                {/* Execution Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-emerald-900 tracking-tight">Execution Wins</h3>
                                    </div>
                                    <div className="border-l-2 border-emerald-100 pl-6 ml-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-2">{selectedBriefing.execution.title}</h4>
                                                <ul className="space-y-1">
                                                    {selectedBriefing.execution.items.map((item, i) => (
                                                        <li key={i} className="text-slate-700 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                                {selectedBriefing.execution.impact}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-slate-100" />

                                {/* Risks Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-amber-900 tracking-tight">Risks & Issues</h3>
                                    </div>
                                    <div className="border-l-2 border-amber-100 pl-6 ml-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-2">{selectedBriefing.risks.title}</h4>
                                                {selectedBriefing.risks.items.length > 0 ? (
                                                    <ul className="space-y-1">
                                                        {selectedBriefing.risks.items.map((item, i) => (
                                                            <li key={i} className="text-slate-700 flex items-start gap-2">
                                                                <span className="mt-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-slate-500 italic">No critical risks identified.</p>
                                                )}

                                            </div>
                                            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                                {selectedBriefing.risks.impact}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Footer */}
                            <div className="mt-20 pt-8 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400 font-medium">Generated by ScaleIt Intelligence • {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Print All Container */}
            <div className="hidden">
                <div ref={printAllRef} className="p-12 space-y-12">
                    <div className="text-center border-b-2 border-slate-900 pb-8">
                        <h1 className="text-4xl font-serif font-black text-slate-900">Executive Briefing Archive</h1>
                        <p className="text-slate-500 font-medium">Complete History Export • {new Date().toLocaleDateString()}</p>
                    </div>

                    {MOCK_BRIEFINGS.map((briefing, index) => (
                        <div key={briefing.id} className={`${index > 0 ? 'page-break-before-always pt-12 border-t-2 border-dashed border-slate-200' : ''}`}>
                            <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-serif font-black text-slate-900 mb-2">BRIEFING REPORT</h2>
                                    <p className="text-slate-500 font-medium text-lg">{briefing.title}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                    <p className="text-xl font-bold text-slate-900">{new Date(briefing.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-10">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Executive Summary</h3>
                                <p className="text-lg text-slate-800 leading-relaxed font-serif italic">
                                    "{briefing.summary}"
                                </p>
                            </div>

                            <div className="space-y-8">
                                {/* Strategy Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-blue-900 tracking-tight">Strategy Updates</h3>
                                    </div>
                                    <div className="border-l-2 border-blue-100 pl-6 ml-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-2">{briefing.strategy.title}</h4>
                                                <ul className="space-y-1">
                                                    {briefing.strategy.items.map((item, i) => (
                                                        <li key={i} className="text-slate-700 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                                {briefing.strategy.impact}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-slate-100" />

                                {/* Execution Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-emerald-900 tracking-tight">Execution Wins</h3>
                                    </div>
                                    <div className="border-l-2 border-emerald-100 pl-6 ml-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-2">{briefing.execution.title}</h4>
                                                <ul className="space-y-1">
                                                    {briefing.execution.items.map((item, i) => (
                                                        <li key={i} className="text-slate-700 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                                {briefing.execution.impact}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-slate-100" />

                                {/* Risks Section */}
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-amber-900 tracking-tight">Risks & Issues</h3>
                                    </div>
                                    <div className="border-l-2 border-amber-100 pl-6 ml-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg mb-2">{briefing.risks.title}</h4>
                                                {briefing.risks.items.length > 0 ? (
                                                    <ul className="space-y-1">
                                                        {briefing.risks.items.map((item, i) => (
                                                            <li key={i} className="text-slate-700 flex items-start gap-2">
                                                                <span className="mt-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-slate-500 italic">No critical risks identified.</p>
                                                )}

                                            </div>
                                            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                                                {briefing.risks.impact}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
