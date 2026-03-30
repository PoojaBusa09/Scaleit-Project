
import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MOCK_TASKS, MOCK_SESSIONS, MOCK_IDEAS } from '../../../constants.ts';
import { Task, Idea, TaskQuarter, ScaleITCategory, Commitment, MileStep } from '../../../types.ts';
import { suggestIdeaTags } from '../../../services/geminiService';
import { TrophyIcon, SparklesIcon, LightbulbIcon, CheckSquareIcon, SearchIcon, CalendarPlusIcon, ClockIcon, FileTextIcon, MoreVerticalIcon, PlusIcon, PieChartIcon, Trash2Icon, AlertTriangleIcon, ChevronRightIcon, CalendarIcon, NotebookPenIcon, ListIcon, LayoutGridIcon, UserIcon, SettingsIcon, ClipboardCheckIcon, EditIcon } from '../../../components/icons.tsx';
import AITaskReviewModal from '../components/AITaskReviewModal';
import ActionInbox from '../components/ActionInbox';
import { mockDataService } from '../../../services/mockDataService';

// --- Constants ---

const COLUMN_TITLES: { [key in TaskQuarter]: string } = {
    this: 'This Quarter',
    next: 'Next Quarter',
    backlog: 'Backlog'
};

const CATEGORY_COLORS: { [key in ScaleITCategory]: string } = {
    S: 'bg-red-100 text-red-800',
    C: 'bg-green-100 text-green-800',
    A: 'bg-blue-100 text-blue-800',
    L: 'bg-purple-100 text-purple-800',
    E: 'bg-yellow-100 text-yellow-800',
};

/**
 * Modal to confirm task deletion.
 */
const DeleteConfirmationModal = ({ task, onClose, onConfirm }: { task: Task | null, onClose: () => void, onConfirm: () => void }) => {
    if (!task) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-modal="true" aria-labelledby="delete-task-title">
            <div className="bg-surface rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in-up-fast border border-outline/10" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center mb-4 text-error">
                    <AlertTriangleIcon className="h-6 w-6 mr-2" aria-hidden="true" />
                    <h3 id="delete-task-title" className="text-title-lg font-bold">Delete Task</h3>
                </div>
                <p className="text-body-md text-on-surface-variant mb-6">
                    Are you sure you want to permanently delete <span className="font-semibold text-on-surface">"{task.text}"</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-label-lg font-medium text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 text-label-lg font-medium bg-error text-on-error hover:bg-error/90 rounded-full transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Main page for the Action Plan feature.
 * Implements a 3-level hierarchy:
 * 1. Commitments (Quarterly "Big Rocks")
 * 2. Mile Steps (Milestones to achieve Commitments)
 * 3. Mini Feats (Actionable Tasks)
 * 
 * Also handles Idea capturing and AI task suggestions.
 */
const ActionPlan: React.FC = () => {
    // Selection State
    const [selectedPeriod, setSelectedPeriod] = useState<{ year: number, quarter: number } | null>(null);

    const [tasks, setTasks] = useState<Task[]>([]);

    // Load tasks from service
    useEffect(() => {
        setTasks(mockDataService.getTasks());
    }, []);

    // State for Commitments
    const [commitments, setCommitments] = useState<Commitment[]>([
        { id: 1, title: 'Sales Goals', quarter: 4, year: 2025, status: 'Execution', result: 'Exceed Annual Quota' },
        { id: 2, title: 'New Office Building', quarter: 4, year: 2025, status: 'Planning', result: 'Blueprints Approved' },
        { id: 3, title: 'Hiring Needs Across Companies', quarter: 4, year: 2025, status: 'Execution', result: 'Sufficient Staff for all Project and Initiatives' }
    ]);
    const [activeCommitmentId, setActiveCommitmentId] = useState<number>(3); // Default to Hiring as per screenshot (or 1)

    // State for Mile Steps
    const [mileSteps, setMileSteps] = useState<MileStep[]>([
        { id: 101, title: 'Q4 Sales Push', commitmentId: 1, order: 1 },
        { id: 102, title: 'Client Renewals', commitmentId: 1, order: 2 },
        { id: 201, title: 'Site Selection', commitmentId: 2, order: 1 },
        { id: 202, title: 'Architectural Review', commitmentId: 2, order: 2 },
        { id: 301, title: 'Open Positions', commitmentId: 3, order: 1 },
        { id: 302, title: 'Mile Step 2', commitmentId: 3, order: 2 },
        { id: 303, title: 'Mile Step 3', commitmentId: 3, order: 3 },
    ]);
    const [activeMileStepId, setActiveMileStepId] = useState<number | null>(301);

    // Update active Mile Step when Commitment changes
    useEffect(() => {
        const firstMileStep = mileSteps.find(ms => ms.commitmentId === activeCommitmentId);
        setActiveMileStepId(firstMileStep ? firstMileStep.id : null);
    }, [activeCommitmentId, mileSteps]);

    // Filter tasks by active Mile Step
    const filteredTasks = useMemo(() => {
        if (!activeMileStepId) return [];
        // Demo: link existing tasks to the first mile step if undefined, or check mock data logic
        // For now, we'll just show all tasks if no specific id match, or ensure tasks have ids.
        // Let's filter by mileStepId if present, else fallback for demo
        return tasks.filter(t => t.mileStepId === activeMileStepId || (!t.mileStepId && activeMileStepId === 301));
    }, [tasks, activeMileStepId]);

    const [columns, setColumns] = useState<{ [key in TaskQuarter]: Task[] }>({
        this: [],
        next: [],
        backlog: []
    });

    useEffect(() => {
        setColumns({
            this: filteredTasks.filter(t => t.quarter === 'this'),
            next: filteredTasks.filter(t => t.quarter === 'next'),
            backlog: filteredTasks.filter(t => t.quarter === 'backlog'),
        });
    }, [filteredTasks]);

    const handleAddCommitment = () => {
        const newId = Date.now();
        const newCommitment: Commitment = {
            id: newId,
            title: 'New Commitment',
            quarter: selectedPeriod?.quarter || 1,
            year: selectedPeriod?.year || new Date().getFullYear()
        };
        setCommitments([...commitments, newCommitment]);
        setActiveCommitmentId(newId);
    };

    const handleUpdateCommitmentTitle = (id: number, title: string) => {
        setCommitments(commitments.map(c => c.id === id ? { ...c, title } : c));
    };

    const handleEditMileStep = (id: number) => {
        const step = mileSteps.find(ms => ms.id === id);
        if (!step) return;
        // TODO: Replace with custom modal
        const newTitle = window.prompt("Enter new title for Mile Step:", step.title);
        if (newTitle) {
            setMileSteps(mileSteps.map(ms => ms.id === id ? { ...ms, title: newTitle } : ms));
        }
    };

    const handleDeleteMileStep = (id: number) => {
        // TODO: Replace with custom modal
        if (window.confirm("Are you sure you want to delete this Mile Step? All associated Mini Feats will be deleted.")) {
            // Filter out tasks associated with this mile step
            setTasks(tasks.filter(t => t.mileStepId !== id));
            setMileSteps(mileSteps.filter(ms => ms.id !== id));
            if (activeMileStepId === id) {
                setActiveMileStepId(null);
            }
        }
    };

    const handleEditTask = (task: Task) => {
        // TODO: Replace with custom modal or inline edit
        const newText = window.prompt("Edit Mini Feat:", task.text);
        if (newText !== null && newText.trim() !== "") {
            setTasks(tasks.map(t => t.id === task.id ? { ...t, text: newText } : t));
        }
    };



    const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskCategory, setNewTaskCategory] = useState<ScaleITCategory>('E'); // Default category
    const [newIdea, setNewIdea] = useState('');
    const [ideaSearch, setIdeaSearch] = useState('');
    const [taggingIdeaId, setTaggingIdeaId] = useState<number | null>(null);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'tasks' | 'ideas'>('tasks');
    const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
    const [filterCategory, setFilterCategory] = useState<ScaleITCategory | 'ALL'>('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const dragItem = React.useRef<Task | null>(null);
    const dragOverColumn = React.useRef<TaskQuarter | null>(null);

    // Calculate distribution stats
    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = { S: 0, C: 0, A: 0, L: 0, E: 0 };
        tasks.filter(t => !t.completed && t.quarter === 'this').forEach(t => {
            if (t.category) stats[t.category] = (stats[t.category] || 0) + 1;
        });
        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        return { stats, total };
    }, [tasks]);

    /**
     * Callbak for AITaskReviewModal.
     * Integrates selected AI suggestions into the current task list.
     * Default category is 'E' (Execution) and quarter is 'this'.
     */
    const handleAddTasksFromAI = (newTasks: string[]) => {
        const tasksToAdd: Task[] = newTasks.map(text => ({
            id: Date.now() + Math.random(),
            text,
            completed: false,
            isWin: false,
            quarter: 'this',
            category: 'E',
            sourceSessionId: MOCK_SESSIONS.find(s => s.transcript)?.id
        }));
        setTasks([...tasks, ...tasksToAdd]);
    };

    /**
     * Adds a manually typed task (Mini Feat).
     * Enforces that a Mile Step must be active to contextually link the task.
     */
    const handleManualAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        if (!activeMileStepId) {
            console.log("Please create or select a Mile Step first."); // TODO: Implement Toast notification
            // window.alert("Please create or select a Mile Step first.");
            return;
        }
        const newTask: Task = {
            id: Date.now(),
            text: newTaskText,
            completed: false,
            isWin: false,
            quarter: 'this',
            category: newTaskCategory,
            commitmentId: activeCommitmentId,
            mileStepId: activeMileStepId,
            dueDate: '04/15/2025'
        };
        setTasks([newTask, ...tasks]);
        setNewTaskText('');
    };

    /**
     * Handles dropping a task into a different quarter column (Kanban board only).
     */
    const handleDrop = () => {
        if (dragItem.current && dragOverColumn.current) {
            setTasks(prevTasks => prevTasks.map(task =>
                task.id === dragItem.current!.id
                    ? { ...task, quarter: dragOverColumn.current! }
                    : task
            ));
        }
        dragItem.current = null;
        dragOverColumn.current = null;
    };


    const toggleTask = (id: number) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    const markAsWin = (id: number) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, isWin: true, completed: true, winDate: new Date().toLocaleDateString() } : task));
    };

    const updateTaskCategory = (id: number, category: ScaleITCategory) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, category } : task));
    };

    const updateTaskTime = (id: number, timeSpent: number) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, timeSpent } : task));
    };

    const updateTaskNotes = (id: number, notes: string) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, notes } : task));
    };

    const handleDeleteClick = (task: Task) => {
        setTaskToDelete(task);
    };

    const confirmDeleteTask = () => {
        if (taskToDelete) {
            setTasks(tasks.filter(t => t.id !== taskToDelete.id));
            setTaskToDelete(null);
        }
    };

    const handleAddIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdea.trim()) return;
        const newIdeaObject: Idea = {
            id: Date.now(),
            text: newIdea,
            tags: [],
            createdAt: new Date().toLocaleDateString()
        };
        setIdeas([newIdeaObject, ...ideas]);
        setNewIdea('');
    };

    const handleGetTagSuggestions = async (idea: Idea) => {
        setTaggingIdeaId(idea.id);
        const tags = await suggestIdeaTags(idea.text);
        setSuggestedTags(tags);
    };

    const addTagToIdea = (ideaId: number, tag: string) => {
        setIdeas(ideas.map(idea => {
            if (idea.id === ideaId && !idea.tags.includes(tag)) {
                return { ...idea, tags: [...idea.tags, tag] };
            }
            return idea;
        }));
    };

    const filteredIdeas = ideas.filter(idea =>
        idea.text.toLowerCase().includes(ideaSearch.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(ideaSearch.toLowerCase()))
    );

    // --- Subcomponents ---

    interface TaskCardProps {
        task: Task;
        toggleTask: (id: number) => void;
        handleDeleteClick: (task: Task) => void;
        setExpandedTaskId: (id: number | null) => void;
        expandedTaskId: number | null;
        dragItem: React.MutableRefObject<Task | null>;
        updateTaskCategory: (id: number, category: ScaleITCategory) => void;
        updateTaskTime: (id: number, timeSpent: number) => void;
        updateTaskNotes: (id: number, notes: string) => void;
        markAsWin: (id: number) => void;
    }

    /**
     * Renders a single task card with drag handle and interactions.
     */
    const TaskCard: React.FC<TaskCardProps> = ({
        task,
        toggleTask,
        handleDeleteClick,
        setExpandedTaskId,
        expandedTaskId,
        dragItem,
        updateTaskCategory,
        updateTaskTime,
        updateTaskNotes,
        markAsWin
    }) => (
        <div
            draggable
            onDragStart={() => (dragItem.current = task)}
            className="p-3 border-b border-surface-variant last:border-b-0 bg-surface hover:bg-surface-variant/50 transition-colors rounded-md shadow-sm mb-2 group"
            role="listitem"
            aria-label={`Task: ${task.text}`}
        >
            <div className="flex items-center justify-between cursor-grab">
                <div className="flex items-center flex-grow">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="h-5 w-5 text-primary rounded border-outline focus:ring-primary mt-0.5"
                        aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
                    />
                    <div className="ml-3 flex flex-col">
                        <span className={`text-body-md transition-colors ${task.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                            {task.text}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            {task.category && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[task.category]}`}>
                                    {task.category}
                                </span>
                            )}
                            {task.timeSpent ? (
                                <span className="text-[10px] text-on-surface-variant flex items-center bg-surface-variant/50 px-1.5 py-0.5 rounded" title="Time Spent">
                                    <ClockIcon className="h-3 w-3 mr-1" aria-hidden="true" /> {task.timeSpent}m
                                </span>
                            ) : null}
                            {task.notes && (
                                <span className="text-[10px] text-on-surface-variant flex items-center bg-surface-variant/50 px-1.5 py-0.5 rounded" title="Has Notes">
                                    <FileTextIcon className="h-3 w-3 mr-1" aria-hidden="true" /> Note
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleDeleteClick(task)}
                        className="p-1.5 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant transition-colors"
                        title="Delete Task"
                        aria-label="Delete Task"
                    >
                        <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        className="p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
                        title={expandedTaskId === task.id ? "Collapse Details" : "Expand Details"}
                        aria-expanded={expandedTaskId === task.id}
                    >
                        <MoreVerticalIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* Expanded Details / Editing */}
            {expandedTaskId === task.id && (
                <div className="mt-3 pt-3 border-t border-outline/10 text-sm space-y-3 animate-fade-in-up-fast">
                    {/* Activity Categorization */}
                    <div>
                        <label className="block text-xs font-medium text-on-surface-variant mb-1">Activity Category (SCALEit)</label>
                        <div className="flex gap-2" role="group" aria-label="Select Category">
                            {(['S', 'C', 'A', 'L', 'E'] as ScaleITCategory[]).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => updateTaskCategory(task.id, cat)}
                                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${task.category === cat ? CATEGORY_COLORS[cat] + ' ring-2 ring-offset-1 ring-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80'}`}
                                    aria-label={`Set category to ${cat}`}
                                    aria-pressed={task.category === cat}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Tracking */}
                    <div>
                        <label className="block text-xs font-medium text-on-surface-variant mb-1">Time Spent (minutes)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={task.timeSpent || ''}
                                onChange={(e) => updateTaskTime(task.id, parseInt(e.target.value) || 0)}
                                className="w-20 p-1 text-sm border border-outline rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="0"
                                aria-label="Time spent in minutes"
                            />
                            <span className="text-xs text-on-surface-variant">min</span>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-on-surface-variant mb-1">Notes & Progress</label>
                        <textarea
                            value={task.notes || ''}
                            onChange={(e) => updateTaskNotes(task.id, e.target.value)}
                            rows={2}
                            className="w-full p-2 text-sm border border-outline rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Add details about this task..."
                            aria-label="Task notes"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        {task.dueDate && (
                            <button
                                onClick={() => {
                                    console.log('Task synced to calendar!'); // TODO: Implement toast notification
                                }}
                                className="p-1.5 rounded-full hover:bg-surface-variant text-secondary flex items-center text-xs bg-secondary-container/30 px-3 transition-colors"
                            >
                                <CalendarPlusIcon className="h-3 w-3 mr-1" aria-hidden="true" /> Sync Calendar
                            </button>
                        )}
                        {task.completed && !task.isWin && (
                            <button onClick={() => markAsWin(task.id)} className="flex items-center text-xs text-tertiary-container/90 hover:text-tertiary-container font-semibold px-3 py-1.5 rounded-full bg-tertiary-container/30 hover:bg-tertiary-container/40 transition-all">
                                <TrophyIcon className="h-3 w-3 mr-1.5" />
                                Mark as Win
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    // Initial Year/Quarter Selection View
    if (!selectedPeriod) {
        const years = [2023, 2024, 2025, 2026, 2027];
        const quarters = [1, 2, 3, 4];
        const currentYear = new Date().getFullYear();
        const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);

        return (
            <div className="min-h-full pb-12 animate-fade-in">
                <PageHeader
                    title="Strategic Planning Roadmap"
                    description="Select a time period to manage your strategic objectives and action items."
                />

                <div className="max-w-7xl mx-auto">
                    {/* Header Controls */}
                    <div className="flex justify-end mb-8">
                        <button className="flex items-center bg-primary text-on-primary font-bold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg hover:bg-primary/90 transition-all transform hover:-translate-y-0.5">
                            <PieChartIcon className="h-5 w-5 mr-2" />
                            Generate Progress Report
                        </button>
                    </div>

                    {/* Timeline Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {years.map(year => {
                            const isPastYear = year < currentYear;
                            const isCurrentYear = year === currentYear;

                            return (
                                <div key={year} className={`flex flex-col bg-surface rounded-2xl shadow-sm border ${isCurrentYear ? 'border-primary/30 ring-4 ring-primary/5' : 'border-outline/10'} overflow-hidden transition-all hover:shadow-md h-full`}>
                                    {/* Year Header */}
                                    <div className={`py-4 px-5 border-b border-outline/10 ${isCurrentYear ? 'bg-primary/5' : 'bg-surface'}`}>
                                        <div className="flex items-center justify-between">
                                            <h3 className={`text-3xl font-serif font-bold ${isCurrentYear ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                {year}
                                            </h3>
                                            {isCurrentYear && (
                                                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary rounded-full">Current</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quarters List */}
                                    <div className="p-4 space-y-3 flex-1">
                                        {quarters.map(q => {
                                            const isPastQuarter = isPastYear || (isCurrentYear && q < currentQuarter);
                                            const isCurrentQuarter = isCurrentYear && q === currentQuarter;

                                            // Determine names for visual flair
                                            const qNames = ["", "Q1: Jan-Mar", "Q2: Apr-Jun", "Q3: Jul-Sep", "Q4: Oct-Dec"];

                                            return (
                                                <button
                                                    key={`${year}-q${q}`}
                                                    onClick={() => setSelectedPeriod({ year, quarter: q })}
                                                    className={`w-full group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                                                        ${isCurrentQuarter
                                                            ? 'bg-primary text-on-primary border-primary shadow-md hover:bg-primary/90'
                                                            : 'bg-surface hover:bg-surface-variant/50 border-outline/10 hover:border-primary/30 text-on-surface'
                                                        }
                                                        ${isPastQuarter ? 'opacity-60 hover:opacity-100' : ''}
                                                    `}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xs font-bold transition-colors
                                                            ${isCurrentQuarter
                                                                ? 'bg-white/20 text-white'
                                                                : 'bg-surface-variant text-on-surface-variant group-hover:bg-white group-hover:text-primary'
                                                            }
                                                        `}>
                                                            Q{q}
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <span className={`text-sm font-bold ${isCurrentQuarter ? 'text-white' : 'text-on-surface group-hover:text-primary'} transition-colors`}>
                                                                {qNames[q].split(':')[0]}
                                                            </span>
                                                            <span className={`text-[10px] ${isCurrentQuarter ? 'text-white/80' : 'text-on-surface-variant'} transition-colors`}>
                                                                {qNames[q].split(':')[1]}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <ChevronRightIcon className={`h-4 w-4 ${isCurrentQuarter ? 'text-white' : 'text-outline group-hover:text-primary'} transition-colors`} />
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Footer / Status Summary (Mock) */}
                                    <div className="px-5 py-3 bg-surface-variant/20 border-t border-outline/10">
                                        <div className="flex items-center justify-between text-xs text-on-surface-variant">
                                            <span className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-1.5 ${isPastYear ? 'bg-secondary' : 'bg-outline'}`}></div>
                                                {isPastYear ? 'Completed' : isCurrentYear ? 'In Progress' : 'Planned'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Detail View (Existing Action Plan)
    return (
        <div>
            <PageHeader
                title="Action Plan"
                description={`Manage your tasks and ideas for Q${selectedPeriod.quarter} ${selectedPeriod.year}.`}
                onBack={() => setSelectedPeriod(null)}
                backLabel="Back to Quarter Selection"
            />
            <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">

                {activeTab === 'tasks' && (
                    <div className="animate-fade-in-up-fast">

                        {/* AI Action Inbox */}
                        <ActionInbox
                            tasks={tasks}
                            onAccept={(task) => {
                                const updated = { ...task, status: 'accepted' } as Task;
                                mockDataService.updateTask(updated);
                                setTasks(mockDataService.getTasks());
                            }}
                            onDismiss={(task) => {
                                const updated = { ...task, status: 'dismissed' } as Task;
                                mockDataService.updateTask(updated);
                                setTasks(mockDataService.getTasks());
                            }}
                        />

                        {/* Level 1: Commitments */}
                        <div className="mb-0">
                            <div className="flex items-center gap-2 overflow-x-auto pb-0 mb-4 border-b border-outline/10">
                                {commitments.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setActiveCommitmentId(c.id)}
                                        className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap border-b-2 ${activeCommitmentId === c.id ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'}`}
                                    >
                                        {c.title}
                                    </button>
                                ))}
                                <button onClick={() => console.log("Add Commitment")} className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors" title="Add Commitment">
                                    <PlusIcon className="h-4 w-4" />
                                </button>
                                <button className="ml-auto p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors">
                                    <SettingsIcon className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Level 1 Details: Commitment Name & Result */}
                            <div className="mb-6 p-4 bg-surface rounded-xl border border-outline/10 shadow-sm">
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-4">
                                        <div className="flex-grow">
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Commitment Name</label>
                                            <input
                                                type="text"
                                                value={commitments.find(c => c.id === activeCommitmentId)?.title || ''}
                                                onChange={(e) => handleUpdateCommitmentTitle(activeCommitmentId, e.target.value)}
                                                className="w-full text-base font-medium text-on-surface bg-white border border-outline/30 rounded-md px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="w-48">
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pillar</label>
                                            <select className="w-full text-sm bg-white border border-outline/30 rounded-md px-3 py-2.5 focus:border-primary focus:outline-none shadow-sm cursor-pointer font-bold text-primary">
                                                <option value="S">S - Sales</option>
                                                <option value="C">C - Customer</option>
                                                <option value="A">A - Admin</option>
                                                <option value="L">L - Leadership</option>
                                                <option value="E">E - Execution</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-on-surface-variant pt-2 border-t border-dashed border-outline/20">
                                        <div className="font-medium opacity-80">
                                            Quarter {selectedPeriod.quarter}: {selectedPeriod.quarter === 4 ? 'Oct 01 thru Dec 31' : 'Jan 01 thru Mar 31'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">Result:</span>
                                            <input
                                                type="text"
                                                value={commitments.find(c => c.id === activeCommitmentId)?.result || ''}
                                                className="bg-transparent border-b border-outline/20 focus:border-primary focus:outline-none px-1 text-on-surface font-medium min-w-[300px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Level 2: Mile Steps */}
                            <div className="flex max-w-full overflow-x-auto mb-0 border-b border-outline/10 h-[45px]">
                                {mileSteps.filter(ms => ms.commitmentId === activeCommitmentId).map(ms => (
                                    <div
                                        key={ms.id}
                                        className={`group relative flex items-center px-6 py-2.5 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap border-x border-t -mb-px cursor-pointer ${activeMileStepId === ms.id ? 'bg-[#0c2340] text-white border-[#0c2340] z-10' : 'bg-surface text-on-surface-variant border-transparent hover:bg-surface-variant top-[1px]'}`}
                                        onClick={() => setActiveMileStepId(ms.id)}
                                    >
                                        <span className="mr-8">{ms.title}</span>
                                        <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 ${activeMileStepId === ms.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEditMileStep(ms.id); }}
                                                className={`p-1 rounded hover:bg-white/20 transition-colors ${activeMileStepId === ms.id ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'}`}
                                                title="Edit Mile Step"
                                            >
                                                <EditIcon className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteMileStep(ms.id); }}
                                                className={`p-1 rounded hover:bg-white/20 transition-colors ${activeMileStepId === ms.id ? 'text-white' : 'text-on-surface-variant hover:text-error'}`}
                                                title="Delete Mile Step"
                                            >
                                                <Trash2Icon className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => console.log("Add Mile Step")} className="ml-2 p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors self-center flex-shrink-0" title="Add Mile Step">
                                    <PlusIcon className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Level 2 Details + Action Bar */}
                            <div className="bg-surface p-4 rounded-b-xl rounded-tr-xl border border-outline/10 shadow-sm mb-6 mt-0">
                                <div className="flex justify-between items-end gap-4 mb-4">
                                    <div className="flex-grow">
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Mile Step Name</label>
                                        <input
                                            type="text"
                                            value={mileSteps.find(ms => ms.id === activeMileStepId)?.title || ''}
                                            className="w-full text-base font-medium !text-white bg-[#0c2340] border border-[#0c2340] rounded-md px-3 py-2 focus:border-white/50 focus:ring-1 focus:ring-white/50 focus:outline-none transition-all shadow-sm"
                                            readOnly
                                        />
                                    </div>
                                    <button onClick={() => document.getElementById('add-mini-feat-input')?.focus()} className="bg-[#0c2340] text-white px-5 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all active:scale-95 text-sm font-bold flex items-center whitespace-nowrap h-[42px]">
                                        <PlusIcon className="h-4 w-4 mr-2" />
                                        Add Mini Feat
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <div className="overflow-hidden rounded-xl border border-outline/20 bg-surface shadow-sm animate-fade-in">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#0c2340] text-white text-xs uppercase tracking-wider border-b border-outline/10">
                                            <th className="p-4 font-bold w-12 text-center text-white">#</th>
                                            <th className="p-4 font-bold text-white">Mini Feat (Small Step)</th>
                                            <th className="p-4 font-bold text-white">Owner</th>
                                            <th className="p-4 font-bold text-white">Deadline</th>
                                            <th className="p-4 font-bold text-white">Status</th>
                                            <th className="p-4 font-bold text-white">Notes</th>
                                            <th className="p-4 font-bold text-right text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline/10 text-sm">
                                        {/* Inline Add Row */}
                                        <tr className="bg-surface-variant/5">
                                            <td className="p-4 text-center text-on-surface-variant font-bold">+</td>
                                            <td className="p-4" colSpan={6}>
                                                <form onSubmit={handleManualAddTask} className="flex w-full">
                                                    <input
                                                        id="add-mini-feat-input"
                                                        type="text"
                                                        value={newTaskText}
                                                        onChange={e => setNewTaskText(e.target.value)}
                                                        placeholder="Type new mini feat and press Enter..."
                                                        className="w-full bg-transparent border-none focus:ring-0 placeholder-on-surface-variant/50 text-on-surface focus:outline-none"
                                                    />
                                                </form>
                                            </td>
                                        </tr>

                                        {filteredTasks
                                            .filter(t => filterCategory === 'ALL' || t.category === filterCategory)
                                            .map((task, index) => (
                                                <tr key={task.id} className="hover:bg-surface-variant/20 transition-colors group">
                                                    <td className="p-4 text-center text-on-surface-variant">{index + 1}</td>
                                                    <td className="p-4 font-medium text-on-surface">{task.text}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                                <UserIcon className="h-3 w-3" />
                                                            </div>
                                                            <span className="text-on-surface-variant text-xs">{task.owner || 'Me'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-on-surface-variant">
                                                        {task.dueDate || '04/15/2025'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${task.completed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${task.completed ? 'bg-green-500' : 'bg-sky-500'}`}></span>
                                                            {task.completed ? 'Completed' : 'In Progress'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-on-surface-variant max-w-xs truncate">
                                                        {task.notes || '-'}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEditTask(task)}
                                                                className="p-1.5 rounded-md hover:bg-surface-variant text-on-surface-variant transition-colors"
                                                                title="Edit"
                                                            >
                                                                <EditIcon className="h-4 w-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(task)} className="p-1.5 rounded-md hover:bg-error-container hover:text-error text-on-surface-variant transition-colors" title="Delete">
                                                                <Trash2Icon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        {filteredTasks.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="p-12 text-center text-on-surface-variant italic">
                                                    <div className="flex flex-col items-center">
                                                        <ClipboardCheckIcon className="h-8 w-8 mb-2 opacity-30" />
                                                        <p>No Mini Feats yet for this Mile Step.</p>
                                                        <button onClick={() => document.getElementById('add-mini-feat-input')?.focus()} className="text-primary text-sm font-bold mt-2 hover:underline">Start adding one</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Board View (Old) */}
                        {viewMode === 'board' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                                {(Object.keys(columns) as TaskQuarter[]).map(quarter => (
                                    <div
                                        key={quarter}
                                        className="bg-surface-variant/50 p-4 rounded-lg"
                                        onDragOver={(e) => { e.preventDefault(); dragOverColumn.current = quarter; }}
                                        onDrop={handleDrop}
                                    >
                                        <h3 className="font-semibold text-title-md text-on-surface mb-4">{COLUMN_TITLES[quarter]}</h3>
                                        <div className="space-y-1 min-h-[50px]">
                                            {columns[quarter]
                                                .filter(t => filterCategory === 'ALL' || t.category === filterCategory)
                                                .map(task => (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
                                                        toggleTask={toggleTask}
                                                        handleDeleteClick={handleDeleteClick}
                                                        setExpandedTaskId={setExpandedTaskId}
                                                        expandedTaskId={expandedTaskId}
                                                        dragItem={dragItem}
                                                        updateTaskCategory={updateTaskCategory}
                                                        updateTaskTime={updateTaskTime}
                                                        updateTaskNotes={updateTaskNotes}
                                                        markAsWin={markAsWin}
                                                    />
                                                ))}
                                            {columns[quarter].length === 0 && <p className="text-body-sm text-on-surface-variant/60 text-center py-4 italic">Drop tasks here</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'ideas' && (
                    <div className="mt-6 animate-fade-in-up-fast">
                        <form onSubmit={handleAddIdea} className="flex mb-4">
                            <input type="text" value={newIdea} onChange={e => setNewIdea(e.target.value)} placeholder="Capture a new idea..." className="flex-grow p-3 bg-surface-variant border-b-2 border-outline focus:border-primary text-on-surface-variant placeholder-on-surface-variant rounded-t-md focus:outline-none transition-colors" />
                            <button type="submit" className="bg-primary text-on-primary px-6 rounded-r-md hover:shadow-lg transition-all active:scale-95">Add Idea</button>
                        </form>
                        <div className="relative mb-4">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                            <input type="text" value={ideaSearch} onChange={e => setIdeaSearch(e.target.value)} placeholder="Search ideas by text or tag..." className="w-full pl-10 pr-4 py-2 bg-surface-variant text-on-surface-variant placeholder-on-surface-variant border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="space-y-3">
                            {filteredIdeas.map(idea => (
                                <div key={idea.id} className="bg-surface-variant/50 p-4 rounded-lg border border-outline/20">
                                    <p className="text-body-md text-on-surface">{idea.text}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {idea.tags.map(tag => <span key={tag} className="px-2 py-0.5 text-xs font-medium text-on-secondary-container bg-secondary-container rounded-full">{tag}</span>)}
                                            <button onClick={() => handleGetTagSuggestions(idea)} className="flex items-center text-xs text-primary font-medium hover:underline">
                                                <SparklesIcon className="h-3 w-3 mr-1" />
                                                {taggingIdeaId === idea.id ? 'Loading...' : 'AI Tags'}
                                            </button>
                                        </div>
                                        <span className="text-label-sm text-on-surface-variant">{idea.createdAt}</span>
                                    </div>
                                    {taggingIdeaId === idea.id && suggestedTags.length > 0 && (
                                        <div className="mt-2 p-2 bg-primary-container/30 rounded-md">
                                            <p className="text-label-sm font-medium mb-1">Suggested Tags:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {suggestedTags.map(tag => (
                                                    <button key={tag} onClick={() => addTagToIdea(idea.id, tag)} className="px-2 py-0.5 text-xs font-medium bg-surface rounded-full hover:bg-primary-container">
                                                        + {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <AITaskReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddTasks={handleAddTasksFromAI}
            />
            {/* Confirmation Modal */}
            <DeleteConfirmationModal
                task={taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={confirmDeleteTask}
            />
        </div>
    );
};

export default ActionPlan;
