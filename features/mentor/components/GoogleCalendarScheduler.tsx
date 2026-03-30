import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Globe, Clock, Info } from 'lucide-react';

interface GoogleCalendarSchedulerProps {
    mentorName: string;
    mentorAvatar?: string;
    onSchedule: (date: string, time: string) => void;
}

export const GoogleCalendarScheduler: React.FC<GoogleCalendarSchedulerProps> = ({ mentorName, mentorAvatar, onSchedule }) => {
    const [selectedDate, setSelectedDate] = useState<number | null>(26); // Default to 26th (Today)
    const [viewDate, setViewDate] = useState(new Date(2026, 0, 26)); // Jan 26, 2026

    // Mock availability based on the screenshot
    const availability: Record<number, string[]> = {
        26: [],
        27: ['11:00 am'],
        28: [],
        29: ['7:00 pm'],
        30: [],
        31: [],
        1: []
    };

    const days = [
        { day: 'Mon', date: 26, month: 'Jan' },
        { day: 'Tue', date: 27, month: 'Jan' },
        { day: 'Wed', date: 28, month: 'Jan' },
        { day: 'Thu', date: 29, month: 'Jan' },
        { day: 'Fri', date: 30, month: 'Jan' },
        { day: 'Sat', date: 31, month: 'Jan' },
        { day: 'Sun', date: 1, month: 'Feb' },
    ];

    return (
        <div className="bg-[#FEF7E6] rounded-lg shadow-sm border border-[#EBE3D0] max-w-4xl mx-auto overflow-hidden font-sans">
            {/* Header */}
            <div className="p-6 border-b border-[#EBE3D0] flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {mentorAvatar ? (
                        <img src={mentorAvatar} alt={mentorName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xl font-bold">
                            {mentorName.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-medium text-gray-900 mb-1">PGN Mentor Session with {mentorName}</h2>
                    <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>60 min appointments</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            1-Hour Mentor Session (Not Masterminds). It will be booked monthly for Elevate clients and bi-monthly for scale clients.
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Interface */}
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg text-gray-800">Select an appointment time</h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        (GMT-05:00) Eastern Time - New York
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
                    {/* Left: Mini Calendar Month View */}
                    <div className="hidden md:block">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="text-sm font-medium text-gray-700">January 2026</span>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                                <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        </div>
                        {/* Mini Grid */}
                        <div className="grid grid-cols-7 text-center gap-y-2 text-xs">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-gray-400 font-medium">{d}</div>)}
                            {/* Mock days for Jan 2026 */}
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                <div
                                    key={d}
                                    className={`
                                        w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors
                                        ${d === 26 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' : 'text-gray-700'}
                                    `}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Week/Slot View */}
                    <div className="relative">
                        {/* Navigation */}
                        <div className="flex items-center justify-end mb-4">
                            {/* Only show week nav here */}
                            <div className="flex">
                                <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
                                <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
                            </div>
                        </div>

                        {/* Days Row */}
                        <div className="grid grid-cols-7 text-center mb-2">
                            {days.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 mb-2">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{d.day}</span>
                                    <div className={`
                                        w-10 h-10 flex items-center justify-center rounded-full text-lg cursor-pointer transition-colors
                                        ${d.date === 26 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
                                        ${selectedDate === d.date ? 'ring-2 ring-offset-2 ring-blue-600' : ''}
                                    `}
                                        onClick={() => setSelectedDate(d.date)}
                                    >
                                        {d.date}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Slots Grid */}
                        <div className="grid grid-cols-7 gap-2 min-h-[200px]">
                            {days.map((d, i) => {
                                const slots = availability[d.date] || [];
                                return (
                                    <div key={i} className="flex flex-col items-center gap-3 pt-2 border-t border-gray-100">
                                        {slots.length > 0 ? (
                                            slots.map((slot, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => onSchedule(new Date(2026, 0, d.date).toISOString().split('T')[0], slot)}
                                                    className="w-full py-2 px-1 text-blue-600 border border-blue-200 bg-white rounded-md text-xs font-bold hover:bg-blue-50 hover:border-blue-600 transition-all shadow-sm"
                                                >
                                                    {slot}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="w-2 h-0.5 bg-gray-200 mt-4" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                    <button className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                        <Info className="w-3 h-3" />
                        Report abuse
                    </button>
                </div>
            </div>

            <div className="p-4 text-center border-t border-[#EBE3D0]">
                <p className="text-xs text-gray-500">
                    Powered by <span className="text-gray-700 font-medium">Google Calendar appointment scheduling</span>
                </p>
            </div>
        </div>
    );
};
