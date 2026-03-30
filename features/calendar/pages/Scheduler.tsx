import React, { useState, useMemo } from 'react';
import { MOCK_CALENDAR_EVENTS } from '../../../constants.ts';
import { CalendarEvent } from '../types.ts';
import { ChevronLeftIcon, ChevronRightIcon, CalendarPlusIcon, ZoomIcon } from '../../../components/icons.tsx';

// Constants for Event Styling
const EVENT_STYLES = {
    session: 'bg-primary text-on-primary',
    task: 'bg-secondary text-on-secondary',
    reminder: 'bg-tertiary text-on-tertiary',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Scheduler component for viewing and managing calendar events.
 * Displays a month view with support for navigating between months.
 */
const Scheduler: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Calculate calendar grid boundaries
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

    const days = [];
    let day = startDate;
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }

    /**
     * Groups events by date string for efficient O(1) lookup during rendering.
     */
    const eventsByDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        MOCK_CALENDAR_EVENTS.forEach(event => {
            const dateKey = event.date.toDateString();
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)!.push(event);
        });
        return map;
    }, [MOCK_CALENDAR_EVENTS]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    };

    /**
     * Helper to determine Tailwind classes for event types.
     */
    const getEventStyle = (type: CalendarEvent['type']) => {
        return EVENT_STYLES[type] || 'bg-gray-200 text-gray-800';
    };

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant"
                        aria-label="Previous Month"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <h2 className="text-headline-sm text-on-surface w-48 text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={() => changeMonth(1)}
                        className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant"
                        aria-label="Next Month"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                </div>
                <button className="flex items-center bg-primary text-on-primary px-4 py-2 rounded-full hover:shadow-md transition-all text-label-lg font-medium">
                    <CalendarPlusIcon className="h-5 w-5 mr-2" />
                    Book New Session
                </button>
            </div>

            <div
                className="grid grid-cols-7 gap-px bg-outline overflow-hidden rounded-lg border border-outline"
                role="grid"
            >
                {WEEKDAYS.map(day => (
                    <div key={day} className="text-center font-medium text-on-surface-variant bg-surface-variant p-2 text-sm" role="columnheader">
                        {day}
                    </div>
                ))}

                {days.map(d => {
                    const isToday = d.toDateString() === new Date().toDateString();
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const dayEvents = eventsByDate.get(d.toDateString()) || [];

                    return (
                        <div
                            key={d.toString()}
                            className={`p-2 h-36 flex flex-col bg-surface ${!isCurrentMonth ? 'bg-surface-variant/30' : ''}`}
                            role="gridcell"
                            aria-label={`${d.toDateString()} with ${dayEvents.length} events`}
                        >
                            <div className={`text-sm font-medium ${isToday ? 'text-on-primary bg-primary rounded-full w-6 h-6 flex items-center justify-center' : isCurrentMonth ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                {d.getDate()}
                            </div>
                            <div className="mt-1 flex-grow overflow-y-auto text-xs space-y-1">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={`p-1 rounded flex items-center ${getEventStyle(event.type)}`}
                                        title={event.title}
                                    >
                                        {event.isZoom && <ZoomIcon className="h-3 w-3 mr-1 flex-shrink-0" />}
                                        <span className="truncate">{event.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Scheduler;
