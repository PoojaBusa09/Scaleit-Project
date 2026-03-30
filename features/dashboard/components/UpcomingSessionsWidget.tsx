
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon } from '../../../components/icons.tsx';
import { Session } from '../../../types.ts';
import { Card, CardHeader } from './Card.tsx';

export const UpcomingSessionsWidget: React.FC<{ sessions: Session[], inEditMode?: boolean }> = ({ sessions, inEditMode }) => {
    const upcoming = sessions.filter(s => new Date(s.date) >= new Date() && !s.attended).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return (
        <Card isDraggable={inEditMode}>
            <CardHeader icon={CalendarIcon} title="Upcoming Sessions" inEditMode={inEditMode}>
                <Link to="/sessions" className="text-sm font-medium text-primary hover:underline transition-all active:scale-95">View All</Link>
            </CardHeader>
            <div className="space-y-4">
                {upcoming.slice(0, 2).map(session => (
                    <div key={session.id}>
                        <p className="font-medium text-title-sm text-on-surface">{session.title}</p>
                        <div className="flex items-center text-body-sm text-on-surface-variant mt-1">
                            <ClockIcon className="h-4 w-4 mr-1.5" />
                            {session.date} at {session.time}
                        </div>
                        <button className="mt-3 w-full text-label-lg font-medium bg-primary text-on-primary py-2.5 rounded-full hover:shadow-lg transition-all active:scale-95 transform hover:scale-[1.02]">Join with Zoom</button>
                    </div>
                ))}
                {upcoming.length === 0 && <p className="text-body-md text-on-surface-variant">No upcoming sessions scheduled.</p>}
            </div>
        </Card>
    );
};
