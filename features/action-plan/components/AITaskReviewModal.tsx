
import React, { useState, useEffect } from 'react';
import { extractActionItems } from '../../../services/geminiService';
// Fix: Corrected import path for constants
import { MOCK_SESSIONS } from '../../../constants.ts';
// Fix: Corrected import path for icons
import { SparklesIcon } from '../../../components/icons.tsx';

interface AITaskReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTasks: (tasks: string[]) => void;
}

const AITaskReviewModal: React.FC<AITaskReviewModalProps> = ({ isOpen, onClose, onAddTasks }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    // Internal state to handle exit animation
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsShowing(true);
            const fetchTasks = async () => {
                setIsLoading(true);
                setSuggestedTasks([]);
                setSelectedTasks([]);
                const lastSessionWithTranscript = MOCK_SESSIONS.find(s => s.transcript);
                if (lastSessionWithTranscript && lastSessionWithTranscript.transcript) {
                    const items = await extractActionItems(lastSessionWithTranscript.transcript);
                    setSuggestedTasks(items);
                    setSelectedTasks(items);
                }
                setIsLoading(false);
            };
            fetchTasks();
        } else {
            setIsShowing(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsShowing(false);
        // Wait for animation to finish before calling parent onClose
        setTimeout(onClose, 300);
    }

    const handleToggleTask = (task: string) => {
        setSelectedTasks(prev =>
            prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
        );
    };

    const handleAddSelectedTasks = () => {
        onAddTasks(selectedTasks);
        handleClose();
    };

    if (!isOpen && !isShowing) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isShowing ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            onClick={handleClose}
        >
            <div
                className={`bg-surface rounded-xl shadow-xl w-full max-w-lg flex flex-col transition-all duration-300 ${isShowing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center mb-1">
                        <SparklesIcon className="h-6 w-6 text-primary mr-3" />
                        <h3 className="text-headline-sm text-on-surface">AI-Suggested Action Items</h3>
                    </div>
                    <p className="text-body-md text-on-surface-variant ml-9">Pinnacle AI found these items in your last session. Select which ones to add to your plan.</p>
                </div>
                <div className="p-6 pt-0 max-h-96 overflow-y-auto">
                    {isLoading && <div className="text-center text-on-surface-variant animate-pulse">Analyzing session transcript...</div>}
                    {!isLoading && suggestedTasks.length === 0 && <div className="text-center text-on-surface-variant">No specific action items found.</div>}
                    {!isLoading && suggestedTasks.length > 0 && (
                        <div className="space-y-2">
                            {suggestedTasks.map((task, index) => (
                                <label key={index} className="flex items-start p-3 rounded-lg hover:bg-surface-variant cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedTasks.includes(task)}
                                        onChange={() => handleToggleTask(task)}
                                        className="h-5 w-5 text-primary rounded border-outline focus:ring-primary mt-0.5"
                                    />
                                    <span className="ml-3 text-body-md text-on-surface">{task}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 flex justify-end space-x-2">
                    <button onClick={handleClose} className="px-6 py-2.5 text-label-lg font-medium text-primary rounded-full hover:bg-primary/10 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleAddSelectedTasks} disabled={selectedTasks.length === 0} className="px-6 py-2.5 text-label-lg font-medium text-on-primary bg-primary rounded-full hover:shadow-lg disabled:bg-on-surface/20 transition-all transform hover:scale-105 active:scale-95">
                        Add {selectedTasks.length} item(s)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AITaskReviewModal;