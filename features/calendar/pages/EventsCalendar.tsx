
import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { SearchIcon, RotateCcwIcon, MapPinIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, CalendarIcon, ListIcon, LayoutGridIcon } from '../../../components/icons.tsx';
import { MOCK_PLATFORM_EVENTS } from '../../../constants.ts';
import { PlatformEvent } from '../types.ts';

// Constants
const ITEMS_PER_PAGE = 10;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Prop types for the EventDetailsModal component.
 */
interface EventDetailsModalProps {
    event: PlatformEvent | null;
    onClose: () => void;
}

/**
 * Modal component to display detailed information about a selected event.
 * 
 * @param {PlatformEvent | null} event - The event object to display.
 * @param {() => void} onClose - Callback function to close the modal.
 */
const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up-fast"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-surface rounded-xl shadow-2xl w-full max-w-lg border border-outline/10 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start p-6 border-b border-outline/10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                {event.isPast ? 'Past Event' : 'Upcoming'}
                            </span>
                            <span className="text-sm text-on-surface-variant">{event.timeZone}</span>
                        </div>
                        <h3 id="modal-title" className="text-xl font-bold text-on-surface leading-tight">{event.title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 -mt-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant"
                        aria-label="Close modal"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-lg flex flex-col items-center justify-center border border-sky-200">
                            <span className="text-xs font-bold uppercase">{event.month}</span>
                            <span className="text-2xl font-bold">{event.day}</span>
                        </div>
                        <div>
                            <div className="flex items-center text-on-surface font-medium mb-1">
                                <ClockIcon className="h-4 w-4 mr-2 text-primary" />
                                {event.time}
                            </div>
                            <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-2 text-primary" />
                                <a href={event.locationUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline text-sm font-medium">
                                    {event.locationType === 'Zoom' ? 'Join via Zoom' : event.locationType === 'RSVP' ? 'RSVP Required' : 'View Link'}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-variant/30 p-4 rounded-lg border border-outline/10">
                        <h4 className="text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">Description</h4>
                        <p className="text-body-md text-on-surface-variant leading-relaxed">
                            {event.description || "No specific details provided for this event. Please check the link or contact support for more information."}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-surface-variant/20 border-t border-outline/10 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-variant transition-colors mr-2">
                        Close
                    </button>
                    {!event.isPast && (
                        <a href={event.locationUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 shadow-md transition-all flex items-center">
                            {event.locationType === 'RSVP' ? 'RSVP Now' : 'Join Event'}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Prop types for the CalendarGrid component.
 */
interface CalendarGridProps {
    events: PlatformEvent[];
    onEventClick: (e: PlatformEvent) => void;
}

/**
 * Renders a calendar grid view of events.
 * 
 * @param {PlatformEvent[]} events - List of events to display.
 * @param {(e: PlatformEvent) => void} onEventClick - Callback when an event is clicked.
 */
const CalendarGrid: React.FC<CalendarGridProps> = ({ events, onEventClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }

    /**
     * Filters events for a specific date.
     * Note: Current mock data implementation uses loose string matching (Month Name + Day string).
     * In a production environment, this should be replaced with precise Date object comparisons.
     */
    const getEventsForDate = (date: Date) => {
        return events.filter(e => {
            const eMonthIndex = MONTH_NAMES.indexOf(e.month);
            // Assuming current year for mock data to simplify matching
            return eMonthIndex === date.getMonth() && parseInt(e.day) === date.getDate();
        });
    };

    const changeMonth = (amount: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + amount, 1));
    };

    return (
        <div className="animate-fade-in-up-fast">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant"
                    aria-label="Previous month"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-bold text-on-surface">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button
                    onClick={() => changeMonth(1)}
                    className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant"
                    aria-label="Next month"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 border border-outline/20 rounded-lg overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="bg-surface-variant/30 py-2 text-center text-sm font-bold text-on-surface-variant border-b border-r border-outline/10 last:border-r-0">
                        {d}
                    </div>
                ))}
                {days.map((d, i) => {
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const dayEvents = getEventsForDate(d);
                    const isToday = new Date().toDateString() === d.toDateString();

                    return (
                        <div
                            key={i}
                            className={`min-h-[120px] p-2 bg-surface border-b border-r border-outline/10 relative ${!isCurrentMonth ? 'bg-surface-variant/10' : ''}`}
                        >
                            <span className={`text-sm font-bold ${isToday ? 'bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center' : 'text-on-surface-variant'}`}>
                                {d.getDate()}
                            </span>
                            <div className="mt-2 space-y-1">
                                {dayEvents.map(ev => (
                                    <button
                                        key={ev.id}
                                        onClick={() => onEventClick(ev)}
                                        className="w-full text-left text-xs px-2 py-1 rounded bg-secondary/10 text-primary hover:bg-secondary/20 truncate font-medium border-l-2 border-secondary block"
                                    >
                                        {ev.time.split(' ')[0]} {ev.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * Main Events Calendar page component.
 * Displays a list or grid of events with filtering and pagination capabilities.
 */
const EventsCalendar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState<PlatformEvent | null>(null);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, view]);

    // Filter events based on search term and view mode
    const filteredEvents = useMemo(() => {
        return MOCK_PLATFORM_EVENTS.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase());

            // Simple filter logic: in list mode, respect upcoming/past toggle.
            // In calendar mode, show all filtered by search (or could be enhanced to show all).
            const matchesView = viewMode === 'list' ? (view === 'upcoming' ? !event.isPast : event.isPast) : true;

            return matchesSearch && matchesView;
        });
    }, [searchTerm, view, viewMode]);

    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <PageHeader
                title="Events Calendar"
                description="Stay updated with upcoming coaching sessions, webinars, and community events."
            />
            <div className="bg-surface rounded-lg shadow-sm border border-outline/20 overflow-hidden min-h-[80vh] flex flex-col">
                {/* Header Controls */}
                <div className="p-6 border-b border-outline/20 flex flex-col xl:flex-row justify-between items-center gap-4 bg-background/50">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <span className="text-sm font-bold text-on-surface-variant whitespace-nowrap hidden sm:inline">Find event</span>
                        <div className="relative w-full md:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-outline/30 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-surface transition-shadow text-on-surface placeholder:text-on-surface-variant/50"
                                aria-label="Search events"
                            />
                        </div>
                        <button
                            onClick={() => { setSearchTerm(''); setView('upcoming'); }}
                            className="flex items-center px-4 py-2 bg-surface border border-outline/20 rounded-md text-sm font-bold text-on-surface hover:bg-surface-variant transition-colors"
                        >
                            <RotateCcwIcon className="h-4 w-4 mr-2" />
                            Reset
                        </button>
                    </div>

                    <div className="flex gap-4 items-center">
                        {/* View Switcher */}
                        <div className="flex bg-surface-variant/30 p-1 rounded-lg border border-outline/10">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-surface shadow text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                title="List View"
                                aria-label="Switch to list view"
                            >
                                <ListIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-surface shadow text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                                title="Calendar View"
                                aria-label="Switch to calendar view"
                            >
                                <LayoutGridIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Filter Toggles (List View Only) */}
                        {viewMode === 'list' && (
                            <div className="flex bg-surface-variant/50 p-1 rounded-lg border border-outline/10">
                                <button
                                    onClick={() => setView('upcoming')}
                                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 ${view === 'upcoming'
                                        ? 'bg-primary text-on-primary shadow-sm'
                                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
                                        }`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() => setView('past')}
                                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 ${view === 'past'
                                        ? 'bg-secondary text-on-secondary shadow-sm'
                                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
                                        }`}
                                >
                                    Past
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-surface flex flex-col p-6">
                    {viewMode === 'calendar' ? (
                        <CalendarGrid events={filteredEvents} onEventClick={setSelectedEvent} />
                    ) : (
                        <>
                            {/* Events List */}
                            <div className="flex-1">
                                {currentEvents.length > 0 ? (
                                    currentEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="group border-b border-outline/10 hover:bg-surface-variant/20 transition-colors p-6 flex flex-col md:flex-row items-start md:items-center gap-6 animate-fade-in-up-fast"
                                        >
                                            {/* Date Box */}
                                            <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center shadow-sm border ${event.isPast
                                                ? 'bg-surface-variant text-on-surface-variant border-outline/20'
                                                : 'bg-sky-50 text-sky-700 border-sky-100'
                                                }`}>
                                                <span className="text-xs font-bold uppercase tracking-wider">{event.month}</span>
                                                <span className="text-2xl font-bold">{event.day}</span>
                                            </div>

                                            {/* Event Details */}
                                            <div
                                                className="flex-1 min-w-0 cursor-pointer"
                                                onClick={() => setSelectedEvent(event)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        setSelectedEvent(event);
                                                    }
                                                }}
                                            >
                                                <h3 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                                                    {event.title}
                                                </h3>
                                                <div className="flex flex-col gap-1.5 mt-2">
                                                    <div className="flex items-center text-sm font-medium text-on-surface-variant">
                                                        <ClockIcon className="h-4 w-4 mr-2 text-primary/70" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    <a
                                                        href={event.locationUrl}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-sm text-sky-600 hover:underline flex items-center w-fit font-medium"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MapPinIcon className="h-4 w-4 mr-2" />
                                                        {event.locationType === 'Zoom' ? 'Zoom Link' : event.locationType === 'RSVP' ? 'RSVP Required' : 'Event Link'}
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex flex-col items-end gap-3 min-w-[140px] mt-4 md:mt-0">
                                                <button
                                                    onClick={() => setSelectedEvent(event)}
                                                    className="px-6 py-2 border border-outline/30 rounded-lg text-sm font-bold text-on-surface hover:border-primary hover:text-primary hover:bg-primary/5 transition-all w-full md:w-auto"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-on-surface-variant/60">
                                        <CalendarIcon className="h-16 w-16 mb-4 opacity-20" />
                                        <p className="text-lg font-bold">No events found.</p>
                                        <p className="text-sm font-medium">Try adjusting your search or filters.</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls (Only for List View) */}
                            {totalPages > 1 && (
                                <div className="pt-4 border-t border-outline/20 bg-surface flex items-center justify-between">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-variant rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeftIcon className="h-4 w-4 mr-2" />
                                        Previous
                                    </button>

                                    <span className="text-sm text-on-surface-variant font-medium">
                                        Page <span className="font-bold text-on-surface">{currentPage}</span> of <span className="font-bold text-on-surface">{totalPages}</span>
                                    </span>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-variant rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {/* Event Details Modal */}
            <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
    );
};

export default EventsCalendar;
