
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquareIcon } from '../../../components/icons.tsx';
import { Task } from '../../../types.ts';
import { Card, CardHeader } from './Card.tsx';

export const PendingTasksWidget: React.FC<{ tasks: Task[], inEditMode?: boolean }> = ({ tasks, inEditMode }) => {
    const pending = tasks.filter(task => !task.completed);
    return (
        <Card isDraggable={inEditMode}>
            <CardHeader icon={CheckSquareIcon} title="Pending Tasks" inEditMode={inEditMode}>
                <Link to="/plan" className="text-sm font-medium text-primary hover:underline transition-all active:scale-95">View All</Link>
            </CardHeader>
            <div className="space-y-3">
                {pending.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center">
                        <div className="h-5 w-5 border-2 border-outline rounded-sm" />
                        <p className="ml-3 text-body-md text-on-surface truncate">{task.text}</p>
                    </div>
                ))}
                {pending.length > 3 && <p className="text-body-sm text-on-surface-variant mt-2">...and {pending.length - 3} more.</p>}
                {pending.length === 0 && <p className="text-body-md text-on-surface-variant">No pending tasks. Great job!</p>}
            </div>
        </Card>
    );
};
