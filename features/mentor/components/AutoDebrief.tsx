import React, { useState, useEffect } from 'react';
import { sessionIntelligence, SessionAnalysisResult } from '../../../services/sessionIntelligence.ts';
import { mockDataService } from '../../../services/mockDataService.ts';
import { SparklesIcon, CheckSquareIcon, TrendingUpIcon, AlertTriangleIcon, CheckCircleIcon } from '../../../components/icons.tsx';

interface AutoDebriefProps {
    sessionId: string;
    transcriptText: string;
    onComplete: () => void;
}

export const AutoDebrief: React.FC<AutoDebriefProps> = ({ sessionId, transcriptText, onComplete }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [result, setResult] = useState<SessionAnalysisResult | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let mounted = true;
        const runAnalysis = async () => {
            try {
                // adding a small delay to ensure the UI transition is visible
                await new Promise(r => setTimeout(r, 1000));
                const data = await sessionIntelligence.analyzeSession(transcriptText);
                if (mounted) {
                    setResult(data);
                    setIsAnalyzing(false);
                }
            } catch (e) {
                console.error("Analysis failed:", e);
                if (mounted) setIsAnalyzing(false);
            }
        };

        if (transcriptText) {
            runAnalysis();
        } else {
            setIsAnalyzing(false);
        }

        return () => { mounted = false; };
    }, [transcriptText]);

    const handleSaveAndClose = () => {
        if (result) {
            // 1. Save summary/insights
            // Assuming we map SessionAnalysisResult to SessionSummary type match or use a specialized method
            // For now, using processSessionInsights which handles task creation
            mockDataService.processSessionInsights(sessionId, result);

            // 2. Also save explicit summary object if needed
            // mockDataService.saveSessionSummary(...) - requires mapping types. 
            // For prototypes, processSessionInsights is sufficient for the "Tasks" part.

            setSaved(true);
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    };

    return (
        <div className="bg-surface rounded-xl border border-outline/10 p-6 space-y-6 shadow-2xl max-w-4xl mx-auto my-8 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-outline/10 pb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isAnalyzing ? 'bg-purple-100 animate-pulse' : 'bg-purple-100'}`}>
                        <SparklesIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="font-serif text-2xl font-medium text-primary">
                            {isAnalyzing ? 'AI Analysis in Progress...' : 'Session Intelligence Report'}
                        </h2>
                        <p className="text-sm text-on-surface-variant">
                            {isAnalyzing ? 'Analyzing transcript for actions, decisions, and risks.' : 'Review and confirm extracted items below.'}
                        </p>
                    </div>
                </div>
            </div>

            {isAnalyzing ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-purple-700 font-medium animate-pulse">Consulting the oracle...</p>
                </div>
            ) : !result ? (
                <div className="py-12 text-center text-error">
                    <AlertTriangleIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Failed to generate analysis.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Summary Section */}
                    <div className="bg-surface-variant/20 p-4 rounded-lg">
                        <h3 className="text-sm font-bold text-on-surface uppercase tracking-wide mb-2">Executive Summary</h3>
                        <p className="text-on-surface-variant leading-relaxed">
                            {result.summary}
                        </p>
                    </div>

                    {/* Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Action Items */}
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <CheckSquareIcon className="w-4 h-4" /> Action Items
                            </h3>
                            <ul className="space-y-2">
                                {result.insights.filter(i => i.type === 'action_item').map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-blue-900 bg-white p-2 rounded shadow-sm">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        <span>{item.content}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Decisions & Risks */}
                        <div className="space-y-4">
                            <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                                <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4" /> Key Decisions
                                </h3>
                                <ul className="space-y-2">
                                    {result.insights.filter(i => i.type === 'decision').map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-green-900 bg-white p-2 rounded shadow-sm">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                            <span>{item.content}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-50/50 p-4 rounded-lg border border-red-100">
                                <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <AlertTriangleIcon className="w-4 h-4" /> Detected Risks
                                </h3>
                                <ul className="space-y-2">
                                    {result.insights.filter(i => i.type === 'risk').map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-red-900 bg-white p-2 rounded shadow-sm">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                            <span>{item.content}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-outline/10 flex justify-end gap-3">
                        {saved ? (
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 animate-bounce">
                                <CheckCircleIcon className="w-5 h-5" />
                                Saved to Action Plan!
                            </button>
                        ) : (
                            <button
                                onClick={handleSaveAndClose}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Approve & Save to Action Plan
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
