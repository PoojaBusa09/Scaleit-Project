
import React from 'react';
import { TrophyIcon } from '../../../components/icons.tsx';
import { Task } from '../../../types.ts';
import { Card, CardHeader } from './Card.tsx';

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
)

export const WinsWidget: React.FC<{ tasks: Task[], inEditMode?: boolean }> = ({ tasks, inEditMode }) => {
    const wins = tasks.filter(task => task.isWin).sort((a, b) => new Date(b.winDate || 0).getTime() - new Date(a.winDate || 0).getTime());
    return (
        <Card isDraggable={inEditMode}>
            <CardHeader icon={TrophyIcon} title="Recent Wins" inEditMode={inEditMode} />
            <div className="space-y-3">
                {wins.slice(0, 3).map(win => (
                    <div key={win.id} className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-tertiary" />
                        <p className="ml-3 text-body-md text-on-surface">{win.text}</p>
                        <span className="ml-auto text-body-sm text-on-surface-variant">{win.winDate}</span>
                    </div>
                ))}
                {wins.length === 0 && <p className="text-body-md text-on-surface-variant">Complete a task and mark it as a win!</p>}
            </div>
        </Card>
    );
};
