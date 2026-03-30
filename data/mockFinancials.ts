import { FinancialData, Transaction, Subscription } from '../types.ts';

export interface MemberGoal {
    id: string;
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    category: 'C' | 'S' | 'A';
}

export const MOCK_MEMBER_GOALS: MemberGoal[] = [
    { id: '1', title: 'Annual Revenue', currentValue: 850000, targetValue: 1200000, unit: '$', category: 'C' },
    { id: '2', title: 'New Customer Growth', currentValue: 12, targetValue: 20, unit: '%', category: 'S' },
    { id: '3', title: 'Team Size', currentValue: 8, targetValue: 12, unit: 'Employees', category: 'A' },
];

export const MOCK_FINANCIAL_DATA: FinancialData = { revenue: 1200000, cogs: 400000, opex: 600000 };

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'txn_123', date: '2025-07-15', user: 'Innovate Inc.', type: 'Subscription', amount: 1500, status: 'Completed' },
    { id: 'txn_124', date: '2025-07-14', user: 'Cucina Bella', type: 'Subscription', amount: 1500, status: 'Completed' },
    { id: 'txn_125', date: '2025-07-14', user: 'Construct Co.', type: 'Subscription', amount: 1500, status: 'Failed' },
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
    { id: 'sub_1', user: 'Innovate Inc.', plan: 'Pro', status: 'Active', nextBillingDate: '2025-08-15', mrr: 1500 },
    { id: 'sub_2', user: 'Cucina Bella', plan: 'Pro', status: 'Active', nextBillingDate: '2025-08-14', mrr: 1500 },
    { id: 'sub_3', user: 'Construct Co.', plan: 'Pro', status: 'Past Due', nextBillingDate: '2025-07-14', mrr: 1500 },
];
