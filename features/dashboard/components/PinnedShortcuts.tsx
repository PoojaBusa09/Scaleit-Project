import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    LayoutGridIcon, 
    XIcon,
    FileTextIcon,
    TrendingUpIcon,
    TargetIcon,
    MapPinIcon,
    UsersIcon,
    CommunityIcon,
    DollarSignIcon,
    Activity,
    BriefcaseIcon,
    GitBranchIcon,
    BarChartIcon,
    BookOpenIcon,
    AlertTriangleIcon,
    HistoryIcon,
    CalendarIcon,
    LightbulbIcon,
    ChevronRightIcon
} from '../../../components/icons.tsx';
import { SCALEIT_METHOD_STRUCTURE } from '../../../data/mockMentors.ts';

// --- Icon Mapping (Duplicate from ScaleItToolsPage for Prototype Speed) ---
const TOOL_ICONS: { [key: string]: React.ElementType } = {
    'My Strategic Plan': FileTextIcon,
    '15 Scalable Models': LayoutGridIcon,
    'Gap Analysis': TrendingUpIcon,
    'North Star Metrics': TargetIcon,
    'Sales & Marketing Blueprint': MapPinIcon,
    'Perfect Client Decoder': UsersIcon,
    'Champion Customer Journey': MapPinIcon,
    'Marketing Methods': CommunityIcon,
    'Financial Forecasting': DollarSignIcon,
    'Perfect Employee Decoder': UsersIcon,
    '4 Superpowers': Activity,
    'My Success Team': UsersIcon,
    'Hire for Growth': BriefcaseIcon,
    'Hero Team Journey': MapPinIcon,
    'Org Chart Builder': GitBranchIcon,
    'Leadership Assessment': BarChartIcon,
    'Old Story / New Story': BookOpenIcon,
    'Money Mindset Equation': DollarSignIcon,
    'Fear Leaping': AlertTriangleIcon,
    'Quarterly Reflections': HistoryIcon,
    'The Systemizer': LayoutGridIcon,
    'RoadMap': MapPinIcon,
    'Team Retreat Builder': CalendarIcon,
    'Brainstorm Builder': LightbulbIcon,
    'Recurring Meeting Flow': CalendarIcon,
    'Action Plan': LayoutGridIcon,
    'Quarterly Action Plan': LayoutGridIcon
};

interface PinnedTool {
    name: string;
    path: string;
    icon: React.ElementType;
}

const SortableShortcut: React.FC<{ tool: PinnedTool; onUnpin: (name: string) => void }> = ({ tool, onUnpin }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: tool.name });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    const ToolIcon = tool.icon;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all active:scale-95"
        >
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnpin(tool.name); }}
                className="absolute -top-1 -right-1 p-1 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-red-500 hover:border-red-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
                <XIcon className="w-3 h-3" />
            </button>
            
            <Link 
                to={tool.path} 
                className="absolute inset-0 z-0" 
                {...attributes} 
                {...listeners} 
            />

            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-2 group-hover:bg-black group-hover:text-white transition-colors pointer-events-none">
                <ToolIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-900 line-clamp-2 pointer-events-none uppercase tracking-tight leading-tight">
                {tool.name}
            </span>
        </div>
    );
};

export const PinnedShortcuts: React.FC<{ hideWrapper?: boolean }> = ({ hideWrapper = false }) => {
    const [pinnedNames, setPinnedNames] = useState<string[]>([]);
    const [pinnedTools, setPinnedTools] = useState<PinnedTool[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('pinnedScaleItTools');
        const defaultNames = ['My Strategic Plan', '15 Scalable Models', 'Gap Analysis', 'North Star Metrics'];
        
        let names = [];
        try {
            names = stored ? JSON.parse(stored) : defaultNames;
            if (!Array.isArray(names) || names.length === 0) {
                names = defaultNames;
            }
        } catch (e) {
            names = defaultNames;
        }
        
        setPinnedNames(names);
    }, []);

    useEffect(() => {
        const allTools: { [key: string]: { path: string } } = {};
        SCALEIT_METHOD_STRUCTURE.forEach(section => {
            section.tools.forEach(tool => {
                allTools[tool.name] = { path: tool.path };
            });
        });

        const tools = pinnedNames.map(name => ({
            name,
            path: allTools[name]?.path || '/strategy',
            icon: TOOL_ICONS[name] || ChevronRightIcon
        }));
        setPinnedTools(tools);
    }, [pinnedNames]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setPinnedTools((items: PinnedTool[]) => {
                const oldIndex = items.findIndex(i => i.name === active.id.toString());
                const newIndex = items.findIndex(i => i.name === over.id.toString());
                const newItems = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem('pinnedScaleItTools', JSON.stringify(newItems.map(i => i.name)));
                return newItems;
            });
        }
    };

    const handleUnpin = (name: string) => {
        const next = pinnedNames.filter(n => n !== name);
        setPinnedNames(next);
        localStorage.setItem('pinnedScaleItTools', JSON.stringify(next));
    };



    const content = (
        <div className="space-y-4">
            {!hideWrapper && (
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-black text-white rounded-lg">
                            <LayoutGridIcon className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-gray-900">Pinned Shortcuts</h3>
                    </div>
                </div>
            )}
            
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={pinnedTools.map(t => t.name)} 
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {pinnedTools.slice(0, 8).map((tool) => (
                            <SortableShortcut key={tool.name} tool={tool} onUnpin={handleUnpin} />
                        ))}
                        {Array.from({ length: Math.max(0, 8 - Math.min(pinnedTools.length, 8)) }).map((_, i) => (
                            <Link 
                                key={`empty-${i}`}
                                to="/tools" 
                                className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 bg-white/50 hover:border-gray-300 transition-all text-gray-400 group min-h-[120px]"
                            >
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm text-gray-400 group-hover:text-black group-hover:border-black">
                                    <span className="text-2xl font-light leading-none mb-1">+</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-tight leading-tight group-hover:text-black transition-colors">
                                    Add Shortcut
                                </span>
                            </Link>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );

    if (hideWrapper) return content;

    return (
        <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 p-5 shadow-sm">
            {content}
        </div>
    );
};
