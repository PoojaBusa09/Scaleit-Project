
import React, { useState } from 'react';
import { PageHeader } from '../../../components/PageHeader.tsx';
import { sessionIntelligence, SessionAnalysisResult } from '../../../services/sessionIntelligence.ts';
import { Sparkles, Play, BarChart3, AlertTriangle, CheckSquare, BrainCircuit, FileText } from 'lucide-react';

const DEMO_TRANSCRIPT = `Participant: Patrick Nunally
Participant: Vijay

Patrick: Alright, let's dive into the requirements for ScaleIt 2.0. We really need to professionalize the platform. The current tools are largely seen as more of a burden than an asset. We want to change that.

Vijay: Understood. What are the key areas we should focus on first?

Patrick: First, the design needs a fresh look. We want to align it with the Pinnacle branding. It should be simple, professional, Navy and Gold. Not disjointed like it is now.

Vijay: Got it. Navy and Gold, fresh look. What about the functionality?

Patrick: The administrative drudgery is a real pain point for Mentors. We need to automate as much as possible. I'm thinking we integrate video directly. So when they schedule a session, it creates the Zoom link, sends reminders, and then when they join, it just works.

Vijay: That makes sense. We can do that. What about after the meeting?

Patrick: That's the big one. We don't just want AI summaries. We want to extract data from those conversations to populate the other tools. So if we talk about growing revenue by 10%, that should update the Scorecard automatically. It shouldn't be a manual copy-paste job.

Vijay: Okay, so extraction is key. Tasks, goals, risks?

Patrick: Exactly. Also, we want to see a cohesive system. The CEO should have a dashboard where they see it all. And the Mentors should have a "pulse" of their day.

Vijay: We'll target a review of these changes by next Tuesday.

Patrick: Perfect. Let's make it happen.`;

export const TranscriptSimulationPage: React.FC = () => {
    const [transcript, setTranscript] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<SessionAnalysisResult | null>(null);

    const handleLoadDemo = () => {
        setTranscript(DEMO_TRANSCRIPT);
    };

    const handleAnalyze = async () => {
        if (!transcript.trim()) return;

        setIsAnalyzing(true);
        try {
            const data = await sessionIntelligence.analyzeSession(transcript);
            setResult(data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-6">
            <PageHeader
                title="AI Session Intelligence"
                description="Simulate the extraction engine. Paste a transcript to identify goals, tasks, risks, and strategic insights."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-serif font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-500" />
                                Transcript Input
                            </h3>
                            <button
                                onClick={handleLoadDemo}
                                className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Load Demo Data
                            </button>
                        </div>
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Paste session transcript here..."
                            className="w-full h-[500px] p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !transcript}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all
                                    ${isAnalyzing || !transcript
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary-dark hover:-translate-y-0.5 shadow-primary/30'}
                                `}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <BrainCircuit className="w-5 h-5 animate-pulse" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Extract Insights
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    {result ? (
                        <div className="space-y-6 animate-fadeIn">

                            {/* Summary Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg">
                                        <BrainCircuit className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">Executive Summary</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{result.summary}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Sentiment:
                                        <span className={`px-2 py-0.5 rounded-full ${result.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                            result.sentiment === 'concerned' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {result.sentiment}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Extracted Items Grid */}
                            <div className="space-y-3">
                                <h3 className="font-serif font-bold text-gray-800 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-gray-500" />
                                    Extracted Intelligence
                                </h3>

                                {result.insights.map((insight, idx) => (
                                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-3">
                                            {/* Icon based on type */}
                                            <div className={`p-2 rounded-lg flex-shrink-0 ${insight.type === 'action_item' ? 'bg-blue-50 text-blue-600' :
                                                insight.type === 'decision' ? 'bg-purple-50 text-purple-600' :
                                                    insight.type === 'risk' ? 'bg-red-50 text-red-600' :
                                                        'bg-green-50 text-green-600' // goal_update
                                                }`}>
                                                {insight.type === 'action_item' && <CheckSquare className="w-5 h-5" />}
                                                {insight.type === 'decision' && <BrainCircuit className="w-5 h-5" />}
                                                {insight.type === 'risk' && <AlertTriangle className="w-5 h-5" />}
                                                {insight.type === 'goal_update' && <BarChart3 className="w-5 h-5" />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full inline-block ${insight.type === 'action_item' ? 'bg-blue-100 text-blue-700' :
                                                        insight.type === 'decision' ? 'bg-purple-100 text-purple-700' :
                                                            insight.type === 'risk' ? 'bg-red-100 text-red-700' :
                                                                'bg-green-100 text-green-700'
                                                        }`}>
                                                        {insight.type.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {(insight.confidence * 100).toFixed(0)}% Confidence
                                                    </span>
                                                </div>

                                                <p className="font-medium text-gray-900 mt-1">{insight.content}</p>

                                                {(insight.assignee || insight.dueDate || insight.relatedMetric) && (
                                                    <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-50">
                                                        {insight.assignee && (
                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                                👤 {insight.assignee}
                                                            </span>
                                                        )}
                                                        {insight.dueDate && (
                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                                📅 {insight.dueDate}
                                                            </span>
                                                        )}
                                                        {insight.relatedMetric && (
                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                                📈 {insight.relatedMetric} {insight.metricValue && `: ${insight.metricValue}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {result.insights.length === 0 && (
                                    <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                                        No actionable insights found with high confidence.
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <Sparkles className="w-12 h-12 mb-4 text-gray-300" />
                            <p className="text-center font-medium">Results will appear here</p>
                            <p className="text-center text-sm mt-2 max-w-xs">
                                Use the extraction engine to identify tasks, decisions, and risks automatically.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
