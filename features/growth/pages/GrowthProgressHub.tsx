import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/PageHeader.tsx";

import {
    BarChartIcon,
    EyeIcon,
    TrendingUpIcon,
    ClipboardCheckIcon,
    TargetIcon,
    ChevronRightIcon
} from "../../../components/icons.tsx";

interface HubCard {
    title: string;
    description: string;
    to: string;
    icon: React.ElementType;
    comingSoon?: boolean;
    color: string;
}

const hubCards: HubCard[] = [
    {
        title: "Score Tracker",
        description: "Track your business health metrics and pillar scores over time.",
        to: "/score-tracker",
        icon: BarChartIcon,
        color: "text-blue-500"
    },
    {
        title: "Business Snapshot",
        description: "A comprehensive gap analysis of your business across all pillars.",
        to: "/gap-analysis",
        icon: EyeIcon,
        color: "text-purple-500"
    },
    {
        title: "Growth Tracking",
        description: "Monitor revenue, goals, and growth milestones.",
        to: "/growth-tracking",
        icon: TrendingUpIcon,
        color: "text-green-500"
    },
    {
        title: "Assessments",
        description: "Leadership, business, and onboarding assessments to identify growth areas.",
        to: "/leadership-assessment",
        icon: ClipboardCheckIcon,
        color: "text-orange-500"
    },
    {
        title: "Quarterly Action Plan",
        description: "Review and manage your high-priority items and 'Big Rocks' for this quarter.",
        to: "/plan",
        icon: TargetIcon,
        color: "text-red-500"
    },
];

const GrowthProgressHub: React.FC = () => {
    return (
        <div className="relative p-2 md:p-6 min-h-screen transition-all duration-700">
            {/* Background Decorative Blobs - Slightly smaller for compact feel */}
            <div className="fixed top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-soft" />
            <div className="fixed bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="mb-6 md:mb-8 px-2 md:px-0">
                    <PageHeader
                        title="Growth Progress"
                        description="Track your development across assessments, scores, and growth milestones."
                    />
                </div>

                <div className="backdrop-blur-xl bg-white/30 p-4 md:p-6 rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/40">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                        {hubCards.map((card) => (
                            <Link
                                key={card.title}
                                to={card.to}
                                className="group flex flex-col p-5 md:p-6 rounded-2xl transition-all duration-300 transform border bg-white/30 backdrop-blur-md border-white/60 hover:bg-white/60 hover:border-white hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner border border-white group-hover:scale-105 transition-transform duration-500">
                                        <card.icon className={`w-5 h-5 md:w-6 md:h-6 ${card.color}`} />
                                    </div>
                                    <div className="bg-black/5 rounded-full p-1.5 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        <ChevronRightIcon className="w-3.5 h-3.5" />
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-base md:text-lg font-black text-on-surface mb-1 md:mb-1.5 tracking-tight group-hover:text-black transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium line-clamp-2 md:line-clamp-3">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-4 md:mt-6 flex items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-primary">
                                    <span className="group-hover:mr-2 transition-all">View Progress</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowthProgressHub;
