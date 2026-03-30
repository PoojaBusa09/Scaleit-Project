import React, { useState } from 'react';
import { PieChartIcon, BarChartIcon, FileOutputIcon, DownloadIcon } from '../../../components/icons';

type Tab = 'dashboard' | 'builder';

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

const AnalyticsDashboardTab: React.FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-4 rounded-lg shadow-sm border border-outline/20">
            <h3 className="font-medium text-title-md mb-2">Member Engagement by Industry</h3>
            <p className="text-center text-on-surface-variant p-16">Chart Placeholder</p>
        </div>
        <div className="bg-surface p-4 rounded-lg shadow-sm border border-outline/20">
            <h3 className="font-medium text-title-md mb-2">Mentor Utilization Rate</h3>
            <p className="text-center text-on-surface-variant p-16">Chart Placeholder</p>
        </div>
    </div>
);

const ReportBuilderTab: React.FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-surface p-4 rounded-lg shadow-sm border border-outline/20">
            <h3 className="font-medium text-title-md mb-4">Report Builder</h3>
            <form className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <select className="w-full mt-1 p-2 border border-outline rounded-md">
                        <option>User Activity</option>
                        <option>Financial Performance</option>
                        <option>Program Effectiveness</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <input type="date" className="w-full mt-1 p-2 border border-outline rounded-md" />
                    <input type="date" className="w-full mt-1 p-2 border border-outline rounded-md" />
                </div>
                <div>
                    <button type="button" className="w-full bg-primary text-on-primary py-2 rounded-full font-medium">Generate Report</button>
                </div>
            </form>
        </div>
        <div className="lg:col-span-2 bg-surface p-4 rounded-lg shadow-sm border border-outline/20">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-title-md">Report Preview: User Activity</h3>
                <button className="flex items-center bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm font-medium">
                    <DownloadIcon className="h-4 w-4 mr-2" /> Export
                </button>
            </div>
            <p className="text-center text-on-surface-variant p-16">Generated Report Table Placeholder</p>
        </div>
    </div>
);

const ReportingAnalytics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
            <h2 className="text-headline-sm text-on-surface">Reporting & Analytics</h2>
            <p className="text-body-md text-on-surface-variant mt-1 mb-6">Create custom reports and visualize platform data.</p>

            <div className="border-b border-outline">
                <nav className="-mb-px flex space-x-6">
                    <TabButton activeTab={activeTab} tabName="dashboard" label="Analytics Dashboard" icon={PieChartIcon} onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="builder" label="Custom Report Builder" icon={FileOutputIcon} onClick={setActiveTab} />
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'dashboard' && <AnalyticsDashboardTab />}
                {activeTab === 'builder' && <ReportBuilderTab />}
            </div>
        </div>
    );
};

export default ReportingAnalytics;
