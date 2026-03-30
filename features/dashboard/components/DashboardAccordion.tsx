import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface DashboardAccordionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    className?: string;
    headerAction?: React.ReactNode;
}

/**
 * DashboardAccordion Component
 * On mobile (< 1024px), it renders as a collapsible accordion.
 * On desktop (>= 1024px), it renders the content normally without accordion behavior,
 * but keeps the consistent styling.
 */
export const DashboardAccordion: React.FC<DashboardAccordionProps> = ({
    title,
    icon,
    children,
    defaultExpanded = false,
    className = '',
    headerAction
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // On Desktop, it's always "expanded" but without the accordion logic
    const expanded = isMobile ? isExpanded : true;

    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all ${className}`}>
            {/* Header - Only acts as a toggle on Mobile */}
            <div
                className={`flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 ${isMobile ? 'cursor-pointer hover:bg-gray-50/50' : 'border-b border-gray-100'}`}
                onClick={() => isMobile && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 border border-gray-100 shadow-sm">
                        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-snug tracking-tight">{title}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {headerAction && !isMobile && headerAction}
                    {isMobile && (
                        <div className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-gray-100' : ''}`}>
                            <ChevronDownIcon
                                className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-gray-900' : ''}`}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div
                className={`transition-all duration-300 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
                <div className={`${isMobile ? 'border-t border-gray-100' : ''}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};
