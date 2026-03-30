/**
 * Enhanced Sessions Page
 * Comprehensive session management with:
 * - 3 tabs: Upcoming, My RSVPs, Completed
 * - Streamlined columns (removed Participants, Duration, Status on Upcoming)
 * - Session type color coding (mentor vs PGN events)
 * - Expanded three-dot menu with RSVP, Reschedule, Notifications
 * - Calendar view toggle
 * - Filters for session type and attendance
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SESSIONS } from '../../../data/mockSessions.ts';
import { Session } from '../../../types.ts';
import {
    Calendar,
    List,
    Video,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Play,
    ChevronRight,
    ChevronLeft,
    Search,
    ArrowUpDown,
    Mic,
    ExternalLink,
    X,
    MoreHorizontal,
    Bell,
    BellOff,
    CalendarClock,
    Check,
    HelpCircle,
    Star,
    Heart,
    Info,
    Filter,
    ChevronDown
} from 'lucide-react';

import { GoogleCalendarScheduler } from '../components/GoogleCalendarScheduler.tsx';
import { MOCK_MENTORS } from '../../../data/mockMentors.ts';
import { MOCK_USER } from '../../../data/mockUsers.ts';

// =============================================================================
// Types
// =============================================================================

type TabType = 'upcoming' | 'rsvps' | 'completed' | 'favorites';
type EventFilter = 'all' | 'mentor' | 'pgn';
type AttendanceFilter = 'all' | 'attended' | 'not_attended';

// =============================================================================
// Category Labels & Colors
// =============================================================================

const CATEGORY_LABELS: Record<string, string> = {
    strategy: 'Strategy Session',
    mastermind: 'Mastermind',
    lab_workshop: 'Lab / Workshop',
    huddle: 'Huddle',
    custom: 'Custom'
};

const CATEGORY_COLORS: Record<string, string> = {
    strategy: 'bg-blue-100 text-blue-700',
    mastermind: 'bg-purple-100 text-purple-700',
    lab_workshop: 'bg-amber-100 text-amber-700',
    huddle: 'bg-emerald-100 text-emerald-700',
    custom: 'bg-gray-100 text-gray-700'
};

// =============================================================================
// Enhanced Sessions
// =============================================================================

const ENHANCED_SESSIONS = MOCK_SESSIONS.map((s, i) => ({
    ...s,
    zoomLink: s.status === 'completed' || s.status === 'scheduled' ? `https://zoom.us/j/123456789${i}` : undefined,
    recordingUrl: s.status === 'completed' && s.recordingStatus === 'ready' ? `https://zoom.us/rec/share/abc${i}` : undefined,
    aiSummary: s.transcript ? {
        executiveSummary: 'Discussed Q3 marketing strategy with 15% lead increase. Key focus on CRM selection and sales capacity.',
        keyPoints: ['15% increase in leads', 'Need CRM solution', 'Product launch by next Friday'],
        decisions: ['Research CRM options', 'Hire additional salesperson'],
        actionItems: [
            { text: 'Research and select CRM tool', owner: 'Alexandre', dueDate: '2025-07-22' },
            { text: 'Finalize product launch plan', owner: 'Alexandre', dueDate: '2025-07-22' }
        ]
    } : undefined,
    mentorName: s.mentorName || 'Jordan Lee',
    memberName: s.memberName || 'Alexandre Dubois'
}));

// =============================================================================
// Schedule Modal
// =============================================================================

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (session: Partial<Session>) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onSchedule }) => {
    const userMentorName = MOCK_USER.mentors[0];
    const userMentor = MOCK_MENTORS.find(m => m.name === userMentorName) || MOCK_MENTORS[0];

    const handleSlotSelection = (date: string, time: string) => {
        if (window.confirm(`Schedule session with ${userMentor.name} on ${date} at ${time}?`)) {
            const scheduledAt = new Date(`${date}T${time}`).toISOString();
            onSchedule({
                title: 'Strategy Session',
                scheduledAt: scheduledAt,
                duration: 60,
                mentorName: userMentor.name
            } as Partial<Session>);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-2 flex justify-end">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="pb-8 px-4 sm:px-8">
                    <GoogleCalendarScheduler
                        mentorName={userMentor.name}
                        mentorAvatar={userMentor.avatarUrl}
                        onSchedule={handleSlotSelection}
                    />
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// RSVP Dialog
// =============================================================================

const RSVPDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    session: typeof ENHANCED_SESSIONS[0] | null;
    onRSVP: (status: 'confirmed' | 'maybe' | 'declined') => void;
}> = ({ isOpen, onClose, session, onRSVP }) => {
    if (!isOpen || !session) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scaleIn">
                <h3 className="font-bold text-gray-900 text-lg mb-2">RSVP</h3>
                <p className="text-sm text-gray-600 mb-6">
                    {session.title} — {new Date(session.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => { onRSVP('confirmed'); onClose(); }}
                        className="flex-1 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Check className="w-4 h-4" /> Accept
                    </button>
                    <button
                        onClick={() => { onRSVP('maybe'); onClose(); }}
                        className="flex-1 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <HelpCircle className="w-4 h-4" /> Maybe
                    </button>
                    <button
                        onClick={() => { onRSVP('declined'); onClose(); }}
                        className="flex-1 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" /> Decline
                    </button>
                </div>
                <button onClick={onClose} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
        </div>
    );
};

// =============================================================================
// Helper Components
// =============================================================================

// =============================================================================
// Simple Reschedule Modal (Mock)
// =============================================================================

const RescheduleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    session: typeof ENHANCED_SESSIONS[0] | null;
}> = ({ isOpen, onClose, session }) => {
    if (!isOpen || !session) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scaleIn">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Reschedule Session</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Rescheduling <span className="font-medium text-gray-900">{session.title}</span>.
                    Please select a new proposed time.
                </p>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">New Date</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">New Time</label>
                        <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={2} placeholder="Optional reason..."></textarea>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                    <button onClick={() => { alert('Reschedule request sent!'); onClose(); }} className="flex-1 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                        Confirm Change
                    </button>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// Notification Settings Modal
// =============================================================================

const NotificationSettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    session: typeof ENHANCED_SESSIONS[0] | null;
}> = ({ isOpen, onClose, session }) => {
    if (!isOpen || !session) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-scaleIn">
                <h3 className="font-bold text-gray-900 text-lg mb-2">Notification Preferences</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Manage alerts for <span className="font-medium text-gray-900">{session.title}</span>.
                </p>

                <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                        <span className="text-sm text-gray-700">Email Reminders</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                        <span className="text-sm text-gray-700">Push Notifications</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                        <span className="text-sm text-gray-700">SMS Alerts</span>
                    </label>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                    <button onClick={() => { alert('Preferences saved!'); onClose(); }} className="flex-1 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    count?: number;
}> = ({ active, onClick, children, count }) => (
    <button
        onClick={onClick}
        className={`relative pb-3.5 px-1 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
    >
        {children}
        {count !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                {count}
            </span>
        )}
        {active && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(12,35,64,0.2)]" />
        )}
    </button>
);

// =============================================================================
// Session Row
// =============================================================================

const SessionRow: React.FC<{
    session: typeof ENHANCED_SESSIONS[0];
    activeTab: TabType;
    onView: () => void;
    onMenuAction: (action: string, session: typeof ENHANCED_SESSIONS[0]) => void;
}> = ({ session, activeTab, onView, onMenuAction }) => {
    const sessionDate = new Date(session.scheduledAt);
    const endTime = session.endedAt
        ? new Date(session.endedAt)
        : new Date(sessionDate.getTime() + (session.duration || 60) * 60000);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Close menu on outside click
    React.useEffect(() => {
        if (!showMenu) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMenu]);

    const isUpcoming = activeTab === 'upcoming' || activeTab === 'rsvps';
    const isCompleted = activeTab === 'completed';
    const isFavoritesTab = activeTab === 'favorites';
    // For favorites tab, we need to know the underlying status to show correct actions
    const effectiveStatus = isFavoritesTab ? session.status : (isUpcoming ? 'upcoming' : 'completed');

    const isNotAttended = session.attendance === 'not_attended';
    const isPrivateNotAttended = isNotAttended && !session.isGlobalEvent;

    // Format date with start-end time range
    const dateStr = sessionDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const startTime = sessionDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTimeStr = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const categoryLabel = session.category ? CATEGORY_LABELS[session.category] || session.category : '';
    const categoryColor = session.category ? CATEGORY_COLORS[session.category] || 'bg-gray-100 text-gray-600' : '';

    return (
        <tr className={`border-b border-gray-100 transition-colors ${isPrivateNotAttended ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50'}`}>
            {/* Title Cell */}
            <td className="py-4 pl-4">
                <div className="flex items-center gap-2.5">
                    {/* Color dot: blue for mentor, purple for PGN */}
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${session.isGlobalEvent ? 'bg-purple-500' : 'bg-blue-500'}`} title={session.isGlobalEvent ? 'PGN Event' : 'Mentor Session'} />
                    <div className="min-w-0">
                        <button
                            onClick={isPrivateNotAttended ? undefined : onView}
                            className={`font-semibold text-left block truncate ${isPrivateNotAttended ? 'text-gray-400 cursor-default' : 'text-primary hover:underline'}`}
                            disabled={isPrivateNotAttended}
                        >
                            {session.title}
                        </button>
                        {categoryLabel && (
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColor}`}>
                                {categoryLabel}
                            </span>
                        )}
                        {/* PGN Counts */}
                        {session.isGlobalEvent && (
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                {isUpcoming ? (
                                    session.rsvpCount !== undefined && (
                                        <span className="flex items-center gap-1" title={`${session.rsvpCount} RSVPs`}>
                                            <CheckCircle className="w-3 h-3 text-purple-500" />
                                            {session.rsvpCount} going
                                        </span>
                                    )
                                ) : (
                                    session.attendeeCount !== undefined && (
                                        <span className="flex items-center gap-1" title={`${session.attendeeCount} attended`}>
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            {session.attendeeCount} attended
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </td>

            {/* Date & Time (merged with duration as range) */}
            <td className="py-4 text-sm text-gray-900">
                <div>{dateStr}</div>
                <div className="text-xs text-gray-600 mt-0.5">{startTime} – {endTimeStr}</div>
            </td>

            {/* Attendance/RSVP Status (varies by tab) */}
            {
                isCompleted && (
                    <td className="py-4">
                        {session.attendance === 'attended' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                <CheckCircle className="w-3 h-3" /> Attended
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                <XCircle className="w-3 h-3" /> Not Attended
                            </span>
                        )}
                    </td>
                )
            }

            {
                isFavoritesTab && (
                    <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${session.status === 'scheduled'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                            {session.status === 'scheduled' ? 'Upcoming' : 'Completed'}
                        </span>
                    </td>
                )
            }

            {
                activeTab === 'rsvps' && (
                    <td className="py-4">
                        {session.rsvpStatus === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-200">
                                <Check className="w-3 h-3" /> Confirmed
                            </span>
                        ) : session.rsvpStatus === 'maybe' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                <HelpCircle className="w-3 h-3" /> Maybe
                            </span>
                        ) : null}
                    </td>
                )
            }

            {/* Actions */}
            <td className="py-4 pr-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    {/* Main action button */}
                    {(isUpcoming || (isFavoritesTab && session.status === 'scheduled')) && (
                        <button
                            className="hidden sm:flex px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors items-center gap-1.5"
                        >
                            <Video className="w-3.5 h-3.5" /> Join
                        </button>
                    )}
                    {(isCompleted || (isFavoritesTab && session.status === 'completed')) && session.recordingStatus === 'ready' && (
                        <button
                            onClick={onView}
                            className="hidden sm:inline-flex px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                        >
                            View
                        </button>
                    )}
                    {(isCompleted || (isFavoritesTab && session.status === 'completed')) && session.recordingStatus !== 'ready' && (
                        <span className="hidden sm:inline-block text-xs text-gray-400 italic">No Recording</span>
                    )}

                    {/* Three-dot menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                {/* Mobile-only primary actions */}
                                {(isUpcoming || (isFavoritesTab && session.status === 'scheduled')) && (
                                    <button
                                        onClick={() => { setShowMenu(false); }}
                                        className="sm:hidden w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 font-medium border-b border-gray-100"
                                    >
                                        <Video className="w-4 h-4 text-green-600" /> Join Session
                                    </button>
                                )}
                                {(isCompleted || (isFavoritesTab && session.status === 'completed')) && session.recordingStatus === 'ready' && (
                                    <button
                                        onClick={() => { onView(); setShowMenu(false); }}
                                        className="sm:hidden w-full text-left px-4 py-2 text-sm text-primary hover:bg-blue-50 flex items-center gap-2 font-medium border-b border-gray-100"
                                    >
                                        <Play className="w-4 h-4 text-primary" /> View Recording
                                    </button>
                                )}

                                <button
                                    onClick={() => { onView(); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Info className="w-3.5 h-3.5 text-blue-500" /> Session Details
                                </button>

                                {session.status === 'scheduled' && (
                                    <>
                                        <button
                                            onClick={() => { onMenuAction('rsvp', session); setShowMenu(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Check className="w-3.5 h-3.5 text-green-500" /> RSVP
                                        </button>
                                        {!session.isGlobalEvent && (
                                            <button
                                                onClick={() => { onMenuAction('reschedule', session); setShowMenu(false); }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <CalendarClock className="w-3.5 h-3.5 text-amber-500" /> Reschedule
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { onMenuAction('notifications', session); setShowMenu(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            {session.notificationsEnabled
                                                ? <><BellOff className="w-3.5 h-3.5 text-gray-400" /> Mute Notifications</>
                                                : <><Bell className="w-3.5 h-3.5 text-primary" /> Enable Notifications</>
                                            }
                                        </button>
                                    </>
                                )}

                                <div className="border-t border-gray-100 my-1" />

                                {session.recordingUrl && (
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <Play className="w-3.5 h-3.5 text-red-500" /> Watch Recording
                                    </button>
                                )}
                                {session.transcript && (
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5 text-blue-500" /> View Transcript
                                    </button>
                                )}
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" /> Session Details
                                </button>

                                <button
                                    onClick={() => { onMenuAction('favorite', session); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Heart className={`w-3.5 h-3.5 ${session.isBookmarked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                                    {session.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

// =============================================================================
// Mobile Session Card
// =============================================================================

const MobileSessionCard: React.FC<{
    session: typeof ENHANCED_SESSIONS[0];
    activeTab: TabType;
    onView: () => void;
    onMenuAction: (action: string, session: typeof ENHANCED_SESSIONS[0]) => void;
}> = ({ session, activeTab, onView, onMenuAction }) => {
    const navigate = useNavigate();
    const sessionDate = new Date(session.scheduledAt);
    const dateStr = sessionDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const timeStr = sessionDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    // Close menu on outside click
    React.useEffect(() => {
        if (!showMenu) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMenu]);

    const isUpcoming = activeTab === 'upcoming' || activeTab === 'rsvps';
    const isCompleted = activeTab === 'completed';
    const isFavoritesTab = activeTab === 'favorites';
    const isNotAttended = session.attendance === 'not_attended';
    const isUpcomingSession = session.status === 'upcoming';
    const hasRecording = !!session.recordingUrl;
    const effectiveStatus = isFavoritesTab ? session.status : (isUpcoming ? 'upcoming' : 'completed');

    const sessionCategoryColors: Record<string, string> = {
        strategy: 'bg-blue-500',
        mastermind: 'bg-purple-500',
        technical: 'bg-green-500',
        career: 'bg-orange-500',
        custom: 'bg-gray-400'
    };
    const accentColor = sessionCategoryColors[session.category || 'custom'] || 'bg-gray-400';

    return (
        <div className={`bg-white border-b border-gray-100 last:border-0 group active:bg-gray-50 transition-colors ${isNotAttended && !session.isGlobalEvent ? 'opacity-60 grayscale-[0.5]' : ''}`}>
            <div className="relative py-4 px-4 flex items-start gap-3">
                {/* Category Indicator Dot */}
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${accentColor}`} />

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {CATEGORY_LABELS[session.category || 'custom']}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[11px] font-medium text-gray-500">{timeStr}</span>
                        </div>
                        {/* 3-Dots Menu */}
                        <div className="relative -mt-1 -mr-2" ref={menuRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                    {/* Primary Desktop Actions explicitly added to Android menu */}
                                    {(isUpcoming || (isFavoritesTab && session.status === 'scheduled')) && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 font-medium border-b border-gray-100"
                                        >
                                            <Video className="w-4 h-4 text-green-600" /> Join Session
                                        </button>
                                    )}
                                    {(isCompleted || (isFavoritesTab && session.status === 'completed')) && session.recordingStatus === 'ready' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onView(); setShowMenu(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-blue-50 flex items-center gap-2 font-medium border-b border-gray-100"
                                        >
                                            <Play className="w-4 h-4 text-primary" /> View Recording
                                        </button>
                                    )}

                                    {/* Standard Menu Dropdown items */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onView(); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Info className="w-3.5 h-3.5 text-blue-500" /> Session Details
                                    </button>

                                    {session.status === 'scheduled' && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onMenuAction('rsvp', session); setShowMenu(false); }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <Check className="w-3.5 h-3.5 text-green-500" /> RSVP
                                            </button>
                                            {!session.isGlobalEvent && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onMenuAction('reschedule', session); setShowMenu(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <CalendarClock className="w-3.5 h-3.5 text-amber-500" /> Reschedule
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onMenuAction('notifications', session); setShowMenu(false); }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                {session.notificationsEnabled
                                                    ? <><BellOff className="w-3.5 h-3.5 text-gray-400" /> Mute Notifications</>
                                                    : <><Bell className="w-3.5 h-3.5 text-primary" /> Enable Notifications</>
                                                }
                                            </button>
                                        </>
                                    )}

                                    <div className="border-t border-gray-100 my-1" />

                                    {session.recordingUrl && (
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                            <Play className="w-3.5 h-3.5 text-red-500" /> Watch Recording
                                        </button>
                                    )}
                                    {session.transcript && (
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                            <FileText className="w-3.5 h-3.5 text-blue-500" /> View Transcript
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onMenuAction('favorite', session); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${session.isBookmarked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                                        {session.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="font-serif font-bold text-base text-primary leading-tight mb-2 pr-6">
                        {session.title}
                    </h3>

                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2 text-[13px] text-gray-500">
                            <span className="truncate">{session.memberName}</span>
                            <span className="text-gray-300">•</span>
                            <span>{dateStr}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 ml-2 shrink-0">
                            {session.attendance === 'attended' && (
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">DONE</span>
                            )}
                            {isNotAttended && (
                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">MISSED</span>
                            )}
                            {!isUpcomingSession && hasRecording && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/sessions/${session.id}`);
                                    }}
                                    className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 hover:bg-primary/10"
                                >
                                    WATCH
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// Main Component
// =============================================================================

const EnhancedSessionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventFilter, setEventFilter] = useState<EventFilter>('all');

    const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>('all');
    const [rsvpSession, setRsvpSession] = useState<typeof ENHANCED_SESSIONS[0] | null>(null);
    const [rescheduleSession, setRescheduleSession] = useState<typeof ENHANCED_SESSIONS[0] | null>(null);
    const [notificationSession, setNotificationSession] = useState<typeof ENHANCED_SESSIONS[0] | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: 'title' | 'date' | 'status' | 'attendance'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'asc' });

    // Counts for tabs
    const upcomingCount = useMemo(() => {
        const now = new Date();
        return ENHANCED_SESSIONS.filter(s => new Date(s.scheduledAt) >= now).length;
    }, []);

    const rsvpCount = useMemo(() => {
        const now = new Date();
        return ENHANCED_SESSIONS.filter(s => new Date(s.scheduledAt) >= now && s.rsvpStatus && s.rsvpStatus !== 'declined').length;
    }, []);

    const completedCount = useMemo(() => {
        return ENHANCED_SESSIONS.filter(s => s.status === 'completed').length;
    }, []);

    const favoritesCount = useMemo(() => {
        return ENHANCED_SESSIONS.filter(s => s.isBookmarked).length;
    }, []);

    const filteredSessions = useMemo(() => {
        let sessions = [...ENHANCED_SESSIONS];
        const now = new Date();

        // Tab Filter
        if (viewMode === 'list') {
            switch (activeTab) {
                case 'upcoming':
                    sessions = sessions.filter(s => new Date(s.scheduledAt) >= now);
                    break;
                case 'rsvps':
                    sessions = sessions.filter(s => new Date(s.scheduledAt) >= now && s.rsvpStatus && s.rsvpStatus !== 'declined');
                    break;
                case 'completed':
                    sessions = sessions.filter(s => s.status === 'completed');
                    break;
                case 'favorites':
                    sessions = sessions.filter(s => s.isBookmarked);
                    break;
            }
        }

        // Event Type Filter
        if (eventFilter === 'mentor') {
            sessions = sessions.filter(s => !s.isGlobalEvent);
        } else if (eventFilter === 'pgn') {
            sessions = sessions.filter(s => s.isGlobalEvent);
        }

        // Attendance Filter (Completed tab only)
        if (activeTab === 'completed' && attendanceFilter !== 'all') {
            sessions = sessions.filter(s => s.attendance === attendanceFilter);
        }

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            sessions = sessions.filter(s =>
                s.title.toLowerCase().includes(q) ||
                (s.tags && s.tags.some(t => t.toLowerCase().includes(q))) ||
                (s.memberName && s.memberName.toLowerCase().includes(q))
            );
        }

        // Sort logic
        const sortKey = sortConfig.key;
        const sortDir = sortConfig.direction === 'asc' ? 1 : -1;

        sessions.sort((a, b) => {
            let valA: any = '';
            let valB: any = '';

            if (sortKey === 'title') {
                valA = a.title.toLowerCase();
                valB = b.title.toLowerCase();
            } else if (sortKey === 'date') {
                valA = new Date(a.scheduledAt).getTime();
                valB = new Date(b.scheduledAt).getTime();
            } else if (sortKey === 'status') {
                valA = a.status;
                valB = b.status;
            } else if (sortKey === 'attendance') {
                valA = a.attendance || '';
                valB = b.attendance || '';
            }

            if (valA < valB) return -1 * sortDir;
            if (valA > valB) return 1 * sortDir;
            return 0;
        });

        return sessions;
    }, [activeTab, searchQuery, viewMode, eventFilter, attendanceFilter, sortConfig]);

    const handleSchedule = (session: Partial<Session>) => {
        console.log('Scheduling session:', session);
    };

    const handleMenuAction = (action: string, session: typeof ENHANCED_SESSIONS[0]) => {
        switch (action) {
            case 'rsvp':
                setRsvpSession(session);
                break;
            case 'reschedule':
                setRescheduleSession(session);
                break;
            case 'notifications':
                setNotificationSession(session);
                break;
            case 'favorite':
                alert(`${session.isBookmarked ? 'Removed from favorites' : 'Added to favorites'}: "${session.title}"`);
                break;
            default:
                console.log(action, session.id);
        }
    };

    const handleRSVP = (status: 'confirmed' | 'maybe' | 'declined') => {
        if (rsvpSession) {
            console.log(`RSVP ${status} for session ${rsvpSession.id}`);
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const renderCalendarView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/50 border-b border-r border-gray-100 last:border-r-0"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const daySessions = filteredSessions.filter(s => {
                const sDate = new Date(s.scheduledAt);
                return sDate.getDate() === d && sDate.getMonth() === month && sDate.getFullYear() === year;
            });

            const isToday = date.toDateString() === new Date().toDateString();

            days.push(
                <div key={d} className={`h-32 bg-white border-b border-r border-gray-100 last:border-r-0 p-2 overflow-y-auto hover:bg-gray-50 transition-colors group relative`}>
                    <div className={`text-sm font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-gray-700'
                        }`}>{d}</div>

                    <div className="space-y-1">
                        {daySessions.map(s => (
                            <div key={s.id}
                                onClick={() => navigate(`/sessions/${s.id}`)}
                                className={`text-[10px] p-1 rounded cursor-pointer truncate border transition-colors flex items-center gap-1 ${s.status === 'completed'
                                    ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                    : s.isGlobalEvent
                                        ? 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100'
                                        : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
                                    }`}
                                title={s.title}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.isGlobalEvent ? 'bg-purple-500' : 'bg-blue-500'}`} />
                                <span className="font-bold mr-1">
                                    {new Date(s.scheduledAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                </span>
                                <span className="truncate">{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-gray-900 min-w-[200px]">
                            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                            <button onClick={prevMonth} className="p-1 hover:bg-white hover:shadow rounded-md transition-all text-gray-600">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextMonth} className="p-1 hover:bg-white hover:shadow rounded-md transition-all text-gray-600">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Legend */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mr-4">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Mentor</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> PGN Event</span>
                        </div>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="text-sm font-medium text-primary hover:text-primary-dark"
                        >
                            Today
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide border-r border-gray-200 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 border-l border-gray-200 bg-white">
                    {days}
                </div>
            </div>
        );
    };

    // Determine table columns based on active tab
    const getTableHeaders = () => {
        const handleSort = (key: 'title' | 'date' | 'status' | 'attendance') => {
            setSortConfig(current => ({
                key,
                direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
            }));
        };

        const SortIcon = ({ colKey }: { colKey: string }) => {
            if (sortConfig.key !== colKey) return <ArrowUpDown className="w-3 h-3 text-gray-300 ml-1 inline-block" />;
            return <ArrowUpDown className={`w-3 h-3 ml-1 inline-block ${sortConfig.direction === 'asc' ? 'text-primary rotate-180' : 'text-primary'}`} />;
        };

        const headers = [
            <th key="title" onClick={() => handleSort('title')} className="py-3 pl-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-2/5 cursor-pointer hover:bg-gray-100 transition-colors">
                Title <SortIcon colKey="title" />
            </th>,
            <th key="datetime" onClick={() => handleSort('date')} className="py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                Date & Time <SortIcon colKey="date" />
            </th>
        ];

        if (activeTab === 'completed') {
            headers.push(
                <th key="attendance" onClick={() => handleSort('attendance')} className="py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                    Attendance <SortIcon colKey="attendance" />
                </th>
            );
        }

        if (activeTab === 'rsvps') {
            headers.push(
                <th key="rsvp" className="py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">RSVP Status</th>
            );
        }

        if (activeTab === 'favorites') {
            headers.push(
                <th key="status" onClick={() => handleSort('status')} className="py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                    Status <SortIcon colKey="status" />
                </th>
            );
        }

        headers.push(
            <th key="actions" className="py-3 pr-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
        );

        return headers;
    };

    return (
        <>
            {/* Modal animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
            `}</style>
            <div className="h-full flex flex-col bg-gray-50/50">
                {/* Header */}
                <div className="px-5 pt-6 pb-4 bg-white border-b border-gray-100 sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-5">
                        <h1 className="text-2xl font-serif font-bold text-primary tracking-tight">Sessions</h1>
                        <div className="flex bg-gray-100/80 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Calendar className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Tabs with better mobile touch targets */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1 -mb-1">
                            <TabButton active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} count={upcomingCount}>Upcoming</TabButton>
                            <TabButton active={activeTab === 'rsvps'} onClick={() => setActiveTab('rsvps')} count={rsvpCount}>My RSVPs</TabButton>
                            <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} count={completedCount}>Completed</TabButton>
                            <TabButton active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} count={favoritesCount}>Favorites</TabButton>
                        </div>

                        {/* Search and Filters - Improved layout */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <div className="relative flex-[1.5]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                    />
                                    {searchQuery ? (
                                        <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                                            <X className="w-3.5 h-3.5 text-gray-500" />
                                        </button>
                                    ) : (
                                        <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
                                    )}
                                </div>

                                <div className="relative flex-1">
                                    <select
                                        value={eventFilter}
                                        onChange={(e) => setEventFilter(e.target.value as EventFilter)}
                                        className="w-full pl-2.5 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                                    >
                                        <option value="all">All Sessions</option>
                                        <option value="mentor">Mentors</option>
                                        <option value="pgn">PGN</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {activeTab === 'completed' && (
                                <div className="relative w-full">
                                    <select
                                        value={attendanceFilter}
                                        onChange={(e) => setAttendanceFilter(e.target.value as AttendanceFilter)}
                                        className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                                    >
                                        <option value="all">All Attendance Status</option>
                                        <option value="attended">Attended</option>
                                        <option value="not_attended">Did Not Attend</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 pb-24 lg:p-6 overflow-y-auto">
                    {viewMode === 'list' ? (
                        <>
                            {/* Desktop table - hidden on small screens */}
                            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>{getTableHeaders()}</tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredSessions.length === 0 ? (
                                            <tr>
                                                <td colSpan={activeTab === 'upcoming' ? 3 : 4} className="py-12 text-center text-gray-500">
                                                    No sessions found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredSessions.map(session => (
                                                <SessionRow
                                                    key={session.id}
                                                    session={session}
                                                    activeTab={activeTab}
                                                    onView={() => navigate(`/sessions/${session.id}`)}
                                                    onMenuAction={handleMenuAction}
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile card layout - shown only on small screens */}
                            <div className="md:hidden">
                                <div className="bg-white border-t border-gray-100">
                                    {filteredSessions.length > 0 ? (
                                        filteredSessions.map(session => (
                                            <MobileSessionCard
                                                key={session.id}
                                                session={session}
                                                activeTab={activeTab}
                                                onView={() => navigate(`/sessions/${session.id}`)}
                                                onMenuAction={handleMenuAction}
                                            />
                                        ))
                                    ) : (
                                        <div className="py-12 px-4 text-center">
                                            <p className="text-gray-500 font-medium">No sessions found matching your criteria</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        renderCalendarView()
                    )}
                </div >

                {/* Schedule Modal */}
                < ScheduleModal
                    isOpen={showScheduleModal}
                    onClose={() => setShowScheduleModal(false)}
                    onSchedule={handleSchedule}
                />

                {/* RSVP Dialog */}
                < RSVPDialog
                    isOpen={!!rsvpSession}
                    onClose={() => setRsvpSession(null)}
                    session={rsvpSession}
                    onRSVP={handleRSVP}
                />

                {/* Reschedule Modal */}
                < RescheduleModal
                    isOpen={!!rescheduleSession}
                    onClose={() => setRescheduleSession(null)}
                    session={rescheduleSession}
                />

                {/* Notification Settings Modal */}
                < NotificationSettingsModal
                    isOpen={!!notificationSession}
                    onClose={() => setNotificationSession(null)}
                    session={notificationSession}
                />
            </div >
        </>
    );
};

export default EnhancedSessionsPage;