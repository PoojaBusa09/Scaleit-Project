import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../../../types.ts';
import { MemberGoal } from '../../../data/mockFinancials.ts';
import {
    CheckSquareIcon,
    TrendingUpIcon,
    ClockIcon,
    ArrowRight
} from 'lucide-react';

// ============================================================================
// Wrapper Component (New "Clean Card" Style)
// ============================================================================
export const DashboardCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md ${className}`}>
        {children}
    </div>
);

// ============================================================================
// Action Items Widget
// ============================================================================
interface ActionItemsWidgetProps {
    tasks: Task[];
}

export const ActionItemsWidget: React.FC<ActionItemsWidgetProps> = ({ tasks }) => {
    const pendingTasks = tasks.filter(t => !t.completed && t.status !== 'suggested').slice(0, 4);

    return (
        <DashboardCard className="h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <CheckSquareIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-none">Action Plan</h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">Priority items for you</p>
                    </div>
                </div>
                <Link to="/action-plan" className="text-xs font-bold text-blue-600 tracking-wide hover:text-blue-800 uppercase flex items-center gap-1">
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            <div className="p-2 space-y-1 flex-1">
                {pendingTasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 group p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <div className="mt-1 w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium leading-snug group-hover:text-blue-700 transition-colors">{task.text}</p>
                            {task.dueDate && (
                                <p className="text-[11px] text-gray-400 font-medium mt-1 flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                {pendingTasks.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-sm text-gray-500 italic">Everything is caught up!</p>
                    </div>
                )}
            </div>
        </DashboardCard>
    );
};

// ============================================================================
// Strategic Goals Widget
// ============================================================================
interface GoalsWidgetProps {
    goals: MemberGoal[];
    hideWrapper?: boolean;
}

export const GoalsWidget: React.FC<GoalsWidgetProps> = ({ goals, hideWrapper = false }) => {
    const content = (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
            {goals.slice(0, 3).map(goal => {
                const pct = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
                return (
                    <div key={goal.id} className="space-y-3">
                        <div className="flex justify-between items-baseline mb-1">
                            <p className="text-sm font-bold text-gray-700 uppercase tracking-wider truncate pr-2" title={goal.title}>{goal.title}</p>
                            <span className={`text-sm font-black ${pct >= 100 ? 'text-green-600' : 'text-gray-900'}`}>{Math.round(pct)}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 font-bold tracking-tight">
                            <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">${(goal.currentValue / 1000).toFixed(0)}k</span>
                            <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">${(goal.targetValue / 1000).toFixed(0)}k</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    if (hideWrapper) return content;

    return (
        <DashboardCard className="group cursor-pointer">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                        <TrendingUpIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900 leading-none">Strategic Goals</h3>
                </div>
                <Link to="/growth-tracking" className="text-xs font-bold text-green-700 tracking-wide hover:text-green-800 uppercase flex items-center gap-1">
                    Full Report <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
            {content}
        </DashboardCard>
    );
};

