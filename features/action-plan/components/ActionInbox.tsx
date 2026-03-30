import React from 'react';
import { Task } from '../../../types';
import { CheckCircleIcon, Trash2Icon, SparklesIcon } from '../../../components/icons';

interface ActionInboxProps {
    tasks: Task[];
    onAccept: (task: Task) => void;
    onDismiss: (task: Task) => void;
}

const ActionInbox: React.FC<ActionInboxProps> = ({ tasks, onAccept, onDismiss }) => {
    const suggestedTasks = tasks.filter(t => t.status === 'suggested');

    if (suggestedTasks.length === 0) return null;

    return (
        <div className="mb-8 animate-fade-in-up-fast">
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                    <SparklesIcon className="h-4 w-4" />
                </div>
                <h3 className="text-title-md font-bold text-on-surface">Suggested Actions</h3>
                <span className="bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {suggestedTasks.length}
                </span>
            </div>

            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {suggestedTasks.map(task => (
                    <div key={task.id} className="bg-surface border border-primary/20 shadow-sm hover:shadow-md transition-all rounded-xl p-4 flex flex-col relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl"></div>

                        <div className="mb-3">
                            <h4 className="font-medium text-sm text-on-surface leading-snug">{task.text}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {task.sourceSessionId && (
                                    <span className="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                        From Session
                                    </span>
                                )}
                                <span className="text-[10px] text-on-surface-variant bg-surface-variant px-1.5 py-0.5 rounded">
                                    {task.owner || 'Me'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-auto pt-3 border-t border-outline/10 flex gap-2">
                            <button
                                onClick={() => onAccept(task)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-on-primary text-xs font-bold py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <CheckCircleIcon className="h-3 w-3" />
                                Accept
                            </button>
                            <button
                                onClick={() => onDismiss(task)}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-surface-variant text-on-surface-variant text-xs font-bold py-1.5 rounded-lg hover:bg-error/10 hover:text-error transition-colors"
                            >
                                <Trash2Icon className="h-3 w-3" />
                                Dismiss
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionInbox;
