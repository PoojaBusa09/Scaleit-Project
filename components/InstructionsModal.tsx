import React from 'react';
import { XIcon } from 'lucide-react';

interface InstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 text-white p-5 flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">{title}</h2>
                        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white text-sm rounded-lg font-bold hover:bg-slate-800 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};
