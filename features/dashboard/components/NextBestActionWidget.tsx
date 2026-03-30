
import React, { useState, useEffect } from 'react';
import { LightbulbIcon } from '../../../components/icons.tsx';
import { Task, Session } from '../../../types.ts';
import { getNextBestAction } from '../../../services/geminiService';

export const NextBestActionWidget: React.FC<{ tasks: Task[], sessions: Session[] }> = ({ tasks, sessions }) => {
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestion = async () => {
            setIsLoading(true);
            const pendingTasks = tasks.filter(t => !t.completed).map(t => `- ${t.text}`).join('\n');
            const upcomingSessions = sessions.filter(s => new Date(s.date) >= new Date() && !s.attended).map(s => `- ${s.title} on ${s.date}`).join('\n');

            const response = await getNextBestAction(pendingTasks, upcomingSessions);
            setSuggestion(response);
            setIsLoading(false);
        };
        fetchSuggestion();
    }, [tasks, sessions]);

    return (
        <div className="bg-primary-container p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start">
                <LightbulbIcon className="h-8 w-8 text-on-primary-container flex-shrink-0 mt-1" />
                <div className="ml-4">
                    <h3 className="text-title-lg font-bold text-on-primary-container">Your Next Best Action</h3>
                    {isLoading ? (
                        <p className="mt-1 text-body-md text-on-primary-container/80 animate-pulse-subtle">Pinnacle AI is thinking...</p>
                    ) : (
                        <p className="mt-1 text-body-md text-on-primary-container/90">{suggestion}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
