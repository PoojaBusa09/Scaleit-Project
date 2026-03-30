
import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_ORG_CHART } from '../../../data/mockMentors.ts';
import { OrgNode } from '../../../types.ts';
import { getOrgChartSuggestions } from '../../../services/geminiService';
import {
    SparklesIcon, LightbulbIcon, ChevronLeftIcon, TrendingUpIcon,
    GripVerticalIcon, PlusIcon, Trash2Icon, SaveIcon, HistoryIcon,
    RotateCcwIcon, UsersIcon, CheckCircleIcon, SearchIcon, ZoomIcon, EyeIcon
} from '../../../components/icons.tsx';
import { MinusIcon } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';

// --- Types ---
interface OrgVersion {
    id: string;
    name: string;
    timestamp: string;
    data: OrgNode;
}

// --- Helper Functions ---
const generateId = () => Math.floor(Math.random() * 1000000);

const findNode = (node: OrgNode, id: number): OrgNode | null => {
    if (node.id === id) return node;
    if (node.children) {
        for (const child of node.children) {
            const found = findNode(child, id);
            if (found) return found;
        }
    }
    return null;
};

// Check if targetId is a descendant of sourceId
const isDescendant = (node: OrgNode, targetId: number): boolean => {
    if (node.children) {
        for (const child of node.children) {
            if (child.id === targetId) return true;
            if (isDescendant(child, targetId)) return true;
        }
    }
    return false;
};

const cloneTree = (node: OrgNode): OrgNode => {
    return {
        ...node,
        children: node.children ? node.children.map(cloneTree) : []
    };
};

// --- Components ---

const OrgNodeComponent: React.FC<{
    node: OrgNode;
    onDragStart: (e: React.DragEvent, id: number) => void;
    onDrop: (e: React.DragEvent, id: number) => void;
    onSelect: (node: OrgNode) => void;
    selectedId: number | null;
    isRoot?: boolean;
    readOnly?: boolean;
}> = ({ node, onDragStart, onDrop, onSelect, selectedId, isRoot = false, readOnly = false }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        if (readOnly) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (readOnly) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (readOnly) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        onDrop(e, node.id);
    };

    const isSelected = selectedId === node.id;

    return (
        <div className="flex flex-col items-center">
            <div
                className={`relative group bg-surface p-4 rounded-xl shadow-sm border-2 transition-all duration-200 min-w-[180px] text-center
                    ${!readOnly ? 'cursor-pointer' : ''}
                    ${isSelected ? 'border-primary ring-2 ring-primary/20 scale-105 z-10' : 'border-outline/20'}
                    ${!readOnly && !isSelected ? 'hover:border-primary/50 hover:shadow-md' : ''}
                    ${isDragOver ? 'bg-primary-container border-primary border-dashed scale-110' : ''}
                `}
                onClick={(e) => {
                    if (!readOnly) {
                        e.stopPropagation();
                        onSelect(node);
                    }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                draggable={!isRoot && !readOnly}
                onDragStart={(e) => !isRoot && !readOnly && onDragStart(e, node.id)}
            >
                {!isRoot && !readOnly && (
                    <div className="absolute top-2 left-2 text-on-surface-variant/30 cursor-grab active:cursor-grabbing hover:text-on-surface-variant">
                        <GripVerticalIcon className="h-4 w-4" />
                    </div>
                )}

                <div className="mb-1">
                    <p className="font-bold text-lg text-on-surface">{node.name}</p>
                    <p className="text-sm font-semibold text-primary">{node.title}</p>
                </div>

                {isSelected && !readOnly && (
                    <div className="absolute -top-2 -right-2">
                        <div className="bg-primary text-on-primary rounded-full p-1 shadow-sm">
                            <CheckCircleIcon className="h-3 w-3" />
                        </div>
                    </div>
                )}
            </div>

            {/* Recursive Children Rendering with Connector Lines */}
            {node.children && node.children.length > 0 && (
                <>
                    <div className="h-8 w-px bg-outline/40" />
                    <div className="flex justify-center relative">
                        {/* Horizontal connector line */}
                        {node.children.length > 1 && (
                            <div className="absolute top-0 left-0 w-full h-px bg-transparent">
                                <div className="absolute top-0 left-[50%] -translate-x-1/2 w-[calc(100%-4rem)] h-px" />
                            </div>
                        )}

                        {node.children.map((child, index, arr) => (
                            <div key={child.id} className="px-4 relative flex flex-col items-center">
                                {/* Top connector for child */}
                                <div className="h-8 w-px bg-outline/40 absolute top-0 left-1/2 -translate-x-1/2" />

                                {/* Horizontal connectors for siblings */}
                                {arr.length > 1 && (
                                    <>
                                        {index === 0 && <div className="absolute top-0 left-1/2 w-1/2 h-px bg-outline/40" />}
                                        {index === arr.length - 1 && <div className="absolute top-0 right-1/2 w-1/2 h-px bg-outline/40" />}
                                        {index > 0 && index < arr.length - 1 && <div className="absolute top-0 left-0 w-full h-px bg-outline/40" />}
                                    </>
                                )}

                                <OrgNodeComponent
                                    node={child}
                                    onDragStart={onDragStart}
                                    onDrop={onDrop}
                                    onSelect={onSelect}
                                    selectedId={selectedId}
                                    readOnly={readOnly}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// --- Props ---
interface OrgChartBuilderProps {
    storageKey?: string;
    title?: string;
    description?: string;
    instructions?: React.ReactNode;
    backPath?: string;
    backLabel?: string;
}

const OrgChartBuilder: React.FC<OrgChartBuilderProps> = ({
    storageKey = 'scaleit_org_chart',
    title = 'Org Chart Builder',
    description,
    instructions,
    backPath = '/tools',
    backLabel = 'Back to AI Tools'
}) => {
    const [chartData, setChartData] = useState<OrgNode>(MOCK_ORG_CHART);
    const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
    const [versions, setVersions] = useState<OrgVersion[]>([]);
    const [activeTab, setActiveTab] = useState<'edit' | 'versions' | 'ai'>('edit');
    const [scale, setScale] = useState(1);
    const [showInstructions, setShowInstructions] = useState(false);

    // Load from Storage
    useEffect(() => {
        const savedChart = localStorage.getItem(`${storageKey}_data`);
        const savedVersions = localStorage.getItem(`${storageKey}_versions`);

        if (savedChart) {
            try {
                setChartData(JSON.parse(savedChart));
            } catch (e) {
                console.error("Failed to load org chart data", e);
            }
        } else if (instructions) {
            // If it's a new instance (no data) and has instructions (like My Success Team), show them
            setShowInstructions(true);
        }

        if (savedVersions) {
            try {
                setVersions(JSON.parse(savedVersions));
            } catch (e) {
                console.error("Failed to load org chart versions", e);
            }
        }
    }, [storageKey]);

    // Save to Storage
    useEffect(() => {
        localStorage.setItem(`${storageKey}_data`, JSON.stringify(chartData));
    }, [chartData, storageKey]);

    useEffect(() => {
        localStorage.setItem(`${storageKey}_versions`, JSON.stringify(versions));
    }, [versions, storageKey]);

    // Preview Version State
    const [previewVersion, setPreviewVersion] = useState<OrgVersion | null>(null);

    // AI State
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // D&D State
    const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);

    // --- Actions ---

    // ... (keep move/drag logic same) ...
    const handleDragStart = (e: React.DragEvent, id: number) => {
        setDraggedNodeId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetId: number) => {
        if (draggedNodeId === null || draggedNodeId === targetId) return;

        const newChart = cloneTree(chartData);
        const sourceNode = findNode(newChart, draggedNodeId);
        const targetNode = findNode(newChart, targetId);

        if (!sourceNode || !targetNode) return;

        // Prevent dropping into own descendant
        if (isDescendant(sourceNode, targetId)) {
            alert("Cannot move a node into its own descendant.");
            return;
        }

        // Remove from old parent
        const removeFromParent = (node: OrgNode, id: number): boolean => {
            if (!node.children) return false;
            const idx = node.children.findIndex(c => c.id === id);
            if (idx !== -1) {
                node.children.splice(idx, 1);
                return true;
            }
            return node.children.some(child => removeFromParent(child, id));
        };

        removeFromParent(newChart, draggedNodeId);

        // Add to new parent
        if (!targetNode.children) targetNode.children = [];
        targetNode.children.push(sourceNode);

        setChartData(newChart);
        setDraggedNodeId(null);

        // Update selected node reference if moved
        if (selectedNode?.id === draggedNodeId) {
            setSelectedNode(sourceNode);
        }
    };
    // ...

    const handleUpdateNode = (key: keyof OrgNode, value: string) => {
        if (!selectedNode) return;

        const newChart = cloneTree(chartData);
        const nodeToUpdate = findNode(newChart, selectedNode.id);
        if (nodeToUpdate) {
            // @ts-ignore
            nodeToUpdate[key] = value;
            setChartData(newChart);
            setSelectedNode(nodeToUpdate);
        }
    };

    const handleAddChild = () => {
        if (!selectedNode) return;
        const newChart = cloneTree(chartData);
        const parent = findNode(newChart, selectedNode.id);
        if (parent) {
            if (!parent.children) parent.children = [];
            const newNode: OrgNode = {
                id: generateId(),
                name: "New Role",
                title: "Position Title",
                children: []
            };
            parent.children.push(newNode);
            setChartData(newChart);
        }
    };

    const handleDeleteNode = () => {
        if (!selectedNode || selectedNode.id === chartData.id) return; // Cannot delete root
        if (!window.confirm(`Delete ${selectedNode.title}? Children will also be removed.`)) return;

        const newChart = cloneTree(chartData);
        const removeFromParent = (node: OrgNode, id: number): boolean => {
            if (!node.children) return false;
            const idx = node.children.findIndex(c => c.id === id);
            if (idx !== -1) {
                node.children.splice(idx, 1);
                return true;
            }
            return node.children.some(child => removeFromParent(child, id));
        };

        if (removeFromParent(newChart, selectedNode.id)) {
            setChartData(newChart);
            setSelectedNode(null);
        }
    };

    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [newVersionName, setNewVersionName] = useState("");

    const handleSaveVersion = () => {
        setIsSaveModalOpen(true);
        setNewVersionName(`Version ${versions.length + 1} (FY${new Date().getFullYear().toString().slice(-2)})`);
    };

    const confirmSaveVersion = (e: React.FormEvent) => {
        e.preventDefault();
        if (newVersionName) {
            setVersions([{
                id: generateId().toString(),
                name: newVersionName,
                timestamp: new Date().toLocaleDateString(),
                data: cloneTree(chartData)
            }, ...versions]);
            setIsSaveModalOpen(false);
        }
    };

    const handleRestoreVersion = (version: OrgVersion) => {
        if (window.confirm(`Restore version "${version.name}"? Unsaved changes will be lost.`)) {
            setChartData(cloneTree(version.data));
            setSelectedNode(null);
            setPreviewVersion(null); // Close preview if open
        }
    };

    const handleDeleteVersion = (id: string) => {
        setVersions(versions.filter(v => v.id !== id));
    };

    const handleGetSuggestions = async () => {
        setIsAnalyzing(true);
        setSuggestions([]);
        const companyInfo = "Growth-stage company scaling operations";
        const result = await getOrgChartSuggestions(chartData, companyInfo);
        setSuggestions(result);
        setIsAnalyzing(false);
    };


    // View & Print State
    const [isViewMode, setIsViewMode] = useState(false);

    const handlePrint = () => {
        // Temporarily set title for print filename
        const originalTitle = document.title;
        document.title = "ScaleIt_Org_Chart";
        window.print();
        document.title = originalTitle;
    };

    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { size: landscape; margin: 0.5cm; }
                    body * { visibility: hidden; }
                    .org-chart-print-area, .org-chart-print-area * { 
                        visibility: visible; 
                    }
                    .org-chart-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100vw;
                        height: 100vh;
                        overflow: visible !important;
                        background: white !important;
                        z-index: 9999;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    /* Show Print Header */
                    .print-header { display: block !important; }
                    
                    /* Hide Zoom Controls in Print */
                    .org-chart-toolbar { display: none !important; }
                    .org-chart-instruction { display: none !important; }
                    
                    /* Force scale to fit or 1 based on preference, here we default to a readable scale */
                    .org-chart-canvas {
                        transform: scale(0.65) !important;
                        transform-origin: top center !important;
                        width: 100%;
                        margin-top: 2rem;
                    }
                }
            `}</style>

            {/* Version Preview Modal */}
            <Modal
                isOpen={!!previewVersion}
                onClose={() => setPreviewVersion(null)}
                title={`Preview: ${previewVersion?.name}`}
                maxWidth="max-w-7xl"
            >
                <div className="flex flex-col h-[70vh]">
                    <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-opacity-50 rounded-lg border border-outline/10">
                        {previewVersion && (
                            <div className="min-w-max min-h-max flex justify-center transform scale-75 origin-top">
                                <OrgNodeComponent
                                    node={previewVersion.data}
                                    onDragStart={() => { }}
                                    onDrop={() => { }}
                                    onSelect={() => { }}
                                    selectedId={null}
                                    isRoot={true}
                                    readOnly={true}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                            Saved on: {previewVersion?.timestamp}
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPreviewVersion(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => previewVersion && handleRestoreVersion(previewVersion)}
                                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
                            >
                                <HistoryIcon className="h-4 w-4 mr-2" />
                                Restore This Version
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Instructions Modal */}
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title={title}
                subtitle="Build your scalable organizational structure."
            >
                {instructions}
            </InstructionsModal>

            {/* Save Version Modal */}
            <Modal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                title="Save Org Chart Version"
            >
                <form onSubmit={confirmSaveVersion} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Version Name
                        </label>
                        <input
                            type="text"
                            required
                            value={newVersionName}
                            onChange={(e) => setNewVersionName(e.target.value)}
                            placeholder="e.g. FY25 H1 Plan"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                            autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Tip: Use typical fiscal year names like 'FY24' or 'FY25 Proposal'
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsSaveModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Save Snapshot
                        </button>
                    </div>
                </form>
            </Modal>

            <PageHeader
                title={title}
                description={description || "Design your organization's future structure."}
                backPath={backPath}
                backLabel={backLabel}
                onBack={() => navigate(backPath)}
                className="shrink-0"
            >
                <div className="flex gap-2">
                    {instructions && (
                        <button
                            onClick={() => setShowInstructions(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                        >
                            <LightbulbIcon className="h-4 w-4" />
                            Instructions
                        </button>
                    )}
                    <button
                        onClick={() => setIsViewMode(!isViewMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${isViewMode ? 'bg-primary text-on-primary' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                    >
                        <EyeIcon className="h-4 w-4" />
                        {isViewMode ? 'Edit Mode' : 'View Mode'}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-sm font-bold transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        Print
                    </button>
                    <button
                        onClick={handleSaveVersion}
                        className="flex items-center gap-2 bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-lg hover:bg-purple-100 text-sm font-bold transition-all"
                    >
                        <SaveIcon className="h-4 w-4" />
                        Save Snapshot
                    </button>
                </div>
            </PageHeader>

            <div className="flex-1 flex gap-6 overflow-hidden p-6">
                {/* Left: Canvas */}
                <div className={`transition-all duration-300 ${isViewMode ? 'w-full' : 'flex-1'} bg-surface rounded-xl shadow-sm border border-outline/20 relative overflow-hidden flex flex-col org-chart-print-area`}>

                    {/* Print Only Header */}
                    <div className="hidden print-header text-center pt-8 pb-4 border-b-2 border-primary/20 mb-8 mx-10">
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2 tracking-wide">Organization Chart</h1>
                        <p className="text-gray-500 font-medium text-lg">ScaleIt Platform • {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Toolbar */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-surface shadow-md rounded-lg p-2 border border-outline/10 org-chart-toolbar">
                        <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2 hover:bg-surface-variant rounded text-on-surface" title="Zoom In">
                            <PlusIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 hover:bg-surface-variant rounded text-on-surface" title="Zoom Out">
                            <MinusIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => setScale(1)} className="p-2 hover:bg-surface-variant rounded text-on-surface" title="Reset View">
                            <RotateCcwIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar p-10 bg-slate-50">
                        <div
                            className="org-chart-canvas min-w-max min-h-max flex justify-center origin-top transition-transform duration-200 ease-out"
                            style={{ transform: `scale(${scale})` }}
                        >
                            <OrgNodeComponent
                                node={chartData}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onSelect={setSelectedNode}
                                selectedId={selectedNode?.id || null}
                                isRoot={true}
                            />
                        </div>
                    </div>

                    <div className="p-3 bg-surface border-t border-outline/10 text-xs text-on-surface-variant flex justify-between org-chart-instruction">
                        <span>Drag nodes to reorder. Click to edit details.</span>
                        <span>{scale.toFixed(1)}x Zoom</span>
                    </div>
                </div>

                {/* Right: Properties Panel */}
                <div className={`${isViewMode ? 'w-0 opacity-0 overflow-hidden ml-0 p-0 border-0' : 'w-80 opacity-100'} transition-all duration-300 flex-shrink-0 bg-surface rounded-xl shadow-sm border border-outline/20 flex flex-col overflow-hidden`}>
                    {/* Tabs */}
                    <div className="flex border-b border-outline/20">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'edit' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setActiveTab('versions')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'versions' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Versions
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ai' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
                        >
                            AI
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                        {activeTab === 'edit' && (
                            <div className="space-y-6 animate-fade-in-up-fast">
                                {selectedNode ? (
                                    <>
                                        <div>
                                            <h3 className="text-title-md font-bold text-on-surface mb-4">Node Properties</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Name</label>
                                                    <input
                                                        type="text"
                                                        value={selectedNode.name}
                                                        onChange={(e) => handleUpdateNode('name', e.target.value)}
                                                        className="w-full p-2.5 bg-surface border border-outline rounded-lg focus:ring-2 focus:ring-primary text-on-surface font-medium text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Title / Role</label>
                                                    <input
                                                        type="text"
                                                        value={selectedNode.title}
                                                        onChange={(e) => handleUpdateNode('title', e.target.value)}
                                                        className="w-full p-2.5 bg-surface border border-outline rounded-lg focus:ring-2 focus:ring-primary text-on-surface font-medium text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-outline/10 space-y-3">
                                            <button
                                                onClick={handleAddChild}
                                                className="w-full flex items-center justify-center bg-primary text-on-primary py-2.5 rounded-lg hover:shadow-md text-sm font-bold transition-all"
                                            >
                                                <PlusIcon className="h-4 w-4 mr-2" /> Add Child Role
                                            </button>

                                            {selectedNode.id !== chartData.id && (
                                                <button
                                                    onClick={handleDeleteNode}
                                                    className="w-full flex items-center justify-center bg-error-container text-error py-2.5 rounded-lg hover:bg-error-container/80 text-sm font-bold transition-all"
                                                >
                                                    <Trash2Icon className="h-4 w-4 mr-2" /> Delete Node
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-on-surface-variant">
                                        <UsersIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                        <p className="font-bold">No Node Selected</p>
                                        <p className="text-sm mt-1">Click on a card in the chart to edit details or add children.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'versions' && (
                            <div className="space-y-4 animate-fade-in-up-fast">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-title-md font-bold text-on-surface">Snapshots</h3>
                                    <span className="text-xs text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full">{versions.length}</span>
                                </div>
                                {versions.length === 0 && (
                                    <p className="text-sm text-on-surface-variant text-center py-8 italic">No saved versions yet.</p>
                                )}
                                <div className="space-y-3">
                                    {versions.map(v => (
                                        <div key={v.id} className="group p-3 bg-surface-variant/30 rounded-lg border border-outline/10 hover:border-primary/30 transition-all">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-sm text-on-surface">{v.name}</span>
                                                <button onClick={() => handleDeleteVersion(v.id)} className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center text-xs text-on-surface-variant mb-3">
                                                <HistoryIcon className="h-3 w-3 mr-1" /> {v.timestamp}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setPreviewVersion(v)}
                                                    className="flex-1 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <EyeIcon className="h-3 w-3" /> View
                                                </button>
                                                <button
                                                    onClick={() => handleRestoreVersion(v)}
                                                    className="flex-1 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded hover:bg-primary/20 transition-colors"
                                                >
                                                    Restore
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="animate-fade-in-up-fast">
                                <div className="bg-primary-container/30 p-4 rounded-lg border border-primary/20 mb-4">
                                    <h3 className="font-bold text-primary mb-2 flex items-center">
                                        <SparklesIcon className="h-4 w-4 mr-2" /> AI Analyst
                                    </h3>
                                    <p className="text-xs text-on-surface-variant mb-3">Get structural recommendations based on your current org chart.</p>
                                    <button
                                        onClick={handleGetSuggestions}
                                        disabled={isAnalyzing}
                                        className="w-full py-2 bg-primary text-on-primary rounded-lg text-sm font-bold shadow-sm hover:shadow-md disabled:opacity-50 transition-all"
                                    >
                                        {isAnalyzing ? 'Analyzing...' : 'Analyze Structure'}
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="flex items-start text-sm text-on-surface p-3 bg-surface-variant/30 rounded-lg border border-outline/10">
                                            <LightbulbIcon className="h-4 w-4 mr-2 mt-0.5 text-tertiary flex-shrink-0" />
                                            <span className="font-medium">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgChartBuilder;
