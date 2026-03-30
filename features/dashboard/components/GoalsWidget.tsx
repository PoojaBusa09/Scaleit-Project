
import React from 'react';
import { Link } from 'react-router-dom';
import { TargetIcon, TrendingUpIcon } from '../../../components/icons.tsx';
import { MemberGoal } from '../../../types.ts';
import { Card, CardHeader } from './Card.tsx';

export const GoalsWidget: React.FC<{ goals: MemberGoal[], inEditMode?: boolean }> = ({ goals, inEditMode }) => {
    return (
        <Card isDraggable={inEditMode}>
            <CardHeader icon={TargetIcon} title="Goals & Value Metrics" inEditMode={inEditMode}>
                <Link to="/strategic-vision" className="text-sm font-medium text-primary hover:underline transition-all active:scale-95">Update</Link>
            </CardHeader>
            <div className="space-y-4">
                {goals.map(goal => {
                    const percentage = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
                    return (
                        <div key={goal.id}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-body-sm font-medium text-on-surface">{goal.title}</span>
                                <span className="text-body-sm text-on-surface-variant">
                                    {goal.unit === '$' ? `$${goal.currentValue.toLocaleString()}` : goal.currentValue}
                                    / {goal.unit === '$' ? `$${goal.targetValue.toLocaleString()}` : goal.targetValue} {goal.unit !== '$' && goal.unit}
                                </span>
                            </div>
                            <div className="w-full bg-surface-variant rounded-full h-2">
                                <div className="bg-tertiary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
                {goals.length === 0 && <p className="text-body-md text-on-surface-variant">No goals set. Go to Strategy to define them.</p>}
            </div>
            <div className="mt-4 pt-3 border-t border-outline/10">
                <div className="flex items-center text-sm text-on-surface-variant">
                    <TrendingUpIcon className="h-4 w-4 mr-2 text-green-600" />
                    <span>Overall Progress: +12% this quarter</span>
                </div>
            </div>
        </Card>
    );
}
