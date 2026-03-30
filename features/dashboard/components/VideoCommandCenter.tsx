import React, { useState, useEffect } from 'react';
import { VideoCameraIcon, ClockIcon } from '../../../components/icons.tsx';
import { zoomService } from '../../../services/zoomService.ts';

interface VideoCommandCenterProps {
    nextSession: {
        id: string;
        title: string;
        time: string; // "10:00 AM" or similar
        date: Date;   // JS Date object
        attendees: string[];
    } | null;
    userRole: 'mentor' | 'client';
}

export const VideoCommandCenter: React.FC<VideoCommandCenterProps> = ({ nextSession, userRole }) => {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isMeetingActive, setIsMeetingActive] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [isPipMode, setIsPipMode] = useState(false);

    useEffect(() => {
        if (!nextSession) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const sessionTime = nextSession.date.getTime(); // Assuming date object is correct
            const distance = sessionTime - now;

            if (distance < 0) {
                // Meeting time passed/started
                setTimeLeft('Now');
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        }, 60000); // Update every minute

        // Initial set
        const initialDist = nextSession.date.getTime() - new Date().getTime();
        if (initialDist < 0) setTimeLeft('Now');
        else {
            const h = Math.floor((initialDist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((initialDist % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${h}h ${m}m`);
        }

        return () => clearInterval(timer);
    }, [nextSession]);

    const handleStartInteraction = async () => {
        if (!nextSession) return;
        setShowJoinModal(true);
        // In real app, would redirect to Zoom URL
        await zoomService.startMeeting(nextSession.id);
        setIsMeetingActive(true);
    };

    const handleEndInteraction = async () => {
        if (!nextSession) return;
        await zoomService.endMeeting(nextSession.id);
        setShowJoinModal(false);
        setIsMeetingActive(false);
        setIsPipMode(false);
        alert("Meeting ended. AI is processing the transcript...");
        // Trigger redirect or state change to "Debrief" view in next phase
    };

    if (!nextSession) {
        return (
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-xl p-5 flex items-center gap-3 opacity-70">
                <div className="p-2.5 bg-gray-100 rounded-full text-gray-400">
                    <VideoCameraIcon className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-semibold text-gray-600 text-sm">No sessions scheduled</p>
                    <p className="text-[10px] text-gray-500">Enjoy your free time!</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gradient-to-r from-primary to-[#1a3a5f] rounded-2xl p-0.5 shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow">
                {/* Glass effect over gradient */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>

                <div className="relative bg-primary/40 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                        {/* Left: Info */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 flex-shrink-0
                                ${timeLeft === 'Now' ? 'bg-green-500 animate-pulse' : 'bg-white/10'}    
                            `}>
                                <VideoCameraIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
                                    <span className="bg-secondary text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                                        {timeLeft === 'Now' ? 'Happening Now' : `In ${timeLeft}`}
                                    </span>
                                    <span className="text-white/90 text-xs flex items-center gap-1 whitespace-nowrap font-medium">
                                        <ClockIcon className="w-3 h-3" /> {nextSession.time}
                                    </span>
                                </div>
                                <h3 className="font-serif text-white font-semibold text-lg leading-snug break-words pr-2">
                                    {nextSession.title}
                                </h3>
                                <p className="text-white/90 text-xs mt-1 truncate font-medium">
                                    With {nextSession.attendees.join(', ')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button - Full width on mobile, auto on wider screens */}
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={handleStartInteraction}
                            className={`
                                w-full sm:w-auto text-center px-6 py-2.5 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-wide
                                ${timeLeft === 'Now'
                                    ? 'bg-green-500 hover:bg-green-400 text-white ring-4 ring-green-500/30'
                                    : 'bg-white text-primary hover:bg-secondary hover:text-primary'}
                            `}
                        >
                            {userRole === 'mentor' ? 'Start Meeting' : 'Join Meeting'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mock Zoom Modal — Full Screen or PIP Mode */}
            {showJoinModal && !isPipMode && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-5xl flex gap-3 h-[80vh]">
                        {/* Main Video Area */}
                        <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col relative">
                            {/* Header */}
                            <div className="bg-black/50 p-4 flex justify-between items-center text-white">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="font-medium">REC</span>
                                </div>
                                <span>{nextSession.title}</span>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                </div>
                            </div>

                            {/* Video Feed */}
                            <div className="flex-1 bg-gray-800 flex items-center justify-center relative">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white border-4 border-secondary">
                                        {nextSession.attendees[0].substring(0, 2).toUpperCase()}
                                    </div>
                                    <p className="text-gray-400">Waiting for others to join...</p>
                                </div>
                                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center">
                                    <p className="text-xs text-gray-500">You</p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="bg-black/80 p-4 flex justify-center gap-3 flex-wrap">
                                <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white"><span className="sr-only">Mute</span>🎤</button>
                                <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white"><span className="sr-only">Video</span>📹</button>
                                <button className="p-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold px-5 text-sm">Share Screen</button>
                                <button
                                    onClick={() => setIsPipMode(true)}
                                    className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 flex items-center gap-2 text-sm"
                                >
                                    📄 Browse Resources
                                </button>
                                <button onClick={handleEndInteraction} className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold px-6 text-sm">End Meeting</button>
                            </div>
                        </div>

                        {/* AI Prompt Sidebar — Chat-style overlay panel */}
                        <div className="w-72 bg-gray-900 rounded-xl border border-gray-700 flex flex-col overflow-hidden shadow-2xl hidden md:flex">
                            <div className="bg-primary/20 px-4 py-3 border-b border-gray-700 flex items-center gap-2">
                                <span className="text-sm">🤖</span>
                                <span className="text-white font-bold text-sm">Pinnacle AI</span>
                                <span className="ml-auto text-[10px] text-green-400 font-bold uppercase tracking-wider">Live</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                                {/* Objective */}
                                <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-3">
                                    <p className="text-blue-300 font-bold mb-1">📌 Session Objective</p>
                                    <p className="text-blue-200/80">Review Q2 strategic plan and validate cash flow projections against growth targets.</p>
                                </div>
                                {/* AI Nudge */}
                                <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-3">
                                    <p className="text-yellow-300 font-bold mb-1">💡 AI Suggestion</p>
                                    <p className="text-yellow-200/70">Alexandre mentioned wanting to revisit his hiring plan last session. Consider bringing it up today.</p>
                                </div>
                                {/* Checklist */}
                                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                                    <p className="text-gray-300 font-bold mb-2">✅ Talking Points</p>
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300">
                                            <input type="checkbox" className="rounded" /> Revenue targets
                                        </label>
                                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300">
                                            <input type="checkbox" className="rounded" /> Team capacity
                                        </label>
                                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300">
                                            <input type="checkbox" className="rounded" /> Marketing spend
                                        </label>
                                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300">
                                            <input type="checkbox" className="rounded" /> Quarterly goals
                                        </label>
                                    </div>
                                </div>
                                {/* Live nudge */}
                                <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3">
                                    <p className="text-green-300 font-bold mb-1">🎉 Positive Note</p>
                                    <p className="text-green-200/70">Great progress since last session! Score Tracker shows growth phase moved from Red → Yellow.</p>
                                </div>
                            </div>
                            <div className="p-3 border-t border-gray-700">
                                <p className="text-[10px] text-gray-500 text-center">AI prompts update in real-time during the session</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-white/50 mt-4 text-sm animate-pulse">Simulating Zoom + AI Assistant... (Click 'End Meeting' to test AI)</p>
                </div>
            )}

            {/* PIP Mode: Small floating video + Resource Library */}
            {showJoinModal && isPipMode && (
                <div className="fixed inset-0 z-50 bg-black/60 flex">
                    {/* Resource Library Panel */}
                    <div className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto p-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resource Library</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Browse documents while in your meeting</p>
                                </div>
                                <button
                                    onClick={() => setIsPipMode(false)}
                                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    ← Back to Full Screen
                                </button>
                            </div>

                            {/* Mock Document List */}
                            <div className="space-y-3">
                                {[
                                    { name: 'Q2 Strategic Plan.pdf', type: 'PDF', size: '2.4 MB', date: 'Mar 10, 2026' },
                                    { name: 'Cash Flow Projections.xlsx', type: 'Spreadsheet', size: '1.1 MB', date: 'Mar 8, 2026' },
                                    { name: 'Marketing Blueprint.pdf', type: 'PDF', size: '3.7 MB', date: 'Feb 28, 2026' },
                                    { name: 'Team Org Chart.pdf', type: 'PDF', size: '890 KB', date: 'Feb 20, 2026' },
                                    { name: 'Sales Pipeline Review.pdf', type: 'PDF', size: '1.5 MB', date: 'Feb 15, 2026' },
                                ].map((doc, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-xs flex-shrink-0">
                                            {doc.type === 'PDF' ? 'PDF' : 'XLS'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">{doc.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{doc.size} · Uploaded {doc.date}</p>
                                        </div>
                                        <button className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors flex-shrink-0">
                                            Open
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating PIP Video Window */}
                    <div className="fixed bottom-6 right-6 w-80 h-52 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600 z-[60] group">
                        {/* Mini Header */}
                        <div className="bg-black/70 px-3 py-1.5 flex justify-between items-center text-white text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                <span className="font-medium">LIVE</span>
                            </div>
                            <span className="truncate max-w-[120px]">{nextSession.title}</span>
                        </div>

                        {/* Mini Video */}
                        <div className="flex-1 bg-gray-800 flex items-center justify-center h-28">
                            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-secondary">
                                {nextSession.attendees[0].substring(0, 2).toUpperCase()}
                            </div>
                        </div>

                        {/* Mini Controls */}
                        <div className="bg-black/80 px-3 py-2 flex justify-center gap-3">
                            <button className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-xs">🎤</button>
                            <button className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-xs">📹</button>
                            <button
                                onClick={() => setIsPipMode(false)}
                                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                            >
                                Expand
                            </button>
                            <button
                                onClick={handleEndInteraction}
                                className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                            >
                                End
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
