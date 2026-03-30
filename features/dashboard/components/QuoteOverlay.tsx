import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your limit is your mind.", author: "Unknown" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" }
];

export const QuoteOverlay: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        // Check if we've already shown the quote in this session
        const hasShownQuote = sessionStorage.getItem('hasShownDashboardQuote');

        if (!hasShownQuote) {
            // Select random quote
            const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            setQuote(randomQuote);

            // Show overlay
            setIsVisible(true);

            // Mark as shown
            sessionStorage.setItem('hasShownDashboardQuote', 'true');

            // Find all elements with focus and blur them to prevent immediate interaction
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

            // Auto-hide after 3.5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3500);

            return () => clearTimeout(timer);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-500">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="max-w-2xl px-6 text-center space-y-8 animate-in zoom-in-95 duration-700 slide-in-from-bottom-4">
                <div className="inline-flex items-center justify-center p-3 bg-yellow-50 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                </div>

                <h2 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 leading-tight">
                    "{quote.text}"
                </h2>

                <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full"></div>

                <p className="text-lg text-gray-500 font-medium tracking-wide uppercase">
                    — {quote.author}
                </p>

                <div className="pt-8">
                    <p className="text-sm text-gray-400 animate-pulse">Loading your dashboard...</p>
                </div>
            </div>
        </div>
    );
};
