
export interface Transaction {
    id: string;
    date: string;
    user: string;
    type: 'Subscription' | 'One-time';
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    tenantId?: string;
}

export interface Subscription {
    id: string;
    user: string;
    plan: 'Growth' | 'Pro' | 'Enterprise';
    status: 'Active' | 'Canceled' | 'Past Due';
    nextBillingDate: string;
    mrr: number;
    tenantId?: string;
}
