
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Session } from '../../../types';
import { Link } from 'react-router-dom';

interface CalendarViewProps {
    sessions: Session[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ sessions }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<{ date: Date; sessions: any[] } | null>(null);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Generate calendar days
    const days = [];
    // Previous month padding
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const getSessionsForDate = (date: Date) => {
        return sessions.filter(session => {
            const sessionDate = new Date(session.scheduledAt);
            return sessionDate.getDate() === date.getDate() &&
                sessionDate.getMonth() === date.getMonth() &&
                sessionDate.getFullYear() === date.getFullYear();
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="px-3 py-1 flex items-center justify-between border-b border-gray-100 bg-gray-50/50 flex-none min-h-[40px]">
                <h2 className="text-sm font-serif font-bold text-gray-900 uppercase tracking-widest">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevMonth}
                        className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 hover:shadow-sm border border-transparent hover:border-gray-200"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-2 py-1 text-xs font-semibold text-primary hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm mx-1"
                    >
                        Today
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-white rounded-md transition-colors text-gray-600 hover:shadow-sm border border-transparent hover:border-gray-200"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-white flex-none">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-1 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 grid-rows-6 bg-gray-100 gap-[1px] flex-1 min-h-0">
                {days.map((date, index) => {
                    // MOCK DATA INJECTION FOR DEMO (JAN 2026)
                    let sessionsForDay = date ? getSessionsForDate(date) : [];

                    // Inject extra mock sessions for specific days in Jan 2026 for demonstration
                    if (date && date.getMonth() === 0 && date.getFullYear() === 2026) {
                        const dayNum = date.getDate();
                        if (dayNum === 15) { // 2 sessions
                            sessionsForDay = [...sessionsForDay,
                            { id: 'm1', title: 'Strategy Sync', scheduledAt: new Date(2026, 0, 15, 10, 0).toISOString(), duration: 60, status: 'scheduled', mentorName: 'Sarah', memberName: 'Me' },
                            { id: 'm2', title: 'Q1 Review', scheduledAt: new Date(2026, 0, 15, 14, 0).toISOString(), duration: 60, status: 'scheduled', mentorName: 'Sarah', memberName: 'Me' }
                            ];
                        }
                        if (dayNum === 20) { // 3 sessions
                            sessionsForDay = [...sessionsForDay,
                            { id: 'm3', title: 'Team Huddle', scheduledAt: new Date(2026, 0, 20, 9, 30).toISOString(), duration: 30, status: 'scheduled', mentorName: 'Sarah', memberName: 'Me' },
                            { id: 'm4', title: 'Client Prep', scheduledAt: new Date(2026, 0, 20, 13, 0).toISOString(), duration: 60, status: 'scheduled', mentorName: 'Sarah', memberName: 'Me' },
                            { id: 'm5', title: 'Wrap Up', scheduledAt: new Date(2026, 0, 20, 16, 30).toISOString(), duration: 30, status: 'scheduled', mentorName: 'Sarah', memberName: 'Me' }
                            ];
                        }
                        if (dayNum === 22) { // 5 sessions (overflow)
                            sessionsForDay = [...sessionsForDay,
                            { id: 'm6', title: 'Morning Standup', scheduledAt: new Date(2026, 0, 22, 9, 0).toISOString(), duration: 15, status: 'scheduled' },
                            { id: 'm7', title: 'Design Review', scheduledAt: new Date(2026, 0, 22, 10, 30).toISOString(), duration: 60, status: 'scheduled' },
                            { id: 'm8', title: 'Lunch Sync', scheduledAt: new Date(2026, 0, 22, 12, 30).toISOString(), duration: 45, status: 'scheduled' },
                            { id: 'm9', title: 'Dev Sync', scheduledAt: new Date(2026, 0, 22, 14, 0).toISOString(), duration: 60, status: 'scheduled' },
                            { id: 'm10', title: 'Client Call', scheduledAt: new Date(2026, 0, 22, 16, 0).toISOString(), duration: 60, status: 'scheduled' }
                            ] as any;
                        }
                    }

                    // Sort by time
                    sessionsForDay.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

                    // Display Logic
                    const MAX_VISIBLE = 1; // Show 1 items then "+X more"
                    const hasMore = sessionsForDay.length > MAX_VISIBLE;
                    const visibleSessions = hasMore ? sessionsForDay.slice(0, MAX_VISIBLE) : sessionsForDay;

                    return (
                        <div
                            key={index}
                            className={`bg-white p-1.5 relative group ${!date ? 'bg-gray-50' : ''} flex flex-col`}
                            onClick={() => {
                                if (date && sessionsForDay.length > 0) {
                                    // Could trigger day view here
                                    setSelectedDay({ date, sessions: sessionsForDay });
                                }
                            }}
                        >
                            {date && (
                                <>
                                    <span className={`
                                        inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1 flex-shrink-0
                                        ${isToday(date)
                                            ? 'bg-primary text-white shadow-md transform scale-105'
                                            : 'text-gray-700 group-hover:bg-gray-100'}
                                    `}>
                                        {date.getDate()}
                                    </span>

                                    {/* Overflow Badge */}
                                    {hasMore && (
                                        <div className="absolute top-1.5 right-1.5">
                                            <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-200">
                                                +{sessionsForDay.length - MAX_VISIBLE}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex-1 flex flex-col gap-1 min-h-0 overflow-hidden">
                                        {visibleSessions.map((session, i) => {
                                            const isPast = new Date(session.scheduledAt) < new Date();
                                            const attended = session.status === 'completed';
                                            let statusColor = 'bg-blue-50 text-blue-700 border-blue-100';
                                            if (attended) statusColor = 'bg-green-50 text-green-700 border-green-100';
                                            if (isPast && !attended) statusColor = 'bg-red-50 text-red-600 border-red-100';

                                            return (
                                                <div
                                                    key={session.id || i}
                                                    className={`
                                                        px-2 py-1.5 rounded-md border text-xs truncate cursor-pointer shadow-sm
                                                        ${statusColor} hover:brightness-95 transition-all
                                                    `}
                                                    title={session.title}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Navigate or open modal
                                                    }}
                                                >
                                                    <div className="font-semibold truncate leading-tight">{session.title}</div>
                                                    <div className="flex items-center gap-1 opacity-80 text-[10px] leading-tight mt-0.5 font-medium">
                                                        <span>{new Date(session.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Day Details Popover/Modal */}
            {selectedDay && (
                <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-[1px] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">
                                {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-2 max-h-[60vh] overflow-y-auto space-y-2">
                            {selectedDay.sessions.map((session: any, i: number) => (
                                <Link
                                    to={`/sessions/${session.id}`}
                                    key={i}
                                    className="block p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-blue-50/50 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="font-semibold text-sm text-gray-900 group-hover:text-primary">{session.title}</span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                            {new Date(session.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {session.duration}m
                                        </span>
                                        {session.memberName && <span>• with {session.memberName}</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="w-full py-2 text-center text-xs font-medium text-gray-600 hover:text-gray-900"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="absolute inset-0 -z-10" onClick={() => setSelectedDay(null)} />
                </div>
            )}
        </div>
    );
};
