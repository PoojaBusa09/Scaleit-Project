import React, { useState } from 'react';
import { sessionIntelligence, SessionAnalysisResult } from '../../../services/sessionIntelligence.ts';
import { SparklesIcon, CheckSquareIcon, TrendingUpIcon, AlertTriangleIcon } from '../../../components/icons.tsx';

export const SessionSimulation: React.FC = () => {
    const [transcript, setTranscript] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<SessionAnalysisResult | null>(null);

    const handleAnalyze = async () => {
        if (!transcript.trim()) return;

        setIsAnalyzing(true);
        try {
            const data = await sessionIntelligence.analyzeSession(transcript);
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const loadDemoTranscript = () => {
        const demoText = `
Participant: Patrick Nunally
Participant: Vijay

Patrick: We want to automate as much of this as possible. The current tools are felt as a burden or drudgery by the mentors.
We need to give it a fresh look. I'm imagining a platform where the video call is right there.
Vijay: So we integrate Zoom?
Patrick: Exactly. And the AI should listen in. If I say "We need to update the growth goal to 20%", it should just happen.
Vijay: Okay, so we keep the Dec 2023 tools but populate them via AI. 
Patrick: Yes. Can we have this reviewed by next Tuesday?
        `;
        setTranscript(demoText.trim());
    };

    return (
        <div className="bg-surface rounded-xl border border-outline/10 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-purple-600" />
                    <h2 className="font-serif text-xl font-medium text-primary">AI Session Intelligence</h2>
                </div>
                <button
                    onClick={loadDemoTranscript}
                    className="text-xs text-secondary font-bold uppercase hover:text-secondary-dark"
                >
                    Load Demo Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Area */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-on-surface-variant">Session Transcript / Notes</label>
                    <textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Paste session transcript here..."
                        className="w-full h-64 p-4 rounded-lg border border-outline/20 bg-surface-variant/20 focus:ring-2 focus:ring-primary focus:outline-none text-sm font-mono leading-relaxed resize-none"
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !transcript}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2
                            ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-md'}
                        `}
                    >
                        {isAnalyzing ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <SparklesIcon className="w-4 h-4" />
                                Process Intelligence
                            </>
                        )}
                    </button>
                </div>

                {/* Results Area */}
                <div className="bg-surface-variant/30 rounded-lg p-6 border border-outline/10 min-h-[300px]">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50">
                            <SparklesIcon className="w-12 h-12 mb-4 opacity-20" />
                            <p>Analysis results will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in-up">
                            {/* Summary */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wide">AI Summary</h3>
                                <p className="text-sm text-on-surface-variant leading-relaxed">
                                    {result.summary}
                                </p>
                            </div>

                            {/* Extract Data */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wide">Extracted Insights</h3>

                                {result.insights.map((insight, i) => (
                                    <div key={i} className="flex gap-3 p-3 bg-white/50 rounded-lg border border-white/50 shadow-sm">
                                        <div className={`mt-0.5 shrink-0
                                            ${insight.type === 'action_item' ? 'text-blue-600' : ''}
                                            ${insight.type === 'decision' ? 'text-green-600' : ''}
                                            ${insight.type === 'risk' ? 'text-red-600' : ''}
                                            ${insight.type === 'goal_update' ? 'text-purple-600' : ''}
                                        `}>
                                            {insight.type === 'action_item' && <CheckSquareIcon className="w-4 h-4" />}
                                            {insight.type === 'decision' && <CheckSquareIcon className="w-4 h-4" />} {/* Use specialized icon if available */}
                                            {insight.type === 'risk' && <AlertTriangleIcon className="w-4 h-4" />}
                                            {insight.type === 'goal_update' && <TrendingUpIcon className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-primary">{insight.content}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[10px] bg-primary/5 text-primary/70 px-1.5 py-0.5 rounded uppercase font-bold">
                                                    {insight.type.replace('_', ' ')}
                                                </span>
                                                {insight.assignee && (
                                                    <span className="text-[10px] text-on-surface-variant">
                                                        Assignee: {insight.assignee}
                                                    </span>
                                                )}
                                                {insight.dueDate && (
                                                    <span className="text-[10px] text-on-surface-variant">
                                                        Due: {insight.dueDate}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
