import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    TrendingUpIcon,
    TargetIcon,
    CalendarIcon,
    CheckCircleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from "../../../components/icons.tsx";
import { mockDataService } from '../../../services/mockDataService.ts';
import { MemberGoal, FinancialData, Milestone as MilestoneType } from '../types.ts';

// --- Types ---

interface MetricCardProps {
    title: string;
    value: string;
    change: number;
    changeLabel: string;
    icon: React.ElementType;
    color: "primary" | "accent" | "success" | "info";
}

interface GoalCardProps extends MemberGoal { }

interface MilestoneProps extends MilestoneType { }

// --- Constants ---

const CATEGORY_COLORS: Record<string, { bg: string; text: string; progressBg: string }> = {
    C: { bg: "bg-green-500", text: "text-white", progressBg: "bg-green-500" },
    S: { bg: "bg-blue-500", text: "text-white", progressBg: "bg-blue-500" },
    A: { bg: "bg-purple-500", text: "text-white", progressBg: "bg-purple-500" },
    L: { bg: "bg-orange-500", text: "text-white", progressBg: "bg-orange-500" },
    E: { bg: "bg-pink-500", text: "text-white", progressBg: "bg-pink-500" },
};

// --- Components ---

/**
 * Display a key metric with a value, change indicator, and icon.
 */
const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    changeLabel,
    icon: Icon,
    color,
}) => {
    const colorStyles = {
        primary: { bg: "bg-blue-100", iconColor: "text-blue-600" },
        accent: { bg: "bg-amber-100", iconColor: "text-amber-600" },
        success: { bg: "bg-teal-100", iconColor: "text-teal-600" },
        info: { bg: "bg-sky-100", iconColor: "text-sky-600" },
    };

    const isPositive = change >= 0;

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorStyles[color].bg}`}
                    aria-hidden="true"
                >
                    <Icon className={`w-6 h-6 ${colorStyles[color].iconColor}`} />
                </div>
                <div
                    className={`flex items-center text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}
                    role="status"
                    aria-label={`${Math.abs(change)}% ${isPositive ? 'increase' : 'decrease'}`}
                >
                    {isPositive ? (
                        <ArrowUpIcon className="w-4 h-4 mr-0.5" />
                    ) : (
                        <ArrowDownIcon className="w-4 h-4 mr-0.5" />
                    )}
                    {Math.abs(change)}%
                </div>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>
        </div>
    );
};

/**
 * Displays progress towards a specific goal.
 */
const GoalCard: React.FC<GoalCardProps> = ({
    title,
    currentValue,
    targetValue,
    unit,
    category,
}) => {
    const progress = Math.min((currentValue / targetValue) * 100, 100);
    const categoryStyle = CATEGORY_COLORS[category] || { bg: "bg-gray-500", text: "text-white", progressBg: "bg-gray-500" };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${categoryStyle.bg} ${categoryStyle.text}`}
                    title={`Category: ${category}`}
                >
                    {category}
                </span>
                <span className="text-sm font-semibold text-gray-500">
                    {progress.toFixed(0)}%
                </span>
            </div>
            <h4 className="font-bold text-gray-800 mb-3">{title}</h4>
            <div
                className="w-full bg-gray-100 rounded-full h-2 mb-3"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progress for ${title}`}
            >
                <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-800">
                    {unit === "$" ? `${unit}${currentValue.toLocaleString()}` : `${currentValue}${unit === "%" ? unit : ` ${unit}`}`}
                </span>
                <span className="text-gray-400">
                    of {unit === "$" ? `${unit}${targetValue.toLocaleString()}` : `${targetValue}${unit === "%" ? unit : ` ${unit}`}`}
                </span>
            </div>
        </div>
    );
};

/**
 * Represents a significant event or achievement in the business timeline.
 */
const Milestone: React.FC<MilestoneProps & { isLast?: boolean }> = ({
    title,
    date,
    completed,
    description,
    isLast = false,
}) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${completed
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300"
                    }`}
                aria-label={completed ? "Completed" : "Pending"}
            >
                {completed ? (
                    <CheckCircleIcon className="w-5 h-5" />
                ) : (
                    <TargetIcon className="w-5 h-5" />
                )}
            </div>
            {!isLast && <div className="w-0.5 flex-1 bg-gray-200 mt-2" />}
        </div>
        <div className={`pb-6 ${isLast ? '' : ''}`}>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-bold text-gray-800">{title}</h4>
                {completed && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Completed
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-400 mb-1">{date}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);

/**
 * Growth Tracking Page
 * Dashboard for monitoring key business metrics, goals, and milestones.
 */
const GrowthTracking: React.FC = () => {
    // CRITICAL: All hooks must be called before any conditional returns
    const navigate = useNavigate();

    const [financials, setFinancials] = useState<FinancialData | null>(null);
    const [goals, setGoals] = useState<MemberGoal[]>([]);
    const [milestones, setMilestones] = useState<MilestoneType[]>([]);
    const [stats, setStats] = useState({
        sessionsAttended: 0,
        tasksCompleted: 0
    });

    useEffect(() => {
        // Fetch data from service
        const f = mockDataService.getFinancialMetrics();
        const g = mockDataService.getGoals();
        const m = mockDataService.getMilestones();

        setFinancials(f);
        setGoals(g);
        setMilestones(m);

        const sessions = mockDataService.getSessions();
        const tasks = mockDataService.getTasks();

        setStats({
            sessionsAttended: sessions.filter(s => new Date(s.scheduledAt) <= new Date()).length,
            tasksCompleted: tasks.filter(t => t.completed).length
        });
    }, []);

    // Handle back navigation properly using browser history
    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigate('/');
        }
    };

    if (!financials) {
        return (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-500 font-medium">Loading Growth Metrics...</p>
            </div>
        );
    }

    if (typeof financials.revenue !== 'number') {
        return (
            <div className="p-12 text-center text-red-600 bg-red-50 rounded-xl border border-red-200 m-6">
                <h3 className="font-bold text-lg mb-2">Data Load Error</h3>
                <p>Financial metrics could not be retrieved. Please check your connection or data sources.</p>
            </div>
        );
    }

    const keyMetrics: MetricCardProps[] = [
        {
            title: "Revenue Growth",
            value: `$${(financials.revenue / 1000).toFixed(0)}K`,
            change: 12,
            changeLabel: "vs last quarter",
            icon: TrendingUpIcon,
            color: "accent",
        },
        {
            title: "Goal Completion",
            value: "78%",
            change: 5,
            changeLabel: "vs last month",
            icon: TargetIcon,
            color: "success",
        },
        {
            title: "Sessions Attended",
            value: stats.sessionsAttended.toString(),
            change: 8,
            changeLabel: "this quarter",
            icon: CalendarIcon,
            color: "primary",
        },
        {
            title: "Tasks Completed",
            value: stats.tasksCompleted.toString(),
            change: 3,
            changeLabel: "vs last quarter",
            icon: CheckCircleIcon,
            color: "info",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <PageHeader
                title="Growth Tracking"
                description="Monitor your progress, track key metrics, and celebrate your business milestones."
                onBack={handleBack}
                backLabel="Back"
            />

            {/* Key Metrics */}
            <section className="mb-10 mt-6" aria-label="Key Metrics">
                <h2 className="text-lg font-serif text-gray-700 uppercase tracking-wide mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {keyMetrics.map((metric, index) => (
                        <MetricCard key={index} {...metric} />
                    ))}
                </div>
            </section>

            {/* Goals Progress */}
            <section className="mb-10" aria-label="Goals Progress">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-serif text-gray-700 uppercase tracking-wide">Goals Progress</h2>
                    <button className="flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                        + Add New Goal
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.map((goal) => (
                        <GoalCard key={goal.id} {...goal} />
                    ))}
                </div>
            </section>

            {/* Milestones Timeline */}
            <section aria-label="Milestones Timeline">
                <h2 className="text-lg font-serif text-gray-700 uppercase tracking-wide mb-4">Milestones</h2>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    {milestones.map((milestone, index) => (
                        <Milestone
                            key={index}
                            {...milestone}
                            isLast={index === milestones.length - 1}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GrowthTracking;
