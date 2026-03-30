
import React from 'react';
import { UsersIcon } from '../../../components/icons.tsx';
import { MOCK_USER } from '../../../data/mockUsers.ts';
import { MOCK_MENTORS } from '../../../data/mockMentors.ts';
import { Card, CardHeader } from './Card.tsx';

export const MyMentorsWidget: React.FC<{ inEditMode?: boolean }> = ({ inEditMode }) => (
    <Card isDraggable={inEditMode}>
        <CardHeader icon={UsersIcon} title="My Mentors" inEditMode={inEditMode} />
        <div className="space-y-3">
            {MOCK_USER.mentors.map(mentorName => {
                const mentor = MOCK_MENTORS.find(m => m.name === mentorName);
                if (!mentor) return null;
                return (
                    <div key={mentor.id} className="flex items-center justify-between p-2 bg-surface-variant rounded-md">
                        <div className="flex items-center">
                            <img src={mentor.avatarUrl} alt={mentor.name} className="h-10 w-10 rounded-full" />
                            <div className="ml-3">
                                <p className="font-medium text-body-lg text-on-surface">{mentor.name}</p>
                                <p className="text-body-sm text-on-surface-variant">{mentor.specialties[0]}</p>
                            </div>
                        </div>
                        <button className="text-sm font-medium text-primary hover:underline">Message</button>
                    </div>
                );
            })}
        </div>
    </Card>
);
