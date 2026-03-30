import React from 'react';

interface StrategySectionProps {
    title: string;
    placeholder: string;
    icon: React.ElementType;
}

/**
 * Helper component for text area inputs with a title and icon.
 */
export const StrategySection: React.FC<StrategySectionProps> = ({ title, placeholder, icon: Icon }) => (
    <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20 mb-6">
        <div className="flex items-center mb-4">
            <div className="p-2 bg-primary/5 rounded-lg mr-3" aria-hidden="true">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-on-surface uppercase tracking-wide">{title}</h3>
        </div>
        <textarea
            rows={4}
            className="w-full p-4 bg-surface-variant/10 border border-outline/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-on-surface resize-y min-h-[120px]"
            placeholder={placeholder}
            aria-label={title}
        ></textarea>
    </div>
);
