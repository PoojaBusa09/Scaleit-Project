/**
 * Action Items Center
 * Central hub aggregating action items from all sources:
 * - Mentor Sessions (AI-generated from session summaries)
 * - SCALE Pillars (strategy tools)
 * - Self-added (manually created by user)
 * - CEO Agent (AI-recommended)
 *
 * Features:
 * - Filter by source, status, priority, SCALE category
 * - Sort by date, priority, due date
 * - Bulk actions  
 * - Quick-complete with celebration feedback
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckSquare, Circle, CheckCircle2, Clock, Calendar,
    Filter, Search, ChevronDown, ChevronUp, ArrowLeft,
    Sparkles, User, Video, Target, BookOpen,
    AlertTriangle, Star, MoreHorizontal, X, Plus,
    ArrowUpDown, ExternalLink, Tag, Layers
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

type ActionSource = 'session' | 'scale_pillar' | 'self' | 'ceo_agent' | 'mentor';
type ActionPriority = 'high' | 'medium' | 'low';
type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'dismissed';
type ScaleCategory = 'S' | 'C' | 'A' | 'L' | 'E';

interface ActionItem {
    id: string;
    text: string;
    source: ActionSource;
    sourceLabel: string;       // e.g. "Strategy Session – Jan 15" or "Gap Analysis Tool"
    sourceLink?: string;       // Link to source page
    status: ActionStatus;
    priority: ActionPriority;
    scaleCategory?: ScaleCategory;
    createdAt: string;
    dueDate?: string;
    completedAt?: string;
    assignee?: string;
    notes?: string;
    tags?: string[];
}

// =============================================================================
// Mock Data
// =============================================================================

const MOCK_ACTION_ITEMS: ActionItem[] = [
    // From Sessions
    {
        id: 'act-1', text: 'Finalize product launch plan by next Friday',
        source: 'session', sourceLabel: 'Strategy Session – Feb 10',
        sourceLink: '/sessions/session-1', status: 'pending', priority: 'high',
        scaleCategory: 'S', createdAt: '2026-02-10T14:00:00Z',
        dueDate: '2026-02-21T00:00:00Z', tags: ['launch', 'product']
    },
    {
        id: 'act-2', text: 'Get 3 CRM proposals for comparison',
        source: 'session', sourceLabel: 'Strategy Session – Feb 10',
        sourceLink: '/sessions/session-1', status: 'in_progress', priority: 'high',
        scaleCategory: 'C', createdAt: '2026-02-10T14:00:00Z',
        dueDate: '2026-02-28T00:00:00Z', tags: ['CRM', 'vendor']
    },
    {
        id: 'act-3', text: 'Review Q4 hiring budget with CFO',
        source: 'session', sourceLabel: 'Coaching Session – Feb 5',
        sourceLink: '/sessions/session-2', status: 'pending', priority: 'medium',
        scaleCategory: 'L', createdAt: '2026-02-05T10:00:00Z',
        dueDate: '2026-02-20T00:00:00Z', tags: ['hiring', 'budget']
    },
    {
        id: 'act-4', text: 'Document onboarding process for new hires',
        source: 'session', sourceLabel: 'Accountability Session – Jan 28',
        sourceLink: '/sessions/session-3', status: 'completed', priority: 'medium',
        scaleCategory: 'A', createdAt: '2026-01-28T09:00:00Z',
        completedAt: '2026-02-12T15:30:00Z', tags: ['HR', 'process']
    },
    // From SCALE Pillars
    {
        id: 'act-5', text: 'Complete Gap Analysis for sales pipeline',
        source: 'scale_pillar', sourceLabel: 'Gap Analysis Tool',
        sourceLink: '/gap-analysis', status: 'pending', priority: 'high',
        scaleCategory: 'S', createdAt: '2026-02-08T08:00:00Z',
        dueDate: '2026-02-25T00:00:00Z', tags: ['sales', 'pipeline']
    },
    {
        id: 'act-6', text: 'Update Perfect Client Decoder profile',
        source: 'scale_pillar', sourceLabel: 'Perfect Client Decoder',
        sourceLink: '/perfect-client-decoder', status: 'pending', priority: 'low',
        scaleCategory: 'C', createdAt: '2026-02-12T11:00:00Z',
        tags: ['marketing', 'ICP']
    },
    {
        id: 'act-7', text: 'Set up 90-day cash flow forecast',
        source: 'scale_pillar', sourceLabel: 'Cash Flow Tools',
        sourceLink: '/scaleit/cash', status: 'in_progress', priority: 'high',
        scaleCategory: 'C', createdAt: '2026-02-01T08:00:00Z',
        dueDate: '2026-02-18T00:00:00Z', tags: ['finance', 'forecast']
    },
    // Self-added
    {
        id: 'act-8', text: 'Prepare board meeting deck for Q1 review',
        source: 'self', sourceLabel: 'Added manually',
        status: 'pending', priority: 'high',
        createdAt: '2026-02-14T16:00:00Z',
        dueDate: '2026-02-19T00:00:00Z', tags: ['board', 'review']
    },
    {
        id: 'act-9', text: 'Follow up with vendor on pricing',
        source: 'self', sourceLabel: 'Added manually',
        status: 'completed', priority: 'medium',
        createdAt: '2026-02-13T09:00:00Z',
        completedAt: '2026-02-15T11:00:00Z', tags: ['vendor']
    },
    // CEO Agent 
    {
        id: 'act-10', text: 'Review and respond to 3 overdue team check-ins',
        source: 'ceo_agent', sourceLabel: 'CEO Agent Recommendation',
        status: 'pending', priority: 'high',
        scaleCategory: 'L', createdAt: '2026-02-16T07:00:00Z',
        dueDate: '2026-02-17T00:00:00Z', tags: ['team', 'check-in']
    },
    {
        id: 'act-11', text: 'Schedule strategic planning offsite for Q2',
        source: 'ceo_agent', sourceLabel: 'CEO Agent Recommendation',
        status: 'pending', priority: 'medium',
        scaleCategory: 'E', createdAt: '2026-02-15T07:00:00Z',
        dueDate: '2026-02-28T00:00:00Z', tags: ['planning', 'offsite']
    },
    // From Mentor
    {
        id: 'act-12', text: 'Read "Scaling Up" Chapter 7 before next session',
        source: 'mentor', sourceLabel: 'Assigned by Sarah Chen',
        status: 'pending', priority: 'low',
        scaleCategory: 'E', createdAt: '2026-02-10T14:00:00Z',
        dueDate: '2026-02-24T00:00:00Z', tags: ['reading', 'education']
    },
    {
        id: 'act-13', text: 'Complete leadership self-assessment worksheet',
        source: 'mentor', sourceLabel: 'Assigned by Sarah Chen',
        status: 'in_progress', priority: 'medium',
        scaleCategory: 'L', createdAt: '2026-02-10T14:00:00Z',
        dueDate: '2026-02-22T00:00:00Z', tags: ['leadership', 'assessment']
    },
];

// =============================================================================
// Constants
// =============================================================================

const SOURCE_CONFIG: Record<ActionSource, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    session: { label: 'Session', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
    scale_pillar: { label: 'SCALE Pillar', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    self: { label: 'Self-Added', icon: User, color: 'text-gray-600', bg: 'bg-gray-100' },
    ceo_agent: { label: 'CEO Agent', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
    mentor: { label: 'Mentor', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
};

const PRIORITY_CONFIG: Record<ActionPriority, { label: string; color: string; dot: string }> = {
    high: { label: 'High', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500' },
    medium: { label: 'Medium', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
    low: { label: 'Low', color: 'text-green-600 bg-green-50 border-green-200', dot: 'bg-green-500' },
};

const SCALE_CONFIG: Record<ScaleCategory, { label: string; full: string; color: string }> = {
    S: { label: 'S', full: 'Scalable', color: 'bg-red-100 text-red-700' },
    C: { label: 'C', full: 'Cash', color: 'bg-green-100 text-green-700' },
    A: { label: 'A', full: 'Alliance', color: 'bg-blue-100 text-blue-700' },
    L: { label: 'L', full: 'Leadership', color: 'bg-purple-100 text-purple-700' },
    E: { label: 'E', full: 'Execution', color: 'bg-yellow-100 text-yellow-800' },
};

const STATUS_CONFIG: Record<ActionStatus, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'text-gray-500' },
    in_progress: { label: 'In Progress', color: 'text-blue-600' },
    completed: { label: 'Completed', color: 'text-green-600' },
    dismissed: { label: 'Dismissed', color: 'text-gray-400' },
};

// =============================================================================
// Helpers
// =============================================================================

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDueLabel(dueDate?: string) {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, className: 'text-red-600 bg-red-50' };
    if (diff === 0) return { text: 'Due today', className: 'text-amber-600 bg-amber-50' };
    if (diff === 1) return { text: 'Due tomorrow', className: 'text-amber-600 bg-amber-50' };
    if (diff <= 7) return { text: `${diff}d left`, className: 'text-blue-600 bg-blue-50' };
    return { text: formatDate(dueDate), className: 'text-gray-500 bg-gray-50' };
}

// =============================================================================
// Main Component
// =============================================================================

const ActionItemsCenterPage: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [items, setItems] = useState<ActionItem[]>(MOCK_ACTION_ITEMS);
    const [searchQuery, setSearchQuery] = useState('');
    const [sourceFilter, setSourceFilter] = useState<ActionSource | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<ActionStatus | 'active' | 'all'>('active');
    const [priorityFilter, setPriorityFilter] = useState<ActionPriority | 'all'>('all');
    const [scaleFilter, setScaleFilter] = useState<ScaleCategory | 'all'>('all');
    const [sortBy, setSortBy] = useState<'created' | 'due' | 'priority'>('due');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [showFilters, setShowFilters] = useState(false);
    const [addingItem, setAddingItem] = useState(false);
    const [newItemText, setNewItemText] = useState('');
    const [newItemPriority, setNewItemPriority] = useState<ActionPriority>('medium');

    // Filtered & sorted items
    const filteredItems = useMemo(() => {
        let result = [...items];

        // Status filter
        if (statusFilter === 'active') {
            result = result.filter(i => i.status === 'pending' || i.status === 'in_progress');
        } else if (statusFilter !== 'all') {
            result = result.filter(i => i.status === statusFilter);
        }

        // Source filter
        if (sourceFilter !== 'all') {
            result = result.filter(i => i.source === sourceFilter);
        }

        // Priority filter
        if (priorityFilter !== 'all') {
            result = result.filter(i => i.priority === priorityFilter);
        }

        // SCALE filter
        if (scaleFilter !== 'all') {
            result = result.filter(i => i.scaleCategory === scaleFilter);
        }

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(i =>
                i.text.toLowerCase().includes(q) ||
                i.sourceLabel.toLowerCase().includes(q) ||
                (i.tags || []).some(t => t.toLowerCase().includes(q))
            );
        }

        // Sort
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        result.sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'due') {
                const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                cmp = aDate - bDate;
            } else if (sortBy === 'created') {
                cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (sortBy === 'priority') {
                cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [items, searchQuery, sourceFilter, statusFilter, priorityFilter, scaleFilter, sortBy, sortDir]);

    // Stats
    const stats = useMemo(() => {
        const active = items.filter(i => i.status === 'pending' || i.status === 'in_progress');
        const overdue = active.filter(i => {
            if (!i.dueDate) return false;
            return new Date(i.dueDate) < new Date();
        });
        const completed = items.filter(i => i.status === 'completed');
        const high = active.filter(i => i.priority === 'high');
        return { active: active.length, overdue: overdue.length, completed: completed.length, high: high.length };
    }, [items]);

    // Handlers
    const toggleStatus = (id: string) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            if (item.status === 'completed') {
                return { ...item, status: 'pending' as ActionStatus, completedAt: undefined };
            }
            return { ...item, status: 'completed' as ActionStatus, completedAt: new Date().toISOString() };
        }));
    };

    const handleAddItem = () => {
        if (!newItemText.trim()) return;
        const newItem: ActionItem = {
            id: `act-${Date.now()}`,
            text: newItemText.trim(),
            source: 'self',
            sourceLabel: 'Added manually',
            status: 'pending',
            priority: newItemPriority,
            createdAt: new Date().toISOString(),
            tags: [],
        };
        setItems(prev => [newItem, ...prev]);
        setNewItemText('');
        setAddingItem(false);
        setNewItemPriority('medium');
    };

    const handleDismiss = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'dismissed' as ActionStatus } : item
        ));
    };

    const handleSort = (key: 'created' | 'due' | 'priority') => {
        if (sortBy === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDir('asc');
        }
    };

    // Source breakdown for sidebar
    const sourceBreakdown = useMemo(() => {
        const active = items.filter(i => i.status !== 'dismissed');
        return (Object.keys(SOURCE_CONFIG) as ActionSource[]).map(src => ({
            source: src,
            count: active.filter(i => i.source === src).length,
            ...SOURCE_CONFIG[src],
        }));
    }, [items]);

    return (
        <div className="h-full flex flex-col bg-gray-50/50">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
                <div className="flex items-center gap-3 mb-1">
                    <button onClick={() => navigate('/')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-4 h-4 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Action Items Center</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            All your action items from sessions, SCALE tools, mentors, and more — in one place.
                        </p>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center gap-6 mt-4">
                    <button
                        onClick={() => setStatusFilter('active')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'active' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Circle className="w-4 h-4" />
                        <span>{stats.active} Active</span>
                    </button>
                    {stats.overdue > 0 && (
                        <button
                            onClick={() => { setStatusFilter('active'); setSortBy('due'); setSortDir('asc'); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            <span>{stats.overdue} Overdue</span>
                        </button>
                    )}
                    <button
                        onClick={() => setPriorityFilter(priorityFilter === 'high' ? 'all' : 'high')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${priorityFilter === 'high' ? 'bg-amber-50 text-amber-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Star className="w-4 h-4" />
                        <span>{stats.high} High Priority</span>
                    </button>
                    <button
                        onClick={() => setStatusFilter(statusFilter === 'completed' ? 'active' : 'completed')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'completed' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{stats.completed} Completed</span>
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto px-6 py-5">
                <div className="flex gap-6 max-w-[1400px] mx-auto">

                    {/* Left Sidebar — Sources */}
                    <div className="w-52 flex-shrink-0 space-y-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Sources</h3>
                        <button
                            onClick={() => setSourceFilter('all')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sourceFilter === 'all' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-white'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-gray-400" /> All Sources
                            </span>
                            <span className="text-xs text-gray-400">{items.filter(i => i.status !== 'dismissed').length}</span>
                        </button>
                        {sourceBreakdown.map(src => (
                            <button
                                key={src.source}
                                onClick={() => setSourceFilter(sourceFilter === src.source ? 'all' : src.source)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sourceFilter === src.source ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-white'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <src.icon className={`w-4 h-4 ${src.color}`} /> {src.label}
                                </span>
                                <span className="text-xs text-gray-400">{src.count}</span>
                            </button>
                        ))}

                        {/* SCALE Categories */}
                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">SCALE Category</h3>
                            {(Object.keys(SCALE_CONFIG) as ScaleCategory[]).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setScaleFilter(scaleFilter === cat ? 'all' : cat)}
                                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${scaleFilter === cat ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-600 hover:bg-white'}`}
                                >
                                    <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${SCALE_CONFIG[cat].color}`}>
                                        {cat}
                                    </span>
                                    {SCALE_CONFIG[cat].full}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search action items..."
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1 py-1">
                                {(['due', 'priority', 'created'] as const).map(key => (
                                    <button
                                        key={key}
                                        onClick={() => handleSort(key)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${sortBy === key ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {key === 'due' ? 'Due Date' : key === 'priority' ? 'Priority' : 'Created'}
                                        {sortBy === key && (
                                            sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setAddingItem(true)}
                                className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Add Item
                            </button>
                        </div>

                        {/* Add Item Form */}
                        {addingItem && (
                            <div className="bg-white border border-primary/30 rounded-xl p-4 mb-4 shadow-sm">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newItemText}
                                        onChange={(e) => setNewItemText(e.target.value)}
                                        placeholder="What needs to be done?"
                                        className="flex-1 text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                    />
                                    <select
                                        value={newItemPriority}
                                        onChange={(e) => setNewItemPriority(e.target.value as ActionPriority)}
                                        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="high">High Priority</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                    <button onClick={handleAddItem} className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                                        Add
                                    </button>
                                    <button onClick={() => { setAddingItem(false); setNewItemText(''); }} className="px-3 text-gray-400 hover:text-gray-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="space-y-2">
                            {filteredItems.map(item => {
                                const srcConfig = SOURCE_CONFIG[item.source];
                                const SrcIcon = srcConfig.icon;
                                const prioConfig = PRIORITY_CONFIG[item.priority];
                                const dueLabel = getDueLabel(item.dueDate);
                                const isComplete = item.status === 'completed';

                                return (
                                    <div
                                        key={item.id}
                                        className={`bg-white rounded-xl border transition-all hover:shadow-md group ${isComplete ? 'border-gray-100 opacity-70' : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4 p-4">
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleStatus(item.id)}
                                                className="mt-0.5 flex-shrink-0"
                                            >
                                                {isComplete ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-300 hover:text-primary transition-colors" />
                                                )}
                                            </button>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className={`text-sm font-medium leading-snug ${isComplete ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                                        {item.text}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {/* Priority badge */}
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${prioConfig.color}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${prioConfig.dot}`} />
                                                            {prioConfig.label}
                                                        </span>
                                                        {/* SCALE badge */}
                                                        {item.scaleCategory && (
                                                            <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${SCALE_CONFIG[item.scaleCategory].color}`}>
                                                                {item.scaleCategory}
                                                            </span>
                                                        )}
                                                        {/* Dismiss */}
                                                        {!isComplete && (
                                                            <button
                                                                onClick={() => handleDismiss(item.id)}
                                                                className="p-1 hover:bg-gray-100 rounded text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                title="Dismiss"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Meta row */}
                                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                    {/* Source */}
                                                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${srcConfig.bg} ${srcConfig.color}`}>
                                                        <SrcIcon className="w-3 h-3" />
                                                        {item.sourceLabel}
                                                    </span>

                                                    {/* Due date */}
                                                    {dueLabel && !isComplete && (
                                                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${dueLabel.className}`}>
                                                            <Clock className="w-3 h-3" />
                                                            {dueLabel.text}
                                                        </span>
                                                    )}

                                                    {/* Created */}
                                                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(item.createdAt)}
                                                    </span>

                                                    {/* Completed date */}
                                                    {isComplete && item.completedAt && (
                                                        <span className="text-[11px] text-green-500 flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Completed {formatDate(item.completedAt)}
                                                        </span>
                                                    )}

                                                    {/* Tags */}
                                                    {item.tags && item.tags.length > 0 && (
                                                        <div className="flex items-center gap-1 ml-auto">
                                                            {item.tags.map(tag => (
                                                                <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Source link */}
                                                    {item.sourceLink && (
                                                        <button
                                                            onClick={() => navigate(item.sourceLink!)}
                                                            className="text-[11px] text-primary hover:underline flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <ExternalLink className="w-3 h-3" /> View Source
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredItems.length === 0 && (
                                <div className="text-center py-16">
                                    <CheckSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No action items match your filters</p>
                                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new item</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionItemsCenterPage;
