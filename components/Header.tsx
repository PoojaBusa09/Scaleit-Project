import React from 'react';
import { SearchIcon, BellIcon, UserCheckIcon } from './icons.tsx';
import { UserRole, ImpersonatedUser } from '../types.ts';

interface HeaderProps {
    user: { name: string; avatarUrl: string; };
    role: UserRole;
    impersonatedUser: ImpersonatedUser | null;
    onExitImpersonation: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, role, impersonatedUser, onExitImpersonation }) => {
    return (
        <header className="flex-shrink-0 bg-surface border-b border-outline/20 flex flex-col">
            {impersonatedUser && (
                <div className="bg-yellow-100 text-yellow-800 px-6 py-2 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <UserCheckIcon className="h-5 w-5 mr-2" />
                        <span>You are currently viewing the platform as <strong>{impersonatedUser.name}</strong> ({impersonatedUser.role}).</span>
                    </div>
                    <button onClick={onExitImpersonation} className="font-bold hover:underline">
                        Exit Impersonation
                    </button>
                </div>
            )}
            <div className="flex items-center justify-between px-6 py-3">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 w-64 bg-surface-variant text-on-surface-variant placeholder-on-surface-variant border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-variant hover:text-on-surface">
                        <BellIcon className="h-6 w-6" />
                    </button>
                    <div className="flex items-center space-x-3">
                        <img
                            className="h-9 w-9 rounded-full"
                            src={user.avatarUrl}
                            alt="User avatar"
                        />
                        <div>
                            <p className="text-sm font-medium text-on-surface">{user.name}</p>
                            <p className="text-xs text-on-surface-variant">{role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
