/**
 * Enhanced Session Details Page
 * Comprehensive session detail view with:
 * - Recording & Transcript tabs with embedded video controls
 * - AI Summary sidebar with Wins section (top)
 * - Enhanced Suggested Prompts (split: For This Session vs Open Prompts)
 * - Session Overview behind more options menu
 * - Video retention countdown & bookmark toggle
 * - Mock Zoom details panel
 * - 5-minute session warning banner (demo)
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SESSIONS, MOCK_SUGGESTED_PROMPTS, MOCK_SESSION_WINS } from '../../../data/mockSessions.ts';
import SessionWarningBanner from '../components/SessionWarningBanner.tsx';
import {
    ArrowLeft,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Maximize2,
    Minimize2,
    FileText,
    Video,
    Clock,
    Calendar,
    Award,
    Trophy,
    Star,
    Heart,
    CheckCircle,
    XCircle,
    MessageSquare,
    Plus,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    MoreHorizontal,
    Info,
    Eye,
    EyeOff,
    AlertTriangle,
    Shield,
    ExternalLink,
    Copy,
    Timer,
    Sparkles,
    User,
    Download,
    File,
    Edit3,
    Lock
} from 'lucide-react';

// =============================================================================
// Helper functions
// =============================================================================

const formatDateFull = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const daysUntil = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffWeeks === 1) return '1 week ago';
    return `${diffWeeks} weeks ago`;
};

// =============================================================================
// Video Player Component
// =============================================================================

const VideoPlayer: React.FC<{ session: typeof MOCK_SESSIONS[0] }> = ({ session }) => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(25);
    const [fullscreen, setFullscreen] = useState(false);

    const actualDuration = session.actualDuration || session.duration;
    const durationStr = `${Math.floor(actualDuration / 60)}:${String(actualDuration % 60).padStart(2, '0')}:00`;

    return (
        <div className="bg-gray-900 rounded-xl overflow-hidden relative group">
            {/* Video Area */}
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {session.recordingStatus === 'ready' ? (
                    <>
                        <div className="text-center">
                            <Video className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Session Recording</p>
                            <p className="text-gray-500 text-xs mt-1">{session.title}</p>
                        </div>
                        {!playing && (
                            <button
                                onClick={() => setPlaying(true)}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                            >
                                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                    <Play className="w-8 h-8 text-white ml-1" />
                                </div>
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center">
                        <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No recording available</p>
                    </div>
                )}
            </div>

            {/* Embedded Control Bar */}
            {session.recordingStatus === 'ready' && (
                <div className="bg-gray-800/95 backdrop-blur px-4 py-2.5 flex items-center gap-3 border-t border-gray-700">
                    <button onClick={() => setPlaying(!playing)} className="text-white hover:text-primary transition-colors">
                        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <SkipBack className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <SkipForward className="w-4 h-4" />
                    </button>

                    {/* Progress Bar */}
                    <div className="flex-1 flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-10 text-right font-mono">
                            {Math.floor(progress * actualDuration / 100)}:00
                        </span>
                        <div className="flex-1 h-1 bg-gray-600 rounded-full relative cursor-pointer group/bar"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
                            }}
                        >
                            <div
                                className="h-full bg-primary rounded-full relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 w-16 font-mono">{durationStr}</span>
                    </div>

                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setFullscreen(!fullscreen)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            )}

            {/* Retention & Duration Info */}
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                    {session.actualDuration && session.actualDuration !== session.duration && (
                        <span className="text-amber-400 flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            Actual: {session.actualDuration} min (scheduled {session.duration} min)
                        </span>
                    )}
                </div>
                {session.recordingExpiresAt && (
                    <span className={`flex items-center gap-1 ${daysUntil(session.recordingExpiresAt) < 30 ? 'text-amber-400' : 'text-gray-500'}`}>
                        <Clock className="w-3 h-3" />
                        Recording expires in {daysUntil(session.recordingExpiresAt)} days
                    </span>
                )}
            </div>
        </div>
    );
};

// =============================================================================
// Session Details Panel (formerly Zoom Details)
// =============================================================================

const SessionDetailsPanel: React.FC<{ session: typeof MOCK_SESSIONS[0] }> = ({ session }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-blue-800 hover:bg-blue-100 transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Video className="w-4 h-4" /> Session Details
                </span>
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expanded && (
                <div className="px-3 pb-3 space-y-2 border-t border-blue-200">
                    <div className="flex justify-between items-center py-1.5">
                        <span className="text-xs text-blue-700">Meeting ID</span>
                        <span className="text-xs font-mono text-blue-900 flex items-center gap-1">
                            123-456-7890
                            <Copy className="w-3 h-3 cursor-pointer hover:text-blue-600" title="Copy" />
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                        <span className="text-xs text-blue-700">Join URL</span>
                        <a href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            zoom.us/j/1234... <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                        <span className="text-xs text-blue-700">Password</span>
                        <span className="text-xs text-blue-900 italic">Not required (streamlined)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                        <span className="text-xs text-blue-700">Waiting Room</span>
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            <Shield className="w-3 h-3" /> Enabled
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                        <span className="text-xs text-blue-700">API Credentials</span>
                        <span className="text-xs text-gray-400 italic">••••••••••</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-t border-blue-100 mt-2 pt-2">
                        <span className="text-xs text-blue-700 font-semibold">Call Settings</span>
                        <span className="text-[10px] text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                            Active Speaker (Default)
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// Mentor Notes Section (Private)
// =============================================================================

const MentorNotesSection: React.FC = () => {
    const [notes, setNotes] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-gray-500" />
                Mentor Notes
                <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Private — visible only to you</span>
            </h3>
            <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
                placeholder="Add private notes about this session..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary resize-y min-h-[80px]"
                rows={3}
            />
            <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-400">{notes.length > 0 ? `${notes.length} characters` : ''}</span>
                <button
                    onClick={handleSave}
                    disabled={!notes.trim()}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${saved
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : notes.trim()
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {saved ? '✓ Saved' : 'Save Notes'}
                </button>
            </div>
        </div>
    );
};

// =============================================================================
// Wins Section
// =============================================================================

const WinsSection: React.FC<{ sessionId: string }> = ({ sessionId }) => {
    const wins = MOCK_SESSION_WINS.filter(w => w.sessionId === sessionId);

    return (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-4 mb-4">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5 text-amber-700" />
                </div>
                Wins
            </h3>
            {wins.length > 0 ? (
                <div className="space-y-2">
                    {wins.map(win => (
                        <div key={win.id} className="flex items-start gap-2 bg-white/70 rounded-lg p-2.5 border border-amber-100">
                            <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 fill-amber-500" />
                            <div>
                                <p className="text-sm text-gray-800">{win.description}</p>
                                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                    {win.source === 'mentor_callout'
                                        ? <><User className="w-2.5 h-2.5" /> Mentor callout</>
                                        : <><Sparkles className="w-2.5 h-2.5" /> AI detected</>
                                    }
                                    {' · '}{getRelativeTime(win.detectedAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-amber-600/70 italic">No wins detected for this session yet.</p>
            )}
        </div>
    );
};

// =============================================================================
// Enhanced Suggested Prompts
// =============================================================================

const SuggestedPromptsSection: React.FC<{
    sessionId: string;
    sessionCategory?: string;
}> = ({ sessionId, sessionCategory }) => {
    const [showOpenPrompts, setShowOpenPrompts] = useState(false);
    const [addingPrompt, setAddingPrompt] = useState(false);
    const [newPromptText, setNewPromptText] = useState('');
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);
    const [userPrompts, setUserPrompts] = useState<{ id: string; text: string; addedBy: 'user' }[]>([]);

    // Don't show prompts for workshops/labs
    if (sessionCategory === 'lab_workshop') {
        return null;
    }

    // Split prompts into session-specific and open
    const sessionPrompts = MOCK_SUGGESTED_PROMPTS.filter(
        p => p.sessionId === sessionId && !dismissedIds.includes(p.id)
    );
    const openPrompts = MOCK_SUGGESTED_PROMPTS.filter(
        p => !p.sessionId && !p.isResolved && !dismissedIds.includes(p.id)
    );

    const handleDismiss = (id: string) => {
        setDismissedIds(prev => [...prev, id]);
    };

    const handleRemoveUserPrompt = (id: string) => {
        setUserPrompts(prev => prev.filter(p => p.id !== id));
    };

    const handleAddPrompt = () => {
        if (newPromptText.trim()) {
            setUserPrompts(prev => [...prev, {
                id: `user_${Date.now()}`,
                text: newPromptText.trim(),
                addedBy: 'user'
            }]);
            setNewPromptText('');
            setAddingPrompt(false);
        }
    };

    const getSourceTag = (source: string) => {
        switch (source) {
            case 'mentor': return { label: 'Mentor', className: 'bg-purple-50 text-purple-600' };
            case 'admin': return { label: 'Admin', className: 'bg-amber-50 text-amber-700' };
            case 'pin': return { label: 'PIN', className: 'bg-green-50 text-green-600' };
            case 'ai':
            default: return { label: 'AI', className: 'bg-blue-50 text-blue-600' };
        }
    };

    const renderPromptItem = (prompt: typeof MOCK_SUGGESTED_PROMPTS[0]) => {
        const sourceTag = getSourceTag(prompt.addedBy);
        return (
            <div key={prompt.id} className="flex items-start gap-2 group">
                <MessageSquare className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${prompt.isResolved ? 'text-green-500' : 'text-blue-500'}`} />
                <div className="flex-1 min-w-0">
                    <p className={`text-sm ${prompt.isResolved ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {prompt.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                        {prompt.originDate && (
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                                From {new Date(prompt.originDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                        {prompt.originDate && (
                            <span>Open for {getRelativeTime(prompt.originDate).replace(' ago', '')}</span>
                        )}
                        <span className={`px-1.5 py-0.5 rounded ${sourceTag.className}`}>
                            {sourceTag.label}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => handleDismiss(prompt.id)}
                    className="p-0.5 hover:bg-gray-100 rounded text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Dismiss"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    Suggested Prompts
                </h3>
                <button
                    onClick={() => setAddingPrompt(true)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> Add Prompt
                </button>
            </div>

            {/* Add Prompt Input */}
            {addingPrompt && (
                <div className="mb-3 flex gap-2">
                    <input
                        type="text"
                        value={newPromptText}
                        onChange={(e) => setNewPromptText(e.target.value)}
                        placeholder="Type a prompt..."
                        className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleAddPrompt()}
                    />
                    <button onClick={handleAddPrompt} className="px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary/90">Add</button>
                    <button onClick={() => setAddingPrompt(false)} className="px-2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* User-Added Prompts */}
            {userPrompts.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Your Prompts
                    </h4>
                    <div className="space-y-3">
                        {userPrompts.map(prompt => (
                            <div key={prompt.id} className="flex items-start gap-2 group">
                                <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-purple-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700">{prompt.text}</p>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">You</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveUserPrompt(prompt.id)}
                                    className="p-0.5 hover:bg-gray-100 rounded text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* For This Session */}
            {sessionPrompts.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        For This Session
                    </h4>
                    <div className="space-y-3">
                        {sessionPrompts.map(renderPromptItem)}
                    </div>
                </div>
            )}

            {/* Open Prompts (collapsible) */}
            {openPrompts.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowOpenPrompts(!showOpenPrompts)}
                        className="w-full flex items-center justify-between py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                    >
                        <span>Open Prompts ({openPrompts.length})</span>
                        {showOpenPrompts ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {showOpenPrompts && (
                        <div className="space-y-3 pt-1 border-t border-gray-100">
                            {openPrompts.map(renderPromptItem)}
                        </div>
                    )}
                </div>
            )}

            {sessionPrompts.length === 0 && openPrompts.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">No prompts for this session.</p>
            )}
        </div>
    );
};

// =============================================================================
// Main Component
// =============================================================================

const SessionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeDetailTab, setActiveDetailTab] = useState<'recording' | 'transcript'>('recording');
    const [showOverview, setShowOverview] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    // Editable executive summary state
    const [editingSummary, setEditingSummary] = useState(false);
    const [summaryText, setSummaryText] = useState(
        'Discussed Q3 marketing strategy with 15% lead increase. Key focus on CRM selection and sales capacity planning.'
    );

    // Editable action items state
    const [actionItems, setActionItems] = useState([
        { id: 'ai-1', text: 'Finalize product launch plan by next Friday', checked: false, editing: false },
        { id: 'ai-2', text: 'Get 3 CRM proposals for comparison', checked: false, editing: false }
    ]);
    const [addingActionItem, setAddingActionItem] = useState(false);
    const [newActionItemText, setNewActionItemText] = useState('');

    const session = MOCK_SESSIONS.find(s => s.id === id);

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
                <h2 className="text-xl font-bold text-gray-900 mb-1">Session Not Found</h2>
                <p className="text-gray-500 mb-4">The session you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/sessions')}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                >
                    Back to Sessions
                </button>
            </div>
        );
    }

    const isCompleted = session.status === 'completed';
    const schedDate = formatDateFull(session.scheduledAt);
    const schedStartTime = formatTime(session.scheduledAt);
    const schedEndTime = formatTime(
        new Date(new Date(session.scheduledAt).getTime() + session.duration * 60000).toISOString()
    );
    const actualStartTime = session.endedAt ? schedStartTime : null;
    const actualEndTimeStr = session.endedAt ? formatTime(session.endedAt) : null;

    return (
        <div className="h-full bg-gray-50/50 flex flex-col">
            {/* Header (Hidden on sticky mobile to save space) */}
            <div className="hidden md:block bg-white border-b border-gray-100 px-4 py-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                            <button
                                onClick={() => navigate('/sessions')}
                                className="mt-1 p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    {session.category && (
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${session.category === 'strategy' ? 'bg-blue-500 text-white'
                                            : session.category === 'mastermind' ? 'bg-purple-500 text-white'
                                                : session.category === 'lab_workshop' ? 'bg-amber-500 text-white'
                                                    : session.category === 'huddle' ? 'bg-emerald-500 text-white'
                                                        : 'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {session.category === 'strategy' ? 'Strategy'
                                                : session.category === 'mastermind' ? 'Mastermind'
                                                    : session.category === 'lab_workshop' ? 'Lab / Workshop'
                                                        : session.category === 'huddle' ? 'Huddle'
                                                            : session.categoryLabel || 'Custom'}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400 font-medium">{schedDate}</span>
                                </div>
                                <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary leading-tight">
                                    {session.title}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                className={`p-2.5 rounded-xl border transition-all active:scale-95 ${session.isBookmarked
                                    ? 'bg-red-50 border-red-100 text-red-500 shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50'
                                    }`}
                                title={session.isBookmarked ? 'Favorited' : 'Add to Favorites'}
                            >
                                <Heart className={`w-5 h-5 ${session.isBookmarked ? 'fill-red-500' : ''}`} />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                    className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-all active:scale-95"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                {showMoreMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 animate-in fade-in slide-in-from-top-1">
                                        <button
                                            onClick={() => { setShowOverview(!showOverview); setShowMoreMenu(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            {showOverview ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                            {showOverview ? 'Hide Overview' : 'Show Overview'}
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4 text-gray-400" /> Open Zoom Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Tabs */}
                    <div className="mt-6 flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveDetailTab('recording')}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeDetailTab === 'recording'
                                ? 'bg-white shadow-sm text-primary'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Video className="w-4 h-4" /> Recording
                        </button>
                        <button
                            onClick={() => setActiveDetailTab('transcript')}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeDetailTab === 'transcript'
                                ? 'bg-white shadow-sm text-primary'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FileText className="w-4 h-4" /> Transcript
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile-Only Header (Compact) */}
            <div className="md:hidden bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-[60]">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/sessions')} className="p-1 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{session.title}</h1>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-400 hover:text-red-500"><Heart className="w-5 h-5" /></button>
                    <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 text-gray-400"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto md:p-6 flex flex-col lg:flex-row gap-6">
                    {/* Sticky Video Container (Mobile) */}
                    <div className="md:relative sticky top-10 md:top-0 z-50 md:z-auto bg-gray-50 md:bg-transparent -mx-0 md:mx-0 flex-1 min-w-0 flex flex-col">
                        <div className="px-0 md:px-0 shadow-lg md:shadow-none">
                            <VideoPlayer session={session} />
                        </div>

                        {/* Mobile Contextual Tabs - Sticky under Video */}
                        <div className="md:hidden flex bg-white border-b border-gray-100 overflow-x-auto no-scrollbar py-1 px-2 sticky top-[calc(100%+0px)] z-40 shadow-sm">
                            {[
                                { id: 'recording', label: 'Details', icon: <Info className="w-3.5 h-3.5" /> },
                                { id: 'transcript', label: 'Transcript', icon: <FileText className="w-3.5 h-3.5" /> },
                                { id: 'summary', label: 'Summary', icon: <Sparkles className="w-3.5 h-3.5" /> },
                                { id: 'prompts', label: 'Prompts', icon: <MessageSquare className="w-3.5 h-3.5" /> }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveDetailTab(tab.id as any)}
                                    className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${
                                        activeDetailTab === tab.id ? 'bg-black text-white shadow-md' : 'text-gray-500'
                                    }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                        
                        {/* 5-Minute Warning Banner (demo) - Desktop only (or integrated in tabs) */}
                        <div className="hidden md:block mt-4">
                            {!isCompleted && <SessionWarningBanner visible={true} />}
                        </div>

                        {/* Tab Content (Recording/Details / Transcript) */}
                        <div className="mt-4 md:mt-4 p-4 md:p-0 space-y-4">
                            {(activeDetailTab === 'recording' || (activeDetailTab as string) === 'recording') && (
                                <>
                                    <div className="md:hidden">
                                        <div className="mb-4">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{schedDate} · {schedStartTime}</span>
                                            <h2 className="text-xl font-bold text-gray-900 mt-1">{session.title}</h2>
                                        </div>
                                        {!isCompleted && <SessionWarningBanner visible={true} />}
                                    </div>
                                    <SessionDetailsPanel session={session} />
                                    <div className="md:hidden">
                                        <MentorNotesSection />
                                    </div>
                                </>
                            )}

                            {(activeDetailTab === 'transcript' || (activeDetailTab as string) === 'transcript') && (
                                <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 shadow-sm">
                                    {session.transcript ? (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold text-gray-900 text-sm">Session Transcript</h3>
                                                    <span className="hidden sm:inline text-xs text-gray-400 border-l border-gray-200 pl-3">{session.transcript.wordCount} words</span>
                                                </div>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] font-black uppercase tracking-widest text-gray-700">
                                                    <Download className="w-3 h-3" /> Export
                                                </button>
                                            </div>
                                            <div className="prose prose-sm text-gray-700 max-w-none leading-relaxed whitespace-pre-line text-sm md:text-base">
                                                {session.transcript.content}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">No transcript available.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mobile-Only Tab Content: Summary & Prompts */}
                            <div className="md:hidden">
                                {(activeDetailTab as string) === 'summary' && (
                                    <div className="space-y-4">
                                        <WinsSection sessionId={session.id} />
                                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                                                <Sparkles className="w-4 h-4 text-primary" /> Summary
                                            </h3>
                                            <p className="text-sm text-gray-700 leading-relaxed">{summaryText}</p>
                                        </div>
                                    </div>
                                )}
                                {(activeDetailTab as string) === 'prompts' && (
                                    <SuggestedPromptsSection sessionId={session.id} sessionCategory={session.category} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar — Desktop Only */}
                    <div className="hidden lg:block w-80 flex-shrink-0 space-y-4">
                        <SuggestedPromptsSection
                            sessionId={session.id}
                            sessionCategory={session.category}
                        />

                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Summary
                            </h3>

                            <WinsSection sessionId={session.id} />

                            {session.aiProcessed ? (
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase">Executive Summary</h4>
                                            <button onClick={() => setEditingSummary(!editingSummary)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        {editingSummary ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={summaryText}
                                                    onChange={(e) => setSummaryText(e.target.value)}
                                                    className="w-full text-xs border border-gray-200 rounded p-2 focus:ring-1 focus:ring-primary h-24"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingSummary(false)}
                                                        className="px-3 py-1 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary/90"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSummary(false)}
                                                        className="px-3 py-1 text-gray-500 text-xs hover:text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {summaryText}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Key Decisions</h4>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5" />
                                                Research and select CRM tool
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5" />
                                                Hire additional salesperson for Q4
                                            </li>
                                        </ul>
                                    </div>
                                    {/* Editable Action Items */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase">Action Items</h4>
                                            <button
                                                onClick={() => setAddingActionItem(true)}
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" /> Add
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mb-2">Check to add to your Action Items Center</p>

                                        {addingActionItem && (
                                            <div className="mb-2 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newActionItemText}
                                                    onChange={(e) => setNewActionItemText(e.target.value)}
                                                    placeholder="New action item..."
                                                    className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && newActionItemText.trim()) {
                                                            setActionItems(prev => [...prev, {
                                                                id: `user-${Date.now()}`,
                                                                text: newActionItemText.trim(),
                                                                checked: false,
                                                                editing: false
                                                            }]);
                                                            setNewActionItemText('');
                                                            setAddingActionItem(false);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (newActionItemText.trim()) {
                                                            setActionItems(prev => [...prev, {
                                                                id: `user-${Date.now()}`,
                                                                text: newActionItemText.trim(),
                                                                checked: false,
                                                                editing: false
                                                            }]);
                                                            setNewActionItemText('');
                                                            setAddingActionItem(false);
                                                        }
                                                    }}
                                                    className="px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary/90"
                                                >
                                                    Add
                                                </button>
                                                <button onClick={() => setAddingActionItem(false)} className="px-2 text-gray-400 hover:text-gray-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        <ul className="text-sm text-gray-700 space-y-2.5">
                                            {actionItems.map((item, idx) => (
                                                <li key={item.id} className="flex items-start gap-2.5 group">
                                                    <input
                                                        type="checkbox"
                                                        id={`action-${item.id}`}
                                                        checked={item.checked}
                                                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                        onChange={(e) => {
                                                            setActionItems(prev => prev.map((ai, i) =>
                                                                i === idx ? { ...ai, checked: e.target.checked } : ai
                                                            ));
                                                        }}
                                                    />
                                                    <div className="flex-1">
                                                        {item.editing ? (
                                                            <input
                                                                type="text"
                                                                value={item.text}
                                                                onChange={(e) => {
                                                                    setActionItems(prev => prev.map((ai, i) =>
                                                                        i === idx ? { ...ai, text: e.target.value } : ai
                                                                    ));
                                                                }}
                                                                onBlur={() => {
                                                                    setActionItems(prev => prev.map((ai, i) =>
                                                                        i === idx ? { ...ai, editing: false } : ai
                                                                    ));
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        setActionItems(prev => prev.map((ai, i) =>
                                                                            i === idx ? { ...ai, editing: false } : ai
                                                                        ));
                                                                    }
                                                                }}
                                                                className="w-full text-sm border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <label htmlFor={`action-${item.id}`} className="text-gray-700 cursor-pointer select-none">
                                                                {item.text}
                                                            </label>
                                                        )}
                                                        {item.checked && (
                                                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">
                                                                <CheckCircle className="w-2.5 h-2.5" /> Added
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!item.editing && (
                                                        <button
                                                            onClick={() => {
                                                                setActionItems(prev => prev.map((ai, i) =>
                                                                    i === idx ? { ...ai, editing: true } : ai
                                                                ));
                                                            }}
                                                            className="p-0.5 hover:bg-gray-100 rounded text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Edit action item"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-4">
                                    AI processing will begin after session completes.
                                </p>
                            )}
                        </div>

                        {/* Mentor Notes (private) */}
                        <MentorNotesSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionDetails;
