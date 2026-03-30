import React, { useState } from 'react';
import { ShieldIcon, BellIcon, UsersIcon, HistoryIcon, SearchIcon } from '../../../components/icons';
import { MOCK_AUDIT_LOGS } from '../../../constants';
import { AuditLog } from '../../../types';

type Tab = 'roles' | 'notifications' | 'security' | 'audit';

const TabButton: React.FC<{ activeTab: Tab, tabName: Tab, label: string, icon: React.ElementType, onClick: (tab: Tab) => void }> = ({ activeTab, tabName, label, icon: Icon, onClick }) => (
    <button
        onClick={() => onClick(tabName)}
        className={`flex items-center whitespace-nowrap py-3 px-4 border-b-2 font-medium text-title-sm transition-colors ${activeTab === tabName
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
    >
        <Icon className="h-5 w-5 mr-2" /> {label}
    </button>
);

const RolesTab: React.FC = () => (
    <div>
        <h3 className="text-title-lg font-medium mb-4">Roles & Permissions</h3>
        <p className="text-body-md text-on-surface-variant mb-4">Define roles and manage what users can see and do.</p>
        <div className="space-y-2">
            {['Super Admin', 'Mentor', 'Member'].map(role => (
                <div key={role} className="flex justify-between items-center p-3 bg-surface-variant rounded-md">
                    <span className="font-medium text-on-surface">{role}</span>
                    <button className="text-primary font-medium hover:underline">Edit Permissions</button>
                </div>
            ))}
        </div>
    </div>
);

const SecurityTab: React.FC = () => (
    <div>
        <h3 className="text-title-lg font-medium mb-4">Security Settings</h3>
        <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-surface-variant rounded-md">
                <div>
                    <p className="font-medium text-on-surface">Enforce Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-on-surface-variant">Require all users to set up 2FA for added security.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
            <div className="p-3 bg-surface-variant rounded-md">
                <p className="font-medium text-on-surface">Password Policy</p>
                <p className="text-sm text-on-surface-variant mb-2">Set requirements for user passwords.</p>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="length" defaultChecked className="h-4 w-4 text-primary rounded" />
                    <label htmlFor="length">Minimum 8 characters</label>
                </div>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="uppercase" defaultChecked className="h-4 w-4 text-primary rounded" />
                    <label htmlFor="uppercase">At least one uppercase letter</label>
                </div>
            </div>
        </div>
    </div>
);

const AuditLogTab: React.FC = () => {
    const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
    return (
        <div>
            <h3 className="text-title-lg font-medium mb-4">System Audit Log</h3>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                <input type="text" placeholder="Search logs by user or action..." className="w-full pl-10 pr-4 py-2 bg-surface-variant rounded-full text-sm" />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-outline">
                            <th className="p-2 text-left font-medium text-on-surface-variant">Timestamp</th>
                            <th className="p-2 text-left font-medium text-on-surface-variant">User</th>
                            <th className="p-2 text-left font-medium text-on-surface-variant">Action</th>
                            <th className="p-2 text-left font-medium text-on-surface-variant">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b border-surface-variant">
                                <td className="p-2 text-on-surface-variant whitespace-nowrap">{log.timestamp}</td>
                                <td className="p-2 text-on-surface font-medium">{log.user}</td>
                                <td className="p-2 text-on-surface-variant"><span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded text-xs">{log.action}</span></td>
                                <td className="p-2 text-on-surface-variant">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


const SystemConfiguration: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('roles');

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
            <h2 className="text-headline-sm text-on-surface">System Configuration</h2>
            <p className="text-body-md text-on-surface-variant mt-1 mb-6">Configure system-wide settings and parameters.</p>

            <div className="border-b border-outline">
                <nav className="-mb-px flex space-x-6">
                    <TabButton activeTab={activeTab} tabName="roles" label="Roles & Permissions" icon={UsersIcon} onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="notifications" label="Notifications" icon={BellIcon} onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="security" label="Security" icon={ShieldIcon} onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="audit" label="Audit Log" icon={HistoryIcon} onClick={setActiveTab} />
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'roles' && <RolesTab />}
                {activeTab === 'security' && <SecurityTab />}
                {activeTab === 'audit' && <AuditLogTab />}
                {activeTab === 'notifications' && <p>Notification templates coming soon.</p>}
            </div>
        </div>
    );
};

export default SystemConfiguration;
