/**
 * Session Warning Banner Component
 * Simulates a 5-minute session ending warning prompt.
 * In production, this would be triggered by real-time session timer state.
 */

import React, { useState } from 'react';
import { Clock, Trophy, CheckCircle, X, AlertTriangle } from 'lucide-react';

interface SessionWarningBannerProps {
    visible?: boolean;
}

const SessionWarningBanner: React.FC<SessionWarningBannerProps> = ({ visible = true }) => {
    const [dismissed, setDismissed] = useState(false);

    if (!visible || dismissed) return null;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4 shadow-sm animate-in">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-900 flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            Session ending in ~5 minutes
                        </h4>
                        <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                            Before wrapping up, let's make sure we've captured everything:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors border border-amber-200">
                                <Trophy className="w-3 h-3" /> Capture Wins
                            </button>
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors border border-amber-200">
                                <CheckCircle className="w-3 h-3" /> Review Action Items
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="p-1 hover:bg-amber-100 rounded-full text-amber-500 hover:text-amber-700 transition-colors"
                    title="Dismiss"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SessionWarningBanner;
