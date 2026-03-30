
import React, { useState } from 'react';
import { SearchIcon, WrenchIcon, Activity, AlertTriangleIcon, CheckCircleIcon, ShieldAlertIcon, Server, DatabaseZapIcon, ClockIcon } from '../../../components/icons';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';
type SystemStatus = 'Healthy' | 'Degraded' | 'Down';

interface LogEntry {
    id: string;
    timestamp: string;
    level: LogLevel;
    service: string;
    message: string;
}

const MOCK_LOGS: LogEntry[] = [
    { id: '1', timestamp: '10:32:15.452', level: 'INFO', service: 'AuthService', message: "User 'Casey Miller' updated role 'Mentor'." },
    { id: '2', timestamp: '10:30:05.120', level: 'INFO', service: 'Gateway', message: "User 'Casey Miller' logged in successfully." },
    { id: '3', timestamp: '10:29:50.800', level: 'WARN', service: 'MetricsAPI', message: "API endpoint /api/v1/metrics responded in 530ms (Threshold: 500ms)." },
    { id: '4', timestamp: '10:28:01.005', level: 'ERROR', service: 'IntegrationService', message: "Failed to connect to QuickBooks API: Authentication expired." },
    { id: '5', timestamp: '10:25:12.330', level: 'INFO', service: 'NotificationSvc', message: "Daily digest email job completed. Sent 450 emails." },
    { id: '6', timestamp: '10:22:45.990', level: 'WARN', service: 'Database', message: "High connection pool usage (85%)." },
];

const StatusBadge: React.FC<{ status: SystemStatus }> = ({ status }) => {
    const colors = {
        'Healthy': 'bg-green-100 text-green-800 border-green-200',
        'Degraded': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Down': 'bg-red-100 text-red-800 border-red-200',
    }[status];

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
            {status}
        </span>
    );
};

const LogRow: React.FC<{ log: LogEntry }> = ({ log }) => {
    const levelStyles = {
        'INFO': 'text-blue-600 bg-blue-50 border-blue-200',
        'WARN': 'text-yellow-600 bg-yellow-50 border-yellow-200',
        'ERROR': 'text-red-600 bg-red-50 border-red-200',
    }[log.level];

    return (
        <tr className="hover:bg-surface-variant/30 transition-colors border-b border-surface-variant/50 last:border-0 text-sm">
            <td className="px-4 py-3 whitespace-nowrap font-mono text-on-surface-variant/80 text-xs">{log.timestamp}</td>
            <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${levelStyles}`}>
                    {log.level}
                </span>
            </td>
            <td className="px-4 py-3 whitespace-nowrap font-medium text-on-surface-variant">{log.service}</td>
            <td className="px-4 py-3 text-on-surface w-full">{log.message}</td>
        </tr>
    );
};

const DiagnosticCard: React.FC<{ title: string, status: SystemStatus, uptime: string, icon: React.ElementType }> = ({ title, status, uptime, icon: Icon }) => (
    <div className="bg-surface p-5 rounded-lg border border-outline/20 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${status === 'Healthy' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h4 className="font-medium text-on-surface">{title}</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Uptime: {uptime}</p>
            </div>
        </div>
        <div className="text-right">
            <StatusBadge status={status} />
            <button className="block text-xs font-medium text-primary hover:underline mt-2">Run Diagnostics</button>
        </div>
    </div>
);

const TroubleshootingTools: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'logs' | 'diagnostics' | 'maintenance'>('logs');
    const [searchTerm, setSearchTerm] = useState('');
    const [logLevel, setLogLevel] = useState<'All' | LogLevel>('All');

    const filteredLogs = MOCK_LOGS.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || log.service.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = logLevel === 'All' || log.level === logLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-headline-sm font-bold text-on-surface flex items-center">
                        <WrenchIcon className="h-8 w-8 mr-3 text-on-surface-variant" />
                        System Diagnostics & Troubleshooting
                    </h1>
                    <p className="text-body-md text-on-surface-variant mt-1">Monitor system health, analyze logs, and perform maintenance tasks.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-on-surface-variant">System Operational</span>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-surface p-4 rounded-lg border border-outline/20 shadow-sm">
                    <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Error Rate (24h)</p>
                    <p className="text-2xl font-bold text-on-surface mt-1">0.02%</p>
                    <p className="text-xs text-green-600 flex items-center mt-1"><CheckCircleIcon className="w-3 h-3 mr-1" /> Within limits</p>
                </div>
                <div className="bg-surface p-4 rounded-lg border border-outline/20 shadow-sm">
                    <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Avg API Latency</p>
                    <p className="text-2xl font-bold text-on-surface mt-1">124ms</p>
                    <p className="text-xs text-on-surface-variant mt-1">stable</p>
                </div>
                <div className="bg-surface p-4 rounded-lg border border-outline/20 shadow-sm">
                    <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Active Alerts</p>
                    <p className="text-2xl font-bold text-error mt-1">1 High</p>
                    <p className="text-xs text-on-surface-variant mt-1">2 Warnings</p>
                </div>
                <div className="bg-surface p-4 rounded-lg border border-outline/20 shadow-sm">
                    <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Last Backup</p>
                    <p className="text-2xl font-bold text-on-surface mt-1">2h ago</p>
                    <p className="text-xs text-green-600 mt-1">Verified</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-surface rounded-xl shadow-sm border border-outline/20 overflow-hidden min-h-[600px] flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-outline/20 bg-surface-variant/10">
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'logs' ? 'border-primary text-primary bg-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'}`}
                    >
                        Live Logs
                    </button>
                    <button
                        onClick={() => setActiveTab('diagnostics')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'diagnostics' ? 'border-primary text-primary bg-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'}`}
                    >
                        Component Status
                    </button>
                    <button
                        onClick={() => setActiveTab('maintenance')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'maintenance' ? 'border-primary text-primary bg-surface' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'}`}
                    >
                        Maintenance Utilities
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6 flex-1 bg-surface">
                    {activeTab === 'logs' && (
                        <div className="animate-fade-in-up-fast h-full flex flex-col">
                            <div className="flex gap-4 mb-4">
                                <div className="relative flex-grow">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                                    <input
                                        type="text"
                                        placeholder="Search logs by message or service..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-surface-variant/30 border border-outline/20 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <select
                                    value={logLevel}
                                    onChange={(e) => setLogLevel(e.target.value as LogLevel | 'All')}
                                    className="px-4 py-2 bg-surface-variant/30 border border-outline/20 rounded-lg text-sm focus:ring-2 focus:ring-primary cursor-pointer font-medium"
                                >
                                    <option value="All">All Levels</option>
                                    <option value="INFO">INFO Only</option>
                                    <option value="WARN">WARN Only</option>
                                    <option value="ERROR">ERROR Only</option>
                                </select>
                                <button className="px-4 py-2 bg-surface-variant/50 hover:bg-surface-variant border border-outline/20 rounded-lg text-sm font-medium transition-colors">
                                    Export Logs
                                </button>
                            </div>

                            <div className="flex-1 border border-outline/20 rounded-lg overflow-hidden flex flex-col">
                                <div className="overflow-auto flex-1">
                                    <table className="min-w-full divide-y divide-surface-variant/50">
                                        <thead className="bg-surface-variant/20">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Level</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Service</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Message</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-surface divide-y divide-surface-variant/50">
                                            {filteredLogs.map(log => <LogRow key={log.id} log={log} />)}
                                            {filteredLogs.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-12 text-center text-on-surface-variant">
                                                        No logs found matching your criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'diagnostics' && (
                        <div className="animate-fade-in-up-fast grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DiagnosticCard title="Primary Database (PostgreSQL)" status="Healthy" uptime="99.99%" icon={DatabaseZapIcon} />
                            <DiagnosticCard title="Auth Service (OAuth2)" status="Healthy" uptime="99.95%" icon={ShieldAlertIcon} />
                            <DiagnosticCard title="API Gateway" status="Healthy" uptime="99.98%" icon={Server} />
                            <DiagnosticCard title="Integration Service (QuickBooks)" status="Degraded" uptime="98.50%" icon={Activity} />

                            <div className="lg:col-span-2 mt-4 p-4 bg-surface-variant/10 border border-outline/20 rounded-lg">
                                <h3 className="font-bold text-on-surface mb-2">Automated Health Checks</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Latency Check (us-east-1)</span>
                                        <span className="text-green-600 font-mono">24ms - OK</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Disk Space (Volume A)</span>
                                        <span className="text-green-600 font-mono">45% Free - OK</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-on-surface-variant">Memory Usage</span>
                                        <span className="text-yellow-600 font-mono">78% - WARN</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'maintenance' && (
                        <div className="animate-fade-in-up-fast">
                            <h3 className="text-title-md font-bold text-on-surface mb-4">System Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-5 border border-outline/20 rounded-lg hover:border-primary/50 transition-colors bg-surface-variant/5">
                                    <h4 className="font-bold text-on-surface mb-2">Cache Management</h4>
                                    <p className="text-sm text-on-surface-variant mb-4">Clear Redis cache for all services. May cause temporary latency.</p>
                                    <button className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-md text-sm font-medium hover:bg-secondary-container/80 transition-colors w-full">
                                        Clear App Cache
                                    </button>
                                </div>
                                <div className="p-5 border border-outline/20 rounded-lg hover:border-primary/50 transition-colors bg-surface-variant/5">
                                    <h4 className="font-bold text-on-surface mb-2">Search Indexing</h4>
                                    <p className="text-sm text-on-surface-variant mb-4">Re-build search indexes for Member Directory and Resources.</p>
                                    <button className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-md text-sm font-medium hover:bg-secondary-container/80 transition-colors w-full">
                                        Re-index Data
                                    </button>
                                </div>
                                <div className="p-5 border border-red-200 rounded-lg bg-red-50/30">
                                    <h4 className="font-bold text-error mb-2">Emergency Restart</h4>
                                    <p className="text-sm text-on-surface-variant mb-4">Force restart of the main API service. Use only if unresponsive.</p>
                                    <button className="px-4 py-2 bg-error text-on-error rounded-md text-sm font-medium hover:bg-error/90 transition-colors w-full">
                                        Restart API Service
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TroubleshootingTools;
