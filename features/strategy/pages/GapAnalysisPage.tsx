import React, { useState } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import {
    PlusIcon,
    XIcon,
    InfoIcon,
    PrinterIcon,
    CopyIcon,
    FileTextIcon,
    ChevronLeftIcon,
    LockIcon,
    Trash2Icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InstructionsModal } from '../../../components/InstructionsModal.tsx';

// =============================================================================
// Types
// =============================================================================

type AnalysisType = 'gap' | 'superpowers' | 'opportunities' | 'trends';
type Priority = 'C' | 'N'; // Critical | Nice to Have

interface AnalysisItem {
    id: string;
    text: string;
    priority: Priority;
}

interface QuadrantData {
    id: AnalysisType;
    title: string;
    items: AnalysisItem[];
}

// =============================================================================
// Components
// =============================================================================

const QuadrantBox: React.FC<{
    title: string;
    items: AnalysisItem[];
    onAddItem: (text: string) => void;
    onUpdateItem: (id: string, updates: Partial<AnalysisItem>) => void;
    onDeleteItem: (id: string) => void;
}> = ({ title, items, onAddItem, onUpdateItem, onDeleteItem }) => {
    const [newItemText, setNewItemText] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newItemText.trim()) {
            onAddItem(newItemText.trim());
            setNewItemText('');
        }
    };

    return (
        <div className="flex flex-col h-full border border-blue-200 bg-blue-50/30 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-white border-b border-blue-100 p-3 text-center">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
            </div>

            <div className="flex-1 p-4 bg-indigo-50/20 min-h-[250px] overflow-y-auto">
                <ul className="space-y-2">
                    {items.map(item => (
                        <li key={item.id} className="flex items-start group">
                            <div className="mr-2 mt-1">
                                <button
                                    onClick={() => onUpdateItem(item.id, { priority: item.priority === 'C' ? 'N' : 'C' })}
                                    className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold border transition-colors ${item.priority === 'C'
                                        ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                                        : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                                        }`}
                                    title="Toggle Priority (Critical/Nice)"
                                >
                                    {item.priority}
                                </button>
                            </div>
                            <div className="flex-1">
                                <span className="text-slate-700 text-sm">{item.text}</span>
                            </div>
                            <button
                                onClick={() => onDeleteItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity ml-2"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="mt-4">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type and press Enter..."
                        className="w-full bg-transparent border-none text-sm placeholder:text-slate-400 focus:ring-0 p-0"
                    />
                </div>
            </div>
        </div>
    );
};

export const GapAnalysisPage: React.FC = () => {
    const [showInstructions, setShowInstructions] = useState(false);

    // Initial State Mock
    const [data, setData] = useState<Record<AnalysisType, AnalysisItem[]>>({
        gap: [],
        superpowers: [],
        opportunities: [],
        trends: []
    });

    const addItem = (type: AnalysisType, text: string) => {
        const newItem: AnalysisItem = {
            id: Math.random().toString(36).substr(2, 9),
            text,
            priority: 'C' // Default to Critical
        };
        setData(prev => ({
            ...prev,
            [type]: [...prev[type], newItem]
        }));
    };

    const updateItem = (type: AnalysisType, id: string, updates: Partial<AnalysisItem>) => {
        setData(prev => ({
            ...prev,
            [type]: prev[type].map(item => item.id === id ? { ...item, ...updates } : item)
        }));
    };

    const deleteItem = (type: AnalysisType, id: string) => {
        setData(prev => ({
            ...prev,
            [type]: prev[type].filter(item => item.id !== id)
        }));
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Gap Analysis Instructions"
            >
                <div className="space-y-4 text-slate-600">
                    <p>
                        The Gap Analysis tool helps you identify the current state of your business across four key quadrants:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Gaps:</strong> Critical areas where your business is currently underperforming or missing resources.</li>
                        <li><strong>Superpowers:</strong> Your unique strengths and competitive advantages that you can leverage.</li>
                        <li><strong>Opportunities:</strong> External possibilities for growth, expansion, or improvement.</li>
                        <li><strong>Trends:</strong> Industry shifts or market changes that could impact your business model.</li>
                    </ul>
                    <p>
                        Use this tool to brainstorm items in each category, prioritize them, and develop strategies to close the gaps and capitalize on your superpowers.
                    </p>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Gap Analysis"
                description="Identify your company's Superpowers, Gaps, Opportunities, and Trends."
                onBack={() => navigate('/scaleit-method')}
                backLabel="Back to SCALEit Method"
            >
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-md bg-white border border-slate-200">
                        October 30, 2025
                    </button>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                        <FileTextIcon className="w-4 h-4" />
                        New Version
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm">
                        <CopyIcon className="w-4 h-4" />
                        Copy
                    </button>
                    <button
                        onClick={() => setShowInstructions(true)}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-100 text-black bg-white text-sm font-bold shadow-sm"
                    >
                        <InfoIcon className="w-4 h-4 text-blue-600" />
                        Instructions
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors bg-white border border-slate-200">
                        <PrinterIcon className="w-4 h-4" />
                    </button>
                </div>
            </PageHeader>

            {/* Main Content Grid */}
            <div className="p-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-140px)]">

                    {/* Top Left: Gaps */}
                    <QuadrantBox
                        title="GAP"
                        items={data.gap}
                        onAddItem={(text) => addItem('gap', text)}
                        onUpdateItem={(id, updates) => updateItem('gap', id, updates)}
                        onDeleteItem={(id) => deleteItem('gap', id)}
                    />

                    {/* Top Right: Superpowers */}
                    <QuadrantBox
                        title="SUPER POWERS"
                        items={data.superpowers}
                        onAddItem={(text) => addItem('superpowers', text)}
                        onUpdateItem={(id, updates) => updateItem('superpowers', id, updates)}
                        onDeleteItem={(id) => deleteItem('superpowers', id)}
                    />

                    {/* Bottom Left: Opportunities */}
                    <QuadrantBox
                        title="OPPORTUNITIES"
                        items={data.opportunities}
                        onAddItem={(text) => addItem('opportunities', text)}
                        onUpdateItem={(id, updates) => updateItem('opportunities', id, updates)}
                        onDeleteItem={(id) => deleteItem('opportunities', id)}
                    />

                    {/* Bottom Right: Trends */}
                    <QuadrantBox
                        title="TRENDS"
                        items={data.trends}
                        onAddItem={(text) => addItem('trends', text)}
                        onUpdateItem={(id, updates) => updateItem('trends', id, updates)}
                        onDeleteItem={(id) => deleteItem('trends', id)}
                    />

                </div>
            </div>
        </div>
    );
};

export default GapAnalysisPage;
