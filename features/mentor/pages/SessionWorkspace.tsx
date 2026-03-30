import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { MOCK_SESSIONS } from '../../../data/mockSessions.ts';
import { MOCK_MENTOR_CLIENTS } from '../../../data/mockMentors.ts';
import { MOCK_TASKS } from '../../../data/mockTasks.ts';
import {
    ChevronLeftIcon,
    SparklesIcon,
    UsersIcon,
    CheckSquareIcon,
    ClockIcon,
    StopCircleIcon,
    PlayIcon,
    VideoIcon
} from '../../../components/icons.tsx';
import { AutoDebrief } from '../components/AutoDebrief.tsx';

/**
 * Session Workspace Page
 * Provides a workspace for mentors to conduct sessions, take notes, and run AI analysis.
 */
const SessionWorkspace: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const client = MOCK_MENTOR_CLIENTS.find(c => c.id.toString() === clientId);
    const clientTasks = MOCK_TASKS; // Using shared mock data

    const [liveNotes, setLiveNotes] = useState('');
    const [sessionStatus, setSessionStatus] = useState<'scheduled' | 'live' | 'processing' | 'completed'>('scheduled');
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer for live session
    useEffect(() => {
        let interval: any;
        if (sessionStatus === 'live') {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [sessionStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!client) {
        return (
            <div className="text-center text-error p-8">
                <h2 className="text-2xl font-bold">Client not found</h2>
                <Link to="/mentor/dashboard" className="text-primary hover:underline mt-4 block">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header with Back Link */}
            <div>
                <Link
                    to="/mentor/dashboard"
                    className="inline-flex items-center text-sm font-medium text-on-surface-variant hover:text-primary mb-6 transition-colors group"
                    aria-label="Back to Dashboard"
                >
                    <ChevronLeftIcon className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-outline/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <img
                                src={client.avatarUrl}
                                alt={`${client.name}'s avatar`}
                                className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/5"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${sessionStatus === 'live' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-serif font-bold text-primary mb-1">Session Workspace</h2>
                                {sessionStatus === 'live' && (
                                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                        Live
                                    </span>
                                )}
                            </div>
                            <p className="text-lg text-on-surface-variant font-light">With {client.name} • {client.company}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3 items-center">
                        {sessionStatus === 'scheduled' && (
                            <button
                                onClick={() => setSessionStatus('live')}
                                className="px-6 py-3 bg-secondary text-primary font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-secondary/90 transition-all flex items-center gap-2"
                            >
                                <VideoIcon className="w-5 h-5" />
                                Start App Session
                            </button>
                        )}

                        {sessionStatus === 'live' && (
                            <div className="flex items-center gap-4">
                                <div className="text-2xl font-mono text-primary font-bold bg-surface-variant/30 px-4 py-2 rounded-lg">
                                    {formatTime(elapsedTime)}
                                </div>
                                <button
                                    onClick={() => setSessionStatus('processing')}
                                    className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-all flex items-center gap-2"
                                >
                                    <StopCircleIcon className="w-5 h-5" />
                                    End Session
                                </button>
                            </div>
                        )}

                        {sessionStatus === 'processing' && (
                            <span className="text-sm font-bold text-on-surface-variant bg-surface-variant/30 px-3 py-1 rounded">
                                Analysis in Progress...
                            </span>
                        )}

                        {sessionStatus === 'completed' && (
                            <div className="flex items-center gap-2 text-green-600 font-bold">
                                <CheckSquareIcon className="w-5 h-5" />
                                Session Completed
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {sessionStatus === 'processing' ? (
                <AutoDebrief
                    sessionId="demo-session-id" // In real app, this would be passed or generated
                    transcriptText={liveNotes || "Demo Transcript..."} // Use live notes as input for demo
                    onComplete={() => setSessionStatus('completed')}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Col: Context & Notes */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Context Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-outline/20">
                            <h3 className="font-serif text-lg font-medium text-primary mb-4">Context & Prep</h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                                        <SparklesIcon className="w-4 h-4 text-secondary" />
                                        Recent Wins
                                    </h4>
                                    <ul className="space-y-3">
                                        {clientTasks.filter(t => t.isWin).slice(0, 3).map(t => (
                                            <li key={t.id} className="flex gap-2 text-sm text-slate-900 font-medium">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                                {t.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="h-px bg-outline/10" />
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                                        <CheckSquareIcon className="w-4 h-4 text-primary" />
                                        Pending Tasks
                                    </h4>
                                    <ul className="space-y-3">
                                        {clientTasks.filter(t => !t.completed).slice(0, 3).map(t => (
                                            <li key={t.id} className="flex gap-2 text-sm text-slate-900 font-medium">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="block">{t.text}</span>
                                                    {t.dueDate && (
                                                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-normal">
                                                            <ClockIcon className="w-3 h-3" />
                                                            Due {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Live Notes */}
                        <div className={`bg-white p-6 rounded-xl shadow-sm border border-outline/20 h-96 flex flex-col transition-all ${sessionStatus === 'live' ? 'ring-2 ring-secondary/50 shadow-lg' : ''}`}>
                            <h3 className="font-serif text-lg font-medium text-primary mb-4 flex justify-between items-center">
                                {sessionStatus === 'live' ? 'Live Notes (Listening...)' : 'Session Notes'}
                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase font-bold tracking-wide">Private</span>
                            </h3>
                            <textarea
                                value={liveNotes}
                                onChange={(e) => setLiveNotes(e.target.value)}
                                placeholder={sessionStatus === 'live' ? "Type notes here... AI is also listening to the conversation..." : "Start session to enable live note taking..."}
                                className="flex-1 w-full p-4 bg-gray-50 border-none rounded-lg focus:ring-0 resize-none text-base leading-relaxed text-gray-900 placeholder-gray-500"
                                disabled={sessionStatus === 'completed'}
                            />
                        </div>
                    </div>

                    {/* Right Col: AI & Tools */}
                    <div className="lg:col-span-2">
                        {sessionStatus === 'completed' ? (
                            <div className="bg-green-50 rounded-xl p-8 text-center border border-green-100">
                                <CheckSquareIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-green-800 mb-2">Session De-briefed!</h3>
                                <p className="text-green-700">Action items have been saved to the client's plan.</p>
                                <button onClick={() => setSessionStatus('scheduled')} className="mt-4 text-sm font-bold underline text-green-800">Start New Test Session</button>
                            </div>
                        ) : (
                            <div className="bg-surface rounded-xl border border-outline/10 p-12 text-center text-on-surface-variant/60 flex flex-col items-center justify-center h-full min-h-[400px]">
                                {sessionStatus === 'live' ? (
                                    <div className="animate-pulse">
                                        <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <VideoIcon className="w-12 h-12 text-secondary" />
                                        </div>
                                        <h3 className="text-xl font-bold text-primary mb-2">Session is Live</h3>
                                        <p>Video call active. AI is analyzing conversation in real-time.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-24 h-24 bg-surface-variant/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <SparklesIcon className="w-12 h-12 opacity-50" />
                                        </div>
                                        <h3 className="text-xl font-bold text-on-surface mb-2">Ready to Start</h3>
                                        <p className="max-w-md mx-auto">Start the session to enable video calling, live transcription, and real-time AI assistance.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionWorkspace;