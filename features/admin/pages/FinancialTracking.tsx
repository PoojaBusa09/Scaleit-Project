import React, { useState } from 'react';
import { DollarSignIcon, BarChartIcon, DatabaseZapIcon, SearchIcon } from '../../../components/icons';
import { MOCK_TRANSACTIONS, MOCK_SUBSCRIPTIONS } from '../../../constants';
import { Transaction, Subscription } from '../../../types';

type Tab = 'transactions' | 'subscriptions' | 'integrations';

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

const TransactionsTab: React.FC = () => {
    const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    return (
        <div>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                <input type="text" placeholder="Search by user or transaction ID..." className="w-full pl-10 pr-4 py-2 bg-surface-variant rounded-full text-sm" />
            </div>
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="border-b border-outline">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">User</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-right">Amount</th>
                        <th className="p-2 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => (
                        <tr key={t.id} className="border-b border-surface-variant">
                            <td className="p-2">{t.date}</td>
                            <td className="p-2 font-medium">{t.user}</td>
                            <td className="p-2">{t.type}</td>
                            <td className="p-2 text-right">${t.amount.toFixed(2)}</td>
                            <td className="p-2 text-center">{t.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

const SubscriptionsTab: React.FC = () => {
    const [subscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
    return (
        <div>
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="border-b border-outline">
                        <th className="p-2 text-left">User</th>
                        <th className="p-2 text-left">Plan</th>
                        <th className="p-2 text-left">Next Billing</th>
                        <th className="p-2 text-right">MRR</th>
                        <th className="p-2 text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map(s => (
                        <tr key={s.id} className="border-b border-surface-variant">
                            <td className="p-2 font-medium">{s.user}</td>
                            <td className="p-2">{s.plan}</td>
                            <td className="p-2">{s.nextBillingDate}</td>
                            <td className="p-2 text-right">${s.mrr.toFixed(2)}</td>
                            <td className="p-2 text-center">{s.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const IntegrationsTab: React.FC = () => (
    <div className="max-w-md mx-auto mt-4">
        <div className="bg-surface p-4 rounded-lg shadow-sm border border-outline/20">
            <h3 className="font-medium text-title-md mb-2">QuickBooks Integration</h3>
            <div className="flex items-center justify-between">
                <p className="text-body-md text-green-600 font-medium">Connected</p>
                <p className="text-sm text-on-surface-variant">Last sync: 15 min ago</p>
            </div>
            <button className="w-full mt-4 bg-primary text-on-primary py-2 rounded-full font-medium">Sync Now</button>
        </div>
    </div>
);

const FinancialTracking: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('transactions');

    return (
        <div className="bg-surface p-6 rounded-lg shadow-sm border border-outline/20">
            <h2 className="text-headline-sm text-on-surface">Financial Tracking</h2>
            <p className="text-body-md text-on-surface-variant mt-1 mb-6">Track subscriptions, revenue, and manage financial integrations.</p>

            <div className="border-b border-outline">
                <nav className="-mb-px flex space-x-6">
                    <TabButton activeTab={activeTab} tabName="transactions" label="Transactions" icon={DollarSignIcon} onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="subscriptions" label="Subscriptions" icon={BarChartIcon} onClick={setActiveTab} />
                    <TabButton activeTab={activeTab} tabName="integrations" label="Integrations" icon={DatabaseZapIcon} onClick={setActiveTab} />
                </nav>
            </div>

            <div className="mt-6">
                {activeTab === 'transactions' && <TransactionsTab />}
                {activeTab === 'subscriptions' && <SubscriptionsTab />}
                {activeTab === 'integrations' && <IntegrationsTab />}
            </div>
        </div>
    );
};

export default FinancialTracking;
