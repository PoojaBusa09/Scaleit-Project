
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Video, Clock, ChevronRight } from 'lucide-react';
import { Session } from '../../../types.ts';

interface LiveWeeklyScheduleProps {
    sessions: Session[];
    hideWrapper?: boolean;
}

export const LiveWeeklySchedule: React.FC<LiveWeeklyScheduleProps> = ({ sessions, hideWrapper = false }) => {
    // Generate next 5 days
    const days = useMemo(() => {
        const result = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            result.push(d);
        }
        return result;
    }, []);

    const getSessionsForDay = (date: Date) => {
        return sessions.filter(s => {
            const sDate = new Date(s.scheduledAt);
            return sDate.getDate() === date.getDate() &&
                sDate.getMonth() === date.getMonth() &&
                sDate.getFullYear() === date.getFullYear();
        });
    };

    const content = (
        <div className="p-3 grid grid-cols-1 md:grid-cols-5 gap-2">
            {days.map((date, index) => {
                const isToday = index === 0;
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();
                const daysSessions = getSessionsForDay(date);
                const hasSessions = daysSessions.length > 0;

                return (
                    <div
                        key={index}
                        className={`
                            relative flex flex-col rounded-xl p-1.5 border transition-all duration-300 min-h-[110px]
                            ${isToday ? 'bg-blue-50/30 border-blue-200 ring-2 ring-blue-50/50' : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-sm'}
                            ${isToday && hasSessions ? 'shadow-blue-100 shadow-md' : ''}
                        `}
                    >
                        {/* Date Header */}
                        <div className="flex justify-between items-start mb-2">
                            <div className={`text-center min-w-[3rem] ${isToday ? 'bg-blue-600 text-white shadow transform scale-105' : 'bg-slate-50 text-slate-600'} rounded-lg p-1.5 transition-all`}>
                                <span className="block text-[10px] font-black uppercase opacity-90 leading-none mb-1">{dayName}</span>
                                <span className="block text-xl font-black leading-none">{dayNum}</span>
                            </div>
                            {isToday && <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full border border-blue-200 shadow-sm">TODAY</span>}
                        </div>

                        {/* Sessions List */}
                        <div className="space-y-2 flex-grow flex flex-col justify-end">
                            {hasSessions ? (
                                daysSessions.map(session => (
                                    <div key={session.id} className={`
                                        group relative border rounded-xl p-2 shadow-sm transition-all cursor-pointer bg-white mb-2 last:mb-0
                                        ${isToday ? 'bg-slate-900 border-slate-700 text-white overflow-hidden shadow-md' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'}
                                    `}>
                                        {/* Background Accents for Today's Card */}
                                        {isToday && (
                                            <>
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
                                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none" />
                                            </>
                                        )}

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <Clock className={`w-3 h-3 ${isToday ? 'text-blue-400' : 'text-blue-600'}`} />
                                                <span className={`text-xs font-black ${isToday ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isToday && <span className="text-[9px] font-black bg-amber-500 text-slate-900 px-1 py-0.5 rounded ml-auto shadow-sm">IN 29M</span>}
                                            </div>
                                            <p className={`text-xs font-bold line-clamp-2 leading-tight mb-2 transition-colors ${isToday ? 'text-white' : 'text-slate-700 group-hover:text-blue-700'}`}>
                                                {session.title}
                                            </p>

                                            {/* Action Button (Join/View) */}
                                            {isToday ? (
                                                <button className="w-full text-[10px] font-black bg-white text-slate-900 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 shadow-sm">
                                                    <Video className="w-4 h-4 text-blue-600" />
                                                    JOIN PREVIEW
                                                </button>
                                            ) : (
                                                <div className="flex -space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-5 h-5 rounded-full bg-slate-200 border border-white text-[8px] flex items-center justify-center font-bold text-slate-500">
                                                        M
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-16 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-lg">
                                    <span className="text-slate-300 text-[10px] font-medium uppercase tracking-wide">No Events</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    if (hideWrapper) return content;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-base leading-tight">Your Week Ahead</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Upcoming sessions and events</p>
                    </div>
                </div>
                <Link to="/sessions" className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide flex items-center gap-1 transition-colors">
                    Full Calendar
                    <ChevronRight className="w-3 h-3" />
                </Link>
            </div>
            {content}
        </div>
    );
};
