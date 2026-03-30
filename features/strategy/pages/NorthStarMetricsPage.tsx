import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    ChevronLeft,
    TargetIcon,
    TrendingUpIcon,
    UsersIcon,
    BriefcaseIcon,
    HeadphonesIcon,
    SettingsIcon,
    PlusIcon,
    MoreHorizontalIcon,
    ArrowUpRightIcon,
    ArrowDownRightIcon,
    MinusIcon,
    CalendarIcon,
    InfoIcon
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.tsx';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// =============================================================================
// Types
// =============================================================================

type DepartmentId = 'marketing' | 'sales' | 'operations' | 'hr' | 'customer_service' | 'finance';

interface Metric {
    id: string;
    name: string;
    monthlyTarget: string;
    weeklyTarget: string;
    actualMonthly?: string; // For progress viz
    actualWeekly?: string;
    status: 'on-track' | 'at-risk' | 'off-track';
    trend: 'up' | 'down' | 'flat';
    unit: string;
}

interface DepartmentConfig {
    id: DepartmentId;
    label: string;
    icon: React.ElementType;
    color: string;
    description: string;
}

// =============================================================================
// Mock Data
// =============================================================================

const DEPARTMENTS: DepartmentConfig[] = [
    { id: 'marketing', label: 'Marketing', icon: TargetIcon, color: 'bg-blue-500', description: 'Lead generation and brand awareness.' },
    { id: 'sales', label: 'Sales', icon: BriefcaseIcon, color: 'bg-green-500', description: 'Revenue generation and deal closing.' },
    { id: 'operations', label: 'Operations', icon: SettingsIcon, color: 'bg-purple-500', description: 'Efficiency, logicstics, and fulfillment.' },
    { id: 'customer_service', label: 'Customer Service', icon: HeadphonesIcon, color: 'bg-orange-500', description: 'Customer satisfaction and retention.' },
    { id: 'hr', label: 'HR / People', icon: UsersIcon, color: 'bg-pink-500', description: 'Recruiting, retention, and culture.' },
];

const MOCK_METRICS: Record<DepartmentId, Metric[]> = {
    marketing: [
        { id: 'm1', name: 'Qualified Leads (MQLs)', monthlyTarget: '200', weeklyTarget: '50', actualMonthly: '145', status: 'on-track', trend: 'up', unit: 'leads' },
        { id: 'm2', name: 'Cost Per Acquisition', monthlyTarget: '$45', weeklyTarget: '$45', actualMonthly: '$42', status: 'on-track', trend: 'down', unit: 'USD' }, // Down is good for cost
        { id: 'm3', name: 'Website Traffic', monthlyTarget: '15k', weeklyTarget: '3.5k', actualMonthly: '10k', status: 'at-risk', trend: 'flat', unit: 'visits' },
    ],
    sales: [
        { id: 's1', name: 'New Revenue', monthlyTarget: '$150k', weeklyTarget: '$37.5k', actualMonthly: '$160k', status: 'on-track', trend: 'up', unit: 'USD' },
        { id: 's2', name: 'Deals Closed', monthlyTarget: '12', weeklyTarget: '3', actualMonthly: '8', status: 'at-risk', trend: 'flat', unit: 'deals' },
        { id: 's3', name: 'Avg Deal Size', monthlyTarget: '$12.5k', weeklyTarget: '$12.5k', actualMonthly: '$13.2k', status: 'on-track', trend: 'up', unit: 'USD' },
    ],
    operations: [
        { id: 'o1', name: 'Order Fulfillment Time', monthlyTarget: '< 24h', weeklyTarget: '< 24h', actualMonthly: '22h', status: 'on-track', trend: 'down', unit: 'hours' },
        { id: 'o2', name: 'Inventory Accuracy', monthlyTarget: '99.5%', weeklyTarget: '99.5%', actualMonthly: '98%', status: 'off-track', trend: 'flat', unit: '%' },
    ],
    customer_service: [
        { id: 'cs1', name: 'NPS Score', monthlyTarget: '70+', weeklyTarget: '70+', actualMonthly: '72', status: 'on-track', trend: 'up', unit: 'score' },
        { id: 'cs2', name: 'Ticket Resolution Time', monthlyTarget: '< 4h', weeklyTarget: '< 4h', actualMonthly: '5.2h', status: 'at-risk', trend: 'up', unit: 'hours' },
    ],
    hr: [
        { id: 'h1', name: 'Employee eNPS', monthlyTarget: '40+', weeklyTarget: '-', actualMonthly: '42', status: 'on-track', trend: 'flat', unit: 'score' },
    ],
    finance: [] // Empty state test
};

// =============================================================================
// Components
// =============================================================================

const ValueCard: React.FC<{ label: string; value: string; subtext?: string; highlight?: boolean }> = ({ label, value, subtext, highlight }) => (
    <div className={`flex flex-col p-2.5 rounded-lg ${highlight ? 'bg-primary/5 border border-primary/20' : 'bg-surface-variant/30 border border-transparent'}`}>
        <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/70 mb-0.5">{label}</span>
        <span className={`text-lg font-bold ${highlight ? 'text-primary' : 'text-on-surface'} leading-none`}>{value}</span>
        {subtext && <span className="text-[10px] text-on-surface-variant mt-1 leading-tight">{subtext}</span>}
    </div>
);

const TrendBadge: React.FC<{ trend: Metric['trend']; status: Metric['status'] }> = ({ trend, status }) => {
    const config = {
        'on-track': { color: 'text-green-700 bg-green-50 border border-green-100' },
        'at-risk': { color: 'text-yellow-700 bg-yellow-50 border border-yellow-100' },
        'off-track': { color: 'text-red-700 bg-red-50 border border-red-100' },
    }[status];

    const Icon = trend === 'up' ? ArrowUpRightIcon : trend === 'down' ? ArrowDownRightIcon : MinusIcon;

    return (
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${config.color}`}>
            <Icon className="w-3 h-3" />
            <span>{status.replace('-', ' ')}</span>
        </div>
    );
};

const NorthStarMetricsPage: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [activeDept, setActiveDept] = useState<DepartmentId>('marketing');
    const navigate = useNavigate();

    const currentMetrics = MOCK_METRICS[activeDept] || [];
    const activeDeptConfig = DEPARTMENTS.find(d => d.id === activeDept)!;

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="North Star Metrics Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        North Star Metrics are the key performance indicators (KPIs) that define success for each department in your organization.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Departments:</strong> Toggle between departments to see their specific metrics.</li>
                        <li><strong>Metrics:</strong> Each metric shows its current value, status (Red/Yellow/Green), and owner.</li>
                        <li><strong>Laser Focus:</strong> Identify the 2-3 "North Star" metrics per department that drive the most impact.</li>
                    </ul>
                    <p>
                        Track these daily or weekly to ensure your team is moving toward your 3-year Big Picture Vision.
                    </p>
                </div>
            </InstructionsModal>
            <PageHeader
                title="North Star Metrics"
                description="Laser-focus on the numbers that truly matter."
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
                className="shrink-0"
            >
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4 text-blue-600" />
                        Instructions
                    </button>
                </div>
            </PageHeader>

            <div className="flex-1 flex flex-col overflow-hidden w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 gap-4">

                {/* Department Navigation */}
                <div className="shrink-0">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {DEPARTMENTS.map(dept => {
                            const Icon = dept.icon;
                            const isActive = activeDept === dept.id;
                            const count = MOCK_METRICS[dept.id]?.length || 0;

                            return (
                                <button
                                    key={dept.id}
                                    onClick={() => setActiveDept(dept.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border text-sm ${isActive
                                        ? 'bg-white shadow-sm border-primary/20 ring-1 ring-primary/20 text-primary font-bold'
                                        : 'bg-white/50 border-transparent hover:bg-white text-slate-500 hover:text-slate-900 font-medium'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                                    <span className="whitespace-nowrap">{dept.label}</span>
                                    {count > 0 && (
                                        <span className={`text-[10px] ml-1 px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary/10 text-primary-dark' : 'bg-slate-100 text-slate-500'}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">

                        {/* Section Header */}
                        <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-2 border-b border-slate-200/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <activeDeptConfig.icon className={`w-5 h-5 ${activeDeptConfig.color.replace('bg-', 'text-')}`} />
                                    {activeDeptConfig.label} Metrics
                                </h2>
                                <p className="text-sm text-slate-500">{activeDeptConfig.description}</p>
                            </div>

                        </div>

                        {/* Metrics Grid */}
                        {currentMetrics.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                                {currentMetrics.map(metric => (
                                    <div key={metric.id} className="group relative bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all duration-200">
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <TrendBadge trend={metric.trend} status={metric.status} />
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900 leading-tight truncate group-hover:text-primary transition-colors" title={metric.name}>
                                                    {metric.name}
                                                </h3>
                                            </div>
                                            <button className="text-slate-300 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all">
                                                <MoreHorizontalIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Targets Grid */}
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <ValueCard
                                                label="Weekly"
                                                value={metric.weeklyTarget}
                                            />
                                            <ValueCard
                                                label="Monthly"
                                                value={metric.monthlyTarget}
                                                highlight
                                                subtext={metric.actualMonthly ? `${metric.actualMonthly} act` : undefined}
                                            />
                                        </div>

                                        {/* Progress Bar */}
                                        <div>
                                            <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 mb-1">
                                                <span>Monthly Progress</span>
                                                <span>{metric.actualMonthly && metric.monthlyTarget.includes('%') ? metric.actualMonthly : '72%'}</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${metric.status === 'on-track' ? 'bg-green-500' : metric.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: '72%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* New Metric Ghost Card */}
                                <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group h-full min-h-[180px]">
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm group-hover:border-blue-200 group-hover:scale-110 flex items-center justify-center mb-2 transition-all">
                                        <PlusIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600">Add Metric</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-3">
                                    <TargetIcon className="w-6 h-6 text-slate-300" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-1">No Metrics Yet</h3>
                                <p className="text-sm text-slate-500 max-w-xs text-center mb-4">
                                    Start tracking what matters for {activeDeptConfig.label}.
                                </p>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NorthStarMetricsPage;
