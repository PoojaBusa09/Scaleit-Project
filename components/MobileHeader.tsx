import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Bell, Search } from 'lucide-react';
import { LogoIcon } from './icons.tsx';

interface MobileHeaderProps {
    isOpen: boolean;
    toggleMenu: () => void;
    user: { name: string; avatarUrl: string; };
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isOpen, toggleMenu, user }) => {
    return (
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleMenu}
                    className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                <NavLink to="/" className="flex items-center ml-1">
                    <LogoIcon className="h-10 w-10 text-primary" />
                    <div className="ml-3">
                        <div className="text-lg font-serif font-bold text-primary tracking-[0.2em] leading-none mb-0.5">
                            PINNACLE
                        </div>
                        <div className="text-[8px] text-accent font-black uppercase tracking-[0.25em] leading-none">
                            Global Network
                        </div>
                    </div>
                </NavLink>
            </div>
        </header>
    );
};

export default MobileHeader;
