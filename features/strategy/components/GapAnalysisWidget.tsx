import React from 'react';
import { TargetIcon, TrendingUpIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';

interface GapAnalysisProps {
    lastYearRevenue: number;
    projectedRevenue: number;
    revenueGoal: number;
}

export const GapAnalysisWidget: React.FC<GapAnalysisProps> = ({
    lastYearRevenue,
    projectedRevenue,
    revenueGoal,
}) => {
    // 1. Calculate Core Metrics
    const growth = Math.max(0, projectedRevenue - lastYearRevenue);
    const gap = Math.max(0, revenueGoal - projectedRevenue);
    const isGoalMet = projectedRevenue >= revenueGoal;

    // Avoid division by zero for bar widths
    const maxValue = Math.max(revenueGoal, projectedRevenue, lastYearRevenue, 1);

    // Calculate percentages for the visual bar (relative to the max value of the chart)
    const lastYearPct = (lastYearRevenue / maxValue) * 100;
    const growthPct = (growth / maxValue) * 100;
    const gapPct = (gap / maxValue) * 100;

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-black flex items-center gap-2">
                        <TargetIcon className="w-5 h-5 text-primary" />
                        Gap Analysis
                    </h3>
                    <p className="text-sm text-black mt-1">
                        Visualizing the bridge from last year to your goal.
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center border ${isGoalMet
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                    {isGoalMet ? (
                        <>
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Goal Expected Met
                        </>
                    ) : (
                        <>
                            <AlertCircleIcon className="w-4 h-4 mr-2" />
                            ${gap.toLocaleString()} Gap Remaining
                        </>
                    )}
                </div>
            </div>

            {/* Bridge Chart Visual */}
            <div className="relative pt-8 pb-4 px-2">
                {/* The Bar Container */}
                <div className="flex h-12 w-full rounded-lg overflow-hidden bg-gray-100 relative">

                    {/* Segment 1: Last Year (Base) */}
                    <div
                        style={{ width: `${lastYearPct}%` }}
                        className="h-full bg-slate-200 relative group flex items-center justify-center transition-all duration-500"
                    >
                        {lastYearPct > 10 && <span className="text-xs font-bold text-black">Last Year</span>}
                        <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            Last Year: ${lastYearRevenue.toLocaleString()}
                        </div>
                    </div>

                    {/* Segment 2: Growth (Projected) */}
                    {growth > 0 && (
                        <div
                            style={{ width: `${growthPct}%` }}
                            className="h-full bg-blue-600 relative group flex items-center justify-center transition-all duration-500"
                        >
                            {growthPct > 10 && <span className="text-xs font-bold text-white">Growth</span>}
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                Projected Growth: ${growth.toLocaleString()}
                            </div>
                        </div>
                    )}

                    {/* Segment 3: Gap (Your "Opportunity") */}
                    {!isGoalMet && gap > 0 && (
                        <div
                            style={{ width: `${gapPct}%` }}
                            className="h-full bg-amber-400/30 border-2 border-dashed border-amber-400 relative group flex items-center justify-center transition-all duration-500"
                        >
                            <div className="absolute inset-0 pattern-diagonal-lines opacity-10"></div>
                            {gapPct > 10 && <span className="text-xs font-bold text-amber-900 z-0">Gap</span>}
                            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                Remaining Gap: ${gap.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Axis Labels */}
                <div className="flex justify-between mt-2 text-xs font-bold text-black font-mono">
                    <span>$0</span>
                    <span>Goal: ${revenueGoal.toLocaleString()}</span>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded border border-slate-100">
                    <div className="text-xs text-black uppercase font-bold tracking-wider">Baseline</div>
                    <div className="text-xl font-bold text-black mt-1">${lastYearRevenue.toLocaleString()}</div>
                    <div className="text-xs text-black mt-1">Previous Year Actuals</div>
                </div>

                <div className="p-4 bg-blue-50 rounded border border-blue-100">
                    <div className="text-xs text-blue-800 uppercase font-bold tracking-wider">Projected Revenue</div>
                    <div className="text-xl font-bold text-blue-800 mt-1 flex items-center gap-2">
                        ${projectedRevenue.toLocaleString()}
                        <TrendingUpIcon className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-blue-800/70 mt-1">Growth: +${growth.toLocaleString()}</div>
                </div>

                <div className={`p-4 rounded border ${isGoalMet ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className={`text-xs uppercase font-bold tracking-wider ${isGoalMet ? 'text-green-600' : 'text-amber-600'}`}>
                        {isGoalMet ? 'Surplus' : 'Strategic Gap'}
                    </div>
                    <div className={`text-xl font-bold mt-1 ${isGoalMet ? 'text-green-800' : 'text-amber-800'}`}>
                        ${isGoalMet ? (projectedRevenue - revenueGoal).toLocaleString() : gap.toLocaleString()}
                    </div>
                    <div className={`text-xs mt-1 ${isGoalMet ? 'text-green-600' : 'text-amber-600/70'}`}>
                        {isGoalMet ? 'Above Target' : 'Needs Initatives'}
                    </div>
                </div>
            </div>
        </div>
    );
};
