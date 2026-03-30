import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { MOCK_MEMBER_GOALS } from '../../../data/mockFinancials.ts';
import { MOCK_USER } from '../../../data/mockUsers.ts';
import { mockDataService } from '../../../services/mockDataService.ts';
import { Task, Session } from '../../../types.ts';
import { CEOAgentWidget } from '../components/CEOAgentWidget.tsx';
import {
    CalendarIcon,
    CheckSquareIcon,
    LayoutGridIcon,
    SparklesIcon,
    TrendingUpIcon
} from '../../../components/icons.tsx';
import { ChevronRight } from 'lucide-react';
import { ExecutiveBriefing } from '../components/ExecutiveBriefing.tsx';
import { LiveWeeklySchedule } from '../components/LiveWeeklySchedule.tsx';
import { VideoCommandCenter } from '../components/VideoCommandCenter.tsx';
import { GoalsWidget } from '../components/DashboardWidgets.tsx';
import { QuoteOverlay } from '../components/QuoteOverlay.tsx';
import { SortableWidget } from '../components/SortableWidget.tsx';
import { DashboardAccordion } from '../components/DashboardAccordion.tsx';
import { PinnedShortcuts } from '../components/PinnedShortcuts.tsx';

/**
 * Animated container for staggered entrance animations
 */
const AnimatedContainer: React.FC<{ children: React.ReactNode, delay: number }> = ({ children, delay }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    return (
        <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {children}
        </div>
    );
};

/**
 * Compact stat badge for header
 */
const StatBadge: React.FC<{ icon: React.ReactNode; value: number; label: string; color: string }> =
    ({ icon, value, label, color }) => (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${color}`}>
            {icon}
            <span className="font-semibold text-sm">{value}</span>
            <span className="text-xs opacity-80 hidden sm:inline">{label}</span>
        </div>
    );

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const goals = useMemo(() => MOCK_MEMBER_GOALS, []);
    const [widgetOrder, setWidgetOrder] = useState<string[]>([]);

    useEffect(() => {
        setTasks(mockDataService.getTasks());
        setSessions(mockDataService.getSessions());
        const savedOrder = localStorage.getItem('dashboardWidgetOrder');
        if (savedOrder) {
            try {
                let parsedOrder = JSON.parse(savedOrder);
                parsedOrder = parsedOrder.filter((w: string) => !['action_items', 'quick_actions', 'weekly_schedule', 'goals'].includes(w));
                setWidgetOrder(parsedOrder);
            } catch (e) {
                console.error("Failed to parse widget order", e);
            }
        }
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setWidgetOrder((items) => {
                const oldIndex = items.indexOf(active.id as string);
                const newIndex = items.indexOf(over!.id as string);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem('dashboardWidgetOrder', JSON.stringify(newOrder));
                return newOrder;
            });
        }
    };

    const suggestedTasks = tasks.filter(t => t.status === 'suggested');
    const pendingTasks = tasks.filter(t => !t.completed && t.status !== 'suggested');
    const upcomingSessions = sessions.filter(s => new Date(s.date) >= new Date() && !s.attended && s.status !== 'completed')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const firstName = MOCK_USER.name.split(' ')[0];

    const renderWidget = (id: string, isMobile: boolean) => {
        return null;
    };

    return (
        <div className="space-y-4 max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 pb-20 lg:pb-6">
            <QuoteOverlay />

            <AnimatedContainer delay={0}>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                            Welcome Back, {firstName}!
                        </h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {suggestedTasks.length > 0 && (
                            <Link to="/action-plan">
                                <StatBadge
                                    icon={<SparklesIcon className="w-4 h-4" />}
                                    value={suggestedTasks.length}
                                    label="AI suggestions"
                                    color="bg-purple-50 border border-purple-100 text-purple-700 shadow-sm animate-pulse"
                                />
                            </Link>
                        )}
                    </div>
                </div>
            </AnimatedContainer>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <AnimatedContainer delay={50}>
                        {upcomingSessions.length > 0 && new Date(upcomingSessions[0].date).toDateString() === new Date().toDateString() && (
                            <VideoCommandCenter
                                userRole="client"
                                nextSession={{
                                    ...upcomingSessions[0],
                                    date: new Date(upcomingSessions[0].date),
                                    attendees: upcomingSessions[0].attendees || ['Mentor']
                                }}
                            />
                        )}
                    </AnimatedContainer>

                    <AnimatedContainer delay={100}>
                        <div className="lg:block hidden mb-6">
                            <LiveWeeklySchedule sessions={sessions} />
                        </div>
                        <div className="lg:hidden block mb-6">
                            <DashboardAccordion title="Your Week Ahead" icon={<CalendarIcon className="w-5 h-5" />}>
                                <LiveWeeklySchedule sessions={sessions} hideWrapper />
                            </DashboardAccordion>
                        </div>
                    </AnimatedContainer>

                    <AnimatedContainer delay={150}>
                        <div className="lg:block hidden mb-6">
                            <PinnedShortcuts />
                        </div>
                        <div className="lg:hidden block mb-6">
                            <DashboardAccordion title="Pinned Shortcuts" icon={<LayoutGridIcon className="w-5 h-5" />}>
                                <div className="p-4">
                                    <PinnedShortcuts hideWrapper />
                                </div>
                            </DashboardAccordion>
                        </div>
                    </AnimatedContainer>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={widgetOrder} strategy={verticalListSortingStrategy}>
                            <div className="grid grid-cols-1 gap-4 lg:gap-6">
                                {widgetOrder.map((id, index) => (
                                    <div key={id}>
                                        <div className="lg:block hidden">
                                            <SortableWidget id={id}>
                                                <AnimatedContainer delay={100 + (index * 50)}>
                                                    {renderWidget(id, false)}
                                                </AnimatedContainer>
                                            </SortableWidget>
                                        </div>
                                        <div className="lg:hidden block">
                                            <AnimatedContainer delay={100 + (index * 50)}>
                                                {renderWidget(id, true)}
                                            </AnimatedContainer>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <AnimatedContainer delay={300}>
                        <div className="lg:block hidden">
                            <ExecutiveBriefing />
                        </div>
                        <div className="lg:hidden block">
                            <DashboardAccordion title="Executive Briefing" icon={<SparklesIcon className="w-5 h-5" />}>
                                <ExecutiveBriefing hideWrapper />
                            </DashboardAccordion>
                        </div>
                    </AnimatedContainer>
                </div>

                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                    <AnimatedContainer delay={100}>
                        <div className="lg:block hidden">
                            <CEOAgentWidget />
                        </div>
                        <div className="lg:hidden block">
                            <DashboardAccordion title="Pinnacle AI" icon={<SparklesIcon className="w-5 h-5 text-primary" />}>
                                <CEOAgentWidget hideWrapper />
                            </DashboardAccordion>
                        </div>
                    </AnimatedContainer>

                    <AnimatedContainer delay={150}>
                        <div className="lg:block hidden mb-6">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 transition-all hover:shadow-md lg:cursor-default group/card">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 group-hover/card:bg-blue-100 transition-colors">
                                            <TrendingUpIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700/70">Community Impact</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 text-blue-700">LTM</span>
                                </div>
                                <h4 className="font-serif text-lg font-medium mb-1 text-gray-900 leading-tight">PINNACLE Ecosystem Revenue</h4>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-bold text-gray-900 tracking-tight">$850M+</span>
                                </div>
                                <Link to="/ecosystem-report" className="inline-flex items-center gap-1.5 text-[10px] font-black bg-blue-50 border border-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all uppercase tracking-widest w-full justify-center shadow-sm">
                                    View Report <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                        <div className="lg:hidden block mb-6">
                            <DashboardAccordion title="Community Impact" icon={<TrendingUpIcon className="w-5 h-5" />}>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700/70">Ecosystem Revenue</span>
                                        <span className="text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 text-blue-700">LTM</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-3xl font-bold text-gray-900 tracking-tight">$850M+</span>
                                    </div>
                                    <Link to="/ecosystem-report" className="inline-flex items-center gap-2 text-[10px] font-bold bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all uppercase tracking-widest w-full justify-center shadow-md">
                                        View Report <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </DashboardAccordion>
                        </div>
                    </AnimatedContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
