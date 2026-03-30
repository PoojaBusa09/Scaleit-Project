import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/PageHeader';
import { InstructionsModal } from '../../../components/InstructionsModal';
import { useNavigate } from 'react-router-dom';
import {
    InfoIcon,
    XIcon,
    PlusIcon,
    Trash2Icon,
    RotateCcwIcon,
    ArrowRightIcon,
    SparklesIcon
} from 'lucide-react';

// =============================================================================
// Components
// =============================================================================



interface StoryPair {
    id: string;
    oldStory: string;
    newStory: string;
}

export const OldStoryNewStoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState<StoryPair[]>([]);
    const [showInstructions, setShowInstructions] = useState(false);

    // Load Data
    useEffect(() => {
        const saved = localStorage.getItem('scaleit_old_new_stories');
        if (saved) {
            try {
                setStories(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load stories", e);
                // Default start with one pair
                setStories([{ id: Date.now().toString(), oldStory: '', newStory: '' }]);
                setShowInstructions(true);
            }
        } else {
            setStories([{ id: Date.now().toString(), oldStory: '', newStory: '' }]);
            setShowInstructions(true);
        }
    }, []);

    // Save Data
    useEffect(() => {
        if (stories.length > 0) {
            localStorage.setItem('scaleit_old_new_stories', JSON.stringify(stories));
        }
    }, [stories]);

    const updateStory = (id: string, field: 'oldStory' | 'newStory', value: string) => {
        setStories(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addPair = () => {
        setStories(prev => [...prev, { id: Date.now().toString(), oldStory: '', newStory: '' }]);
    };

    const removePair = (id: string) => {
        if (confirm("Are you sure you want to remove this story pair?")) {
            setStories(prev => {
                const newStories = prev.filter(s => s.id !== id);
                return newStories.length === 0 ? [{ id: Date.now().toString(), oldStory: '', newStory: '' }] : newStories;
            });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                title="Old Story / New Story"
                subtitle="Shift your mindset from limitation to opportunity."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Purpose</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Through the words you use and the daily stories you focus on, you can shift from a state of worry or overwhelm
                            to a new experience of opportunity and confidence. This awareness helps stop negative, habitual thoughts.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                <RotateCcwIcon className="w-4 h-4" /> The Old Story
                            </h4>
                            <p className="text-sm text-red-700 italic">
                                "Life is so hard right now. I don't deserve success. I have no time."
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4" /> The New Story
                            </h4>
                            <p className="text-sm text-green-700 italic">
                                "I create my own happiness. I am attracting abundance daily. I've so got this!"
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Directions</h3>
                        <ol className="list-decimal list-inside space-y-2 text-slate-600">
                            <li>Write out the <strong>Old Stories</strong> that you think and talk about each day.</li>
                            <li>Immediately replace each one with a <strong>New Story</strong>—a positive phrase as if it is already happening.</li>
                            <li>Every time you catch yourself telling an Old Story, switch it fast to your New Story.</li>
                        </ol>
                    </div>
                </div>
            </InstructionsModal>

            <PageHeader
                title="Old Story / New Story"
                description="Reframe negative narratives into positive opportunities."
                backPath="/scaleit-method"
                backLabel="Back to SCALEit Method"
                onBack={() => navigate('/scaleit-method')}
                className="shrink-0"
            >
                <div className="flex gap-2">
                    <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
                        <InfoIcon className="w-4 h-4" /> Instructions
                    </button>
                </div>
            </PageHeader>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 text-center mb-8 shrink-0">
                        <h2 className="text-xl font-bold text-blue-900 uppercase tracking-widest mb-1">Pattern Interrupt</h2>
                        <p className="text-sm text-blue-600 font-medium">Catch the old story, flip the switch.</p>
                    </div>

                    {stories.map((story, index) => (
                        <div key={story.id} className="grid md:grid-cols-2 gap-4 md:gap-8 group relative bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            {/* Remove Button */}
                            <button
                                onClick={() => removePair(story.id)}
                                className="absolute -top-3 -right-3 md:top-4 md:right-4 p-2 bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm border border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-10"
                                title="Remove Pair"
                            >
                                <Trash2Icon className="w-4 h-4" />
                            </button>

                            {/* Old Story */}
                            <div className="flex flex-col h-full">
                                <label className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">{index + 1}</span>
                                    Old Story
                                </label>
                                <textarea
                                    value={story.oldStory}
                                    onChange={(e) => updateStory(story.id, 'oldStory', e.target.value)}
                                    placeholder="e.g., I never have enough time..."
                                    className="flex-1 w-full bg-red-50/50 border border-red-100 rounded-lg p-4 text-slate-700 placeholder:text-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-300 focus:outline-none transition-all resize-none min-h-[120px]"
                                />
                            </div>

                            {/* Arrow Divider (Desktop Only) */}
                            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 z-10 shadow-sm">
                                <ArrowRightIcon className="w-4 h-4" />
                            </div>

                            {/* New Story */}
                            <div className="flex flex-col h-full">
                                <label className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">{index + 1}</span>
                                    New Story
                                </label>
                                <textarea
                                    value={story.newStory}
                                    onChange={(e) => updateStory(story.id, 'newStory', e.target.value)}
                                    placeholder="e.g., I am the master of my schedule..."
                                    className="flex-1 w-full bg-green-50/50 border border-green-100 rounded-lg p-4 text-slate-700 placeholder:text-green-300 focus:ring-2 focus:ring-green-200 focus:border-green-300 focus:outline-none transition-all resize-none min-h-[120px]"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add Button */}
                    <button
                        onClick={addPair}
                        className="w-full py-5 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        <PlusIcon className="w-6 h-6" /> Add Another Story Pair
                    </button>
                    <div className="h-10"></div> {/* Spacer */}
                </div>
            </div>
        </div>
    );
};

export default OldStoryNewStoryPage;
