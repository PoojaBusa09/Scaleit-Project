
export interface ExecutiveBriefing {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    summary: string;
    strategy: {
        title: string;
        items: string[];
        impact: string;
    };
    execution: {
        title: string;
        items: string[];
        impact: string;
    };
    risks: {
        title: string;
        items: string[];
        impact: string;
    };
}

export const MOCK_BRIEFINGS: ExecutiveBriefing[] = [
    {
        id: 'br_1',
        date: '2026-01-20',
        title: 'Post-Q4 Strategy Adjustment',
        summary: 'Review of Q4 performance indicates strong revenue growth but operational bottlenecks. Strategic focus shifting to hiring and automation.',
        strategy: {
            title: 'Growth Goals Updated',
            items: ['Revised ARR target to $1.2M', 'Approved 2 new sales hires'],
            impact: '+15% Target'
        },
        execution: {
            title: '3 Critical Tasks Closed',
            items: ['CRM Migration Completed', 'Q1 Marketing Budget Finalized', 'Vendor Contracts Signed'],
            impact: 'On Track'
        },
        risks: {
            title: 'Cash Flow Risk Identified',
            items: ['Delayed payments from Client X', 'Unexpected server costs'],
            impact: 'Mitigation Plan Created'
        }
    },
    {
        id: 'br_2',
        date: '2026-01-05',
        title: 'New Year Kickoff',
        summary: 'Initial planning session for 2026. Focus on market expansion and product stability.',
        strategy: {
            title: 'Market Expansion Plan',
            items: ['Defined target geography: West Coast', 'Competitor analysis completed'],
            impact: 'New Opportunities'
        },
        execution: {
            title: 'Q1 Roadmap Finalized',
            items: ['Feature X, Y, Z locked', 'Engineering sprint capacity planned'],
            impact: 'Ready to Build'
        },
        risks: {
            title: 'Hiring Delays',
            items: ['Senior Dev role unfilled for 45 days'],
            impact: 'Delay Risk: Medium'
        }
    },
    {
        id: 'br_3',
        date: '2025-12-15',
        title: 'End of Year Review',
        summary: 'Comprehensive review of 2025 performance. Met 80% of key objectives.',
        strategy: {
            title: '2025 Retrospective',
            items: ['Customer retention up 10%', 'Churn rate stable'],
            impact: 'Solid Foundation'
        },
        execution: {
            title: 'Holiday Ops Plan',
            items: ['Support rotation schedule fixed', 'Feature freeze in effect'],
            impact: 'Stability'
        },
        risks: {
            title: 'None',
            items: [],
            impact: 'Low'
        }
    }
];
