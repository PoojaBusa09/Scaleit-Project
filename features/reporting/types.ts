
export interface AdminKPI {
    title: string;
    value: string;
    change: number;
    period: string;
}

// Super Admin Specific Types
export interface SystemMetric {
    id: string;
    name: string;
    value: string;
    unit: string;
    change: number;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}
