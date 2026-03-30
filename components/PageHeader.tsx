import React from 'react';
import { ChevronLeftIcon } from './icons';

/**
 * Props for the PageHeader component.
 */
interface PageHeaderProps {
    /** Main title displayed at the top. */
    title: string;
    /** Optional subtitle or description text. */
    description?: string;
    /** Elements to render on the right side (e.g., action buttons). */
    children?: React.ReactNode;
    /** Additional CSS classes. */
    className?: string;
    /** Callback function for the back button. If provided, back button is shown. */
    onBack?: () => void;
    /** Label for the back button. Defaults to "Back". */
    backLabel?: string;
}

/**
 * Standard page header component with sticky positioning, back button support, and action slots.
 * Should be used at the top of every main page for consistency.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children, className = "", onBack, backLabel = "Back" }) => {
    return (
        <div className={`p-4 sticky top-0 bg-background z-20 border-b border-outline/10 shadow-sm ${className}`}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="group flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors mb-2 w-fit"
                        >
                            <div className="p-1 rounded-full group-hover:bg-primary/10 transition-colors mr-1">
                                <ChevronLeftIcon className="h-4 w-4" />
                            </div>
                            {backLabel}
                        </button>
                    )}
                    <h1 className="text-xl font-serif font-bold text-primary tracking-wide">{title}</h1>
                    {description && (
                        <p className="text-sm text-on-surface-variant mt-1 max-w-3xl leading-relaxed">{description}</p>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    {children}
                </div>
            </div>
        </div>
    );
};
