import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    TrendingUpIcon,
    GlobeIcon,
    BriefcaseIcon,
    UsersIcon,
    AwardIcon,
    ArrowUpIcon,
    ArrowLeftIcon
} from '../../../components/icons.tsx';

/**
 * Ecosystem Report Page
 * Displays aggregate metrics and "wins" for the entire Scale/Elevate community.
 */
export const EcosystemReportPage: React.FC = () => {

    // Mock Aggregate Data
    const stats = [
        {
            label: "Total Ecosystem Revenue",
            value: "$850M+",
            subtext: "Generated LTM",
            icon: TrendingUpIcon,
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            label: "Employment Generated",
            value: "2,450+",
            subtext: "Full-Time Roles",
            icon: BriefcaseIcon,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            label: "Global Reach",
            value: "24",
            subtext: "Countries Represented",
            icon: GlobeIcon,
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            label: "PGN Members",
            value: "350+",
            subtext: "CEOs & Leaders",
            icon: UsersIcon,
            color: "text-orange-600",
            bg: "bg-orange-100"
        },
    ];

    const recentWins = [
        { company: "TechFlow", badge: "Series B", detail: "Closed $15M Funding Round", time: "2 days ago" },
        { company: "UrbanLogic", badge: "Expansion", detail: "Launched in European Market", time: "1 week ago" },
        { company: "GreenSprout", badge: "Revenue", detail: "Hit $10M ARR Milestone", time: "2 weeks ago" },
        { company: "Sarah Chen", badge: "Leadership", detail: "Awarded 'SaaS CEO of the Year'", time: "3 weeks ago" },
        { company: "MediLife", badge: "Exit", detail: "Acquired by HealthCorp for $45M", time: "1 month ago" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-4 animate-fade-in">
            {/* Header: More Compact */}
            <div className="flex items-center gap-4 pb-2 border-b border-primary/5">
                <Link
                    to="/"
                    className="p-2 hover:bg-primary/5 rounded-lg text-slate-400 hover:text-primary transition-all group"
                    title="Back to Dashboard"
                >
                    <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </Link>
                <PageHeader
                    title="Ecosystem Impact Report"
                    description="The collective power and performance of the PGN community."
                    className="mb-0" // Assume PageHeader accepts className or wrap it
                />
            </div>
            {/* If PageHeader doesn't accept className, the wrapper handles spacing */}

            {/* Hero Stats: Compact Grid & Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-2">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                <ArrowUpIcon className="w-2.5 h-2.5 mr-1" />
                                Growing
                            </span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-0.5">{stat.value}</h3>
                            <p className="text-xs font-semibold text-slate-600 mb-0.5">{stat.label}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{stat.subtext}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Visual & Ticker: Compact Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Chart Area: Reduced Height & Padding */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Revenue Growth (Scale & Elevate)</h3>
                            <p className="text-xs text-slate-500">Cumulative ARR growth over 12 months</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                <span className="text-[10px] font-medium text-slate-600">PGN Community</span>
                            </div>
                        </div>
                    </div>

                    {/* Compact Chart Bars */}
                    <div className="h-48 flex items-end justify-between gap-3 px-2 pb-2 border-b border-slate-100">
                        {[40, 55, 45, 60, 75, 65, 80, 70, 85, 90, 95, 100].map((h, i) => (
                            <div key={i} className="w-full flex gap-0.5 h-full items-end group">
                                <div
                                    className="w-full bg-primary/80 rounded-t-[2px] hover:bg-primary transition-colors delay-75"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                        <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                        <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
                    </div>
                </div>

                {/* Wall of Wins: Compact Vertical List */}
                <div className="lg:col-span-4 bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col max-h-[400px]">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                            <AwardIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-serif text-lg font-bold">Wall of Wins</h3>
                            <p className="text-[10px] text-slate-500">Recent community milestones</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        {recentWins.map((win, i) => (
                            <div key={i} className="bg-slate-50/50 border border-slate-100 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-default">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-900 text-xs">{win.company}</h4>
                                    <span className="text-[9px] font-bold bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full uppercase tracking-wider">{win.badge}</span>
                                </div>
                                <p className="text-xs text-slate-600 mb-1 leading-snug">{win.detail}</p>
                                <p className="text-[9px] text-slate-400 flex items-center gap-1">
                                    <ClockIcon className="w-2.5 h-2.5" /> {win.time}
                                </p>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 py-2.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors border border-primary/10">
                        Submit a Win
                    </button>
                </div>
            </div>

            {/* Map Placeholder */}
            {/* (Could be added later, keeping it simpler for V1) */}
        </div>
    );
};

// Helper Icon for this file only if needed, otherwise import
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
