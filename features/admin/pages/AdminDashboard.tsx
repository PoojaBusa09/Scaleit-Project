import React from 'react';
import { Link } from 'react-router-dom';
// Fix: Corrected import path for constants
import { MOCK_ADMIN_KPIS, MOCK_ADMIN_USER } from '../../../constants.ts';
import { MOCK_MENTOR_CLIENTS } from '../../../data/mockMentors.ts';
// Fix: Corrected import path for types
import { AdminKPI } from '../../../types.ts';
// Fix: Corrected import path for icons
import { TrendingUpIcon, AlertTriangleIcon } from '../../../components/icons.tsx';

const KpiCard: React.FC<{ kpi: AdminKPI }> = ({ kpi }) => {
    const isPositive = kpi.change >= 0;
    return (
        <div className="bg-surface p-5 rounded-lg shadow-sm border border-outline/20">
            <p className="text-body-md text-on-surface-variant">{kpi.title}</p>
            <p className="text-display-sm font-bold text-on-surface mt-2">{kpi.value}</p>
            <div className={`flex items-center text-body-md mt-2 ${isPositive ? 'text-tertiary' : 'text-error'}`}>
                <TrendingUpIcon className={`h-4 w-4 mr-1 ${!isPositive && 'transform rotate-180'}`} />
                <span>{kpi.change}% vs. last {kpi.period}</span>
            </div>
        </div>
    );
};

const AtRiskClientsPanel: React.FC = () => {
    const atRiskClients = MOCK_MENTOR_CLIENTS.filter(c => c.status === 'atRisk');

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
            <div className="flex items-center mb-4">
                <AlertTriangleIcon className="h-6 w-6 text-error" />
                <h3 className="text-title-lg font-medium text-on-surface ml-3">"At-Risk" Alert Panel</h3>
            </div>
            <p className="text-body-md text-on-surface-variant mb-4">Clients flagged by AI for low engagement or missed sessions.</p>
            <div className="space-y-3">
                {atRiskClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-error-container rounded-md">
                        <div className="flex items-center">
                            <img src={client.avatarUrl} alt={client.name} className="h-10 w-10 rounded-full" />
                            <div className="ml-3">
                                <p className="font-medium text-body-lg text-on-error-container">{client.name}</p>
                                <p className="text-body-sm text-on-error-container/80">{client.company}</p>
                            </div>
                        </div>
                        <Link to={`/mentor/client/${client.id}`} className="text-label-lg font-medium text-error hover:underline">View</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-headline-lg text-on-surface">Command Center</h1>
                <p className="text-body-lg text-on-surface-variant mt-1">Platform health and key business metrics for {MOCK_ADMIN_USER.name}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_ADMIN_KPIS.map(kpi => <KpiCard key={kpi.title} kpi={kpi} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AtRiskClientsPanel />
                </div>
                <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
                    <h3 className="font-medium text-title-lg mb-3">Recent Activity Feed</h3>
                    <ul className="space-y-3 text-body-md">
                        <li className="flex items-start">
                            <span className="text-tertiary mr-3 mt-1">●</span>
                            <div>
                                <span className="font-medium text-on-surface">Nia Adebayo</span> was assigned to mentor <span className="font-medium text-on-surface">Jordan Lee</span>.
                                <p className="text-sm text-on-surface-variant">5 minutes ago</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-secondary mr-3 mt-1">●</span>
                            <div>
                                <span className="font-medium text-on-surface">System update</span> to version 2.1.3 was completed.
                                <p className="text-sm text-on-surface-variant">1 hour ago</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-3 mt-1">●</span>
                            <div>
                                <span className="font-medium text-on-surface">Emily Carter</span> onboarded a new client: <span className="font-medium text-on-surface">Construct Co.</span>.
                                <p className="text-sm text-on-surface-variant">3 hours ago</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;