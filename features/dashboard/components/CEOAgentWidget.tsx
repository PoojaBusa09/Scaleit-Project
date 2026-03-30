/**
 * CEO Agent Widget
 * Central intelligence widget displaying proactive updates: follow-ups, 
 * action items, alerts, reminders, and suggestions with real-time feed.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    AgentUpdate,
    FollowUpItem,
    PrioritizedAction,
    Reminder,
    Suggestion,
    ScaleItPillar
} from '../../../types';
import {
    Sparkles,
    Bell,
    CheckCircle,
    Clock,
    Lightbulb,
    Calendar,
    ChevronRight,
    RefreshCw,
    X,
    MessageCircle,
    Zap,
    Target
} from 'lucide-react';
import ceoAgentService from '../../../services/ceoAgentService';

// =============================================================================
// Types
// =============================================================================

type TabType = 'all' | 'actions' | 'alerts' | 'suggestions';
type TimeFilter = 'today' | 'week' | 'month';

// =============================================================================
// Sub-Components
// =============================================================================

const PillarBadge: React.FC<{ pillar: ScaleItPillar; small?: boolean }> = ({ pillar, small }) => {
    const colors: Record<ScaleItPillar, string> = {
        Strategic: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        CashFlow: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        Alliance: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        Leadership: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        Execution: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    };

    return (
        <span className={`${small ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'} font-medium rounded-full ${colors[pillar]}`}>
            {pillar}
        </span>
    );
};

const UrgencyIndicator: React.FC<{ level: string }> = ({ level }) => {
    const styles = {
        critical: 'bg-red-500',
        high: 'bg-orange-500',
        medium: 'bg-yellow-500',
        low: 'bg-green-500'
    };

    return (
        <span className={`w-2 h-2 rounded-full ${styles[level as keyof typeof styles] || styles.medium}`} />
    );
};

const ActionCard: React.FC<{
    action: PrioritizedAction;
    onAction: (actionType: string) => void;
}> = ({ action, onAction }) => (
    <div className="p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
        <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <UrgencyIndicator level={action.urgency} />
                    <span className="text-sm font-medium text-on-surface truncate">{action.title}</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">{action.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                    {action.scaleItPillar && <PillarBadge pillar={action.scaleItPillar} small />}
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {action.estimatedTime}
                    </span>
                </div>
            </div>
            <button
                onClick={() => onAction('complete')}
                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>

        {/* AI Reasoning tooltip */}
        <details className="mt-2">
            <summary className="text-xs text-on-surface-variant cursor-pointer hover:text-on-surface flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Why this?
            </summary>
            <p className="mt-1 text-xs text-on-surface-variant bg-surface-container-low rounded p-2">
                {action.reasoning}
            </p>
        </details>
    </div>
);


const SuggestionCard: React.FC<{
    suggestion: Suggestion;
    onAction: (actionType: string) => void;
    onDismiss: () => void;
}> = ({ suggestion, onAction, onDismiss }) => (
    <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div>
                    <h4 className="text-sm font-medium text-on-surface">{suggestion.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">{suggestion.description}</p>
                    <p className="text-xs text-on-surface-variant/80 mt-2 italic">
                        💡 {suggestion.reasoning}
                    </p>
                </div>
            </div>
            <button
                onClick={onDismiss}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </div>

        <div className="flex gap-2 mt-3">
            {suggestion.quickActions.map((qa, i) => (
                <button
                    key={i}
                    onClick={() => onAction(qa.action)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${qa.action === 'complete' || qa.action === 'schedule'
                        ? 'bg-primary text-on-primary hover:bg-primary/90'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                >
                    {qa.label}
                </button>
            ))}
        </div>
    </div>
);

const ReminderCard: React.FC<{
    reminder: Reminder;
    onDismiss: () => void;
}> = ({ reminder, onDismiss }) => (
    <div className="p-3 bg-surface-container rounded-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-on-surface-variant" />
            <div>
                <p className="text-base font-bold text-on-surface line-tight">{reminder.title}</p>
                <p className="text-sm text-on-surface-variant mt-0.5">
                    {new Date(reminder.dueAt).toLocaleString()}
                </p>
            </div>
        </div>
        <button
            onClick={onDismiss}
            className="p-1 text-on-surface-variant hover:text-on-surface"
        >
            <X className="w-4 h-4" />
        </button>
    </div>
);

const FollowUpCard: React.FC<{
    followUp: FollowUpItem;
    onAction: () => void;
}> = ({ followUp, onAction }) => (
    <div className="p-3 bg-surface-container rounded-lg">
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
                <UrgencyIndicator level={followUp.priority} />
                <div>
                    <h4 className="text-sm font-bold text-on-surface leading-snug flex items-center gap-1.5">
                        {followUp.title}
                    </h4>
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-0.5">Keep the Momentum</p>
                    <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">{followUp.description}</p>
                    {followUp.dueDate && (
                        <p className="text-sm text-on-surface-variant mt-2 flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Due: {new Date(followUp.dueDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={onAction}
                className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// =============================================================================
// Main Component
// =============================================================================

export interface CEOAgentWidgetProps {
    hideWrapper?: boolean;
}

export const CEOAgentWidget: React.FC<CEOAgentWidgetProps> = ({ hideWrapper = false }) => {
    const [agentUpdate, setAgentUpdate] = useState<AgentUpdate | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('suggestions'); // Default to Ideas
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
    const [askAgentInput, setAskAgentInput] = useState('');

    // Load agent update
    useEffect(() => {
        loadAgentUpdate();
    }, []);

    const loadAgentUpdate = async () => {
        setIsLoading(true);
        try {
            const context = await ceoAgentService.collectContext('current-user');
            const update = await ceoAgentService.generateAgentUpdate(context, 'daily');
            setAgentUpdate(update);
        } catch (error) {
            console.error('Failed to load agent update:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        loadAgentUpdate();
    };

    const handleAskAgent = () => {
        if (askAgentInput.trim()) {
            console.log('Ask agent:', askAgentInput);
            setAskAgentInput('');
        }
    };

    const handleAction = (type: string, id: string) => {
        console.log('Action:', type, id);
    };

    const handleDismiss = (type: string, id: string) => {
        console.log('Dismiss:', type, id);
    };

    // Count items
    const counts = agentUpdate ? {
        all: agentUpdate.actionItems.length + agentUpdate.suggestions.length,
        actions: agentUpdate.actionItems.length,
        suggestions: agentUpdate.suggestions.length
    } : { all: 0, actions: 0, suggestions: 0 };

    const tabs: { id: TabType; label: string; count: number; icon: React.ReactNode }[] = [
        { id: 'all', label: 'All', count: counts.all, icon: <Zap className="w-4 h-4" /> },
        { id: 'actions', label: 'Actions', count: counts.actions, icon: <CheckCircle className="w-4 h-4" /> },
        { id: 'suggestions', label: 'Ideas', count: counts.suggestions, icon: <Lightbulb className="w-4 h-4" /> }
    ];

    const content = (
        <>
            {/* Ask Agent Input */}
            <div className="px-3 py-2 border-b border-outline-variant">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input
                            type="text"
                            value={askAgentInput}
                            onChange={(e) => setAskAgentInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskAgent()}
                            placeholder="Ask me anything..."
                            className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <button
                        onClick={handleAskAgent}
                        className="px-4 py-2 bg-primary text-on-primary text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Ask
                    </button>
                </div>
            </div>

            {/* Time Filter */}
            <div className="px-3 py-2 border-b border-outline-variant flex items-center justify-between">
                <div className="flex gap-1">
                    {(['today', 'week', 'month'] as TimeFilter[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${timeFilter === filter
                                ? 'bg-primary text-on-primary'
                                : 'text-on-surface-variant hover:bg-surface-container'
                                }`}
                        >
                            {filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month'}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-on-surface-variant">
                    Updated {new Date().toLocaleTimeString()}
                </span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-outline-variant">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                        {tab.count > 0 && (
                            <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-primary text-on-primary' : 'bg-surface-container'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content List */}
            <div className="p-3 max-h-96 overflow-y-auto space-y-3">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-2" />
                        <p className="text-sm text-on-surface-variant">Analyzing business context...</p>
                    </div>
                ) : !agentUpdate ? (
                    <div className="text-center py-8">
                        <Sparkles className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-2" />
                        <p className="text-sm text-on-surface-variant">No updates available</p>
                    </div>
                ) : (
                    <>
                        {/* Highlights & Wins */}
                        {(activeTab === 'all' || activeTab === 'suggestions') && (
                            <div className="space-y-2 mb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800/30">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <h4 className="text-[10px] font-bold text-green-800 dark:text-green-300 uppercase tracking-widest">Recent Milestone</h4>
                                </div>
                                <p className="text-sm text-green-900 dark:text-green-200">
                                    <span className="font-semibold">Great progress!</span> You and Patrick had an incredibly productive conversation last week that shifted the Q2 strategy perfectly.
                                </p>
                            </div>
                        )}

                        {/* Follow-ups */}
                        {(activeTab === 'all' || activeTab === 'actions') && agentUpdate.followUps.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Follow-ups</h4>
                                {agentUpdate.followUps.slice(0, 3).map((followUp) => (
                                    <FollowUpCard
                                        key={followUp.id}
                                        followUp={followUp}
                                        onAction={() => handleAction('followup', followUp.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        {(activeTab === 'all' || activeTab === 'actions') && agentUpdate.actionItems.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Upcoming Focus Areas</h4>
                                {agentUpdate.actionItems.slice(0, 3).map((action) => (
                                    <ActionCard
                                        key={action.id}
                                        action={action}
                                        onAction={(type) => handleAction(type, action.id)}
                                    />
                                ))}
                                <Link
                                    to="/action-plan"
                                    className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold text-primary uppercase tracking-wider hover:bg-primary/5 rounded-lg transition-colors"
                                >
                                    View Action Plan <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        )}

                        {/* Reminders */}
                        {(activeTab === 'all') && agentUpdate.reminders.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Reminders</h4>
                                {agentUpdate.reminders.map((reminder) => (
                                    <ReminderCard
                                        key={reminder.id}
                                        reminder={reminder}
                                        onDismiss={() => handleDismiss('reminder', reminder.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Suggestions */}
                        {(activeTab === 'all' || activeTab === 'suggestions') && agentUpdate.suggestions.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">AI Suggestions</h4>
                                {agentUpdate.suggestions.map((suggestion) => (
                                    <SuggestionCard
                                        key={suggestion.id}
                                        suggestion={suggestion}
                                        onAction={(type) => handleAction(type, suggestion.id)}
                                        onDismiss={() => handleDismiss('suggestion', suggestion.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Summary Footer */}
            {agentUpdate && agentUpdate.summaries.length > 0 && (
                <div className="px-3 py-2 bg-surface-container border-t border-outline-variant">
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">
                        {agentUpdate.summaries[0].title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {agentUpdate.summaries[0].highlights.map((highlight, i) => (
                            <span key={i} className="text-xs text-on-surface bg-surface-container-high rounded-full px-2.5 py-1 font-medium border border-outline-variant/30">
                                {highlight}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );

    if (hideWrapper) return content;

    return (
        <div className="bg-surface rounded-2xl shadow-lg border border-outline-variant overflow-hidden">
            {/* Header */}
            <div className="p-3 bg-gradient-to-r from-primary to-secondary">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Pinnacle AI</h3>
                            <p className="text-sm text-white/80 font-medium">Your proactive business assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
            {content}
        </div>
    );
};

export default CEOAgentWidget;
