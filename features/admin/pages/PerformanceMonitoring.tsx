import React, { useState } from 'react';
import { SystemMetric } from '../../../types';
import { MOCK_SYSTEM_METRICS } from '../../../constants';
import { Activity, TrendingUpIcon, ShieldAlertIcon } from '../../../components/icons';

const MetricCard: React.FC<{ metric: SystemMetric }> = ({ metric }) => {
    const isPositive = metric.change >= 0;
    return (
        <div className="bg-surface p-5 rounded-lg shadow-sm border border-outline/20">
            <p className="text-body-md text-on-surface-variant">{metric.name}</p>
            <p className="text-display-sm font-bold text-on-surface mt-2">{metric.value}{metric.unit}</p>
            <div className={`flex items-center text-body-md mt-2 ${isPositive ? 'text-tertiary' : 'text-error'}`}>
                <TrendingUpIcon className={`h-4 w-4 mr-1 ${!isPositive && 'transform rotate-180'}`} />
                <span>{metric.change > 0 ? '+' : ''}{metric.change}% (24h)</span>
            </div>
        </div>
    );
};

const ResponseTimeChart: React.FC = () => {
    // Mock data for the chart
    const data = [120, 110, 130, 115, 125, 120, 118, 122];
    const max = Math.max(...data);
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 90}`).join(' ');

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
            <h3 className="text-title-lg font-medium text-on-surface mb-4">API Response Time (ms)</h3>
            <div className="h-64 relative">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline fill="none" stroke="var(--color-primary)" strokeWidth="2" points={points} />
                </svg>
            </div>
        </div>
    );
};

const SystemAlerts: React.FC = () => {
    const alerts = [
        { id: 1, level: 'High', message: 'Database CPU utilization at 92%', time: '2 min ago', color: 'bg-error-container text-on-error-container' },
        { id: 2, level: 'Medium', message: 'API latency spike detected on auth service', time: '15 min ago', color: 'bg-yellow-100 text-yellow-800' },
    ];
    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
            <h3 className="text-title-lg font-medium text-on-surface mb-4 flex items-center"><ShieldAlertIcon className="h-5 w-5 mr-2 text-error" />System Alerts</h3>
            <div className="space-y-3">
                {alerts.map(alert => (
                    <div key={alert.id} className={`p-3 rounded-md ${alert.color}`}>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold">{alert.level}</span>
                            <span className="opacity-80">{alert.time}</span>
                        </div>
                        <p className="text-body-md mt-1">{alert.message}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

const PerformanceMonitoring: React.FC = () => {
    const [metrics] = useState<SystemMetric[]>(MOCK_SYSTEM_METRICS);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-headline-sm text-on-surface">Performance Monitoring</h2>
                <p className="text-body-md text-on-surface-variant mt-1">Real-time application performance, API usage, and system health.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map(metric => <MetricCard key={metric.id} metric={metric} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ResponseTimeChart />
                </div>
                <div>
                    <SystemAlerts />
                </div>
            </div>
        </div>
    );
};

export default PerformanceMonitoring;
