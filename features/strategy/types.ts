
import { ScaleITCategory } from '../shared/types';

export type TaskQuarter = 'this' | 'next' | 'backlog';

export interface Commitment {
    id: number;
    title: string;
    description?: string;
    quarter: number;
    year: number;
    status?: string;
    result?: string;
}

export interface MileStep {
    id: number;
    title: string;
    commitmentId: number;
    order?: number;
}

export interface Task {
    id: number;
    text: string;
    completed: boolean;
    isWin: boolean;
    quarter: TaskQuarter;
    sourceSessionId?: string;
    winDate?: string;
    dueDate?: string;
    timeSpent?: number;
    category?: ScaleITCategory;
    notes?: string;
    commitmentId?: number;
    mileStepId?: number;
    owner?: string;
    tenantId?: string;
    status?: 'suggested' | 'accepted' | 'dismissed';
}

export interface Idea {
    id: number;
    text: string;
    tags: string[];
    createdAt: string;
}

export interface Scenario {
    revenueGrowth: number;
    cogsPercentage: number;
    opexGrowth: number;
}

export interface MemberGoal {
    id: string;
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    category: ScaleITCategory;
}

export interface FinancialData {
    revenue: number;
    cogs: number;
    opex: number;
}


export interface VisionSection {
    id: string;
    title: string;
    subtitle?: string;
    // We need to handle the Icon type. React.ElementType might need React import or be generic.
    // Ideally types should be agnostic, but if it's for UI config, it handles components.
    // For pure domain types, we might want to store 'iconName' string instead.
    // However, given the current codebase uses React.ElementType in types, I will keep it but might need React import.
    // Actually, looking at the file, it imports ScaleITCategory. 
    // I'll add 'any' or check if I can import React. 
    // Ideally, avoid React dependencies in pure domain types if possible, but for 'VisionSection' which is a UI-config object, it implies UI.
    // But wait, the previous definition in BigPictureVisionPage had `icon: React.ElementType`.
    // I will use `any` or `unknown` for now if React isn't imported, or add `import React from 'react'` if technically allowed in this file.
    // Using `any` for the icon to avoid adding React dependency to types file if not needed, or just `unknown`.
    // Better: `icon: any;` for simplicity in this refactor, or better `icon?: any`.
    icon: any;
    bgColor: string;
    borderColor: string;
    content: string;
    imageUrl?: string;
    hasDatePicker?: boolean;
    date?: string;
}

export interface RevenueStream {
    id: string;
    /** Name of the product or service. */
    name: string;
    /** Average price per unit. */
    price: number;
    /** Projected number of sales. */
    salesCount: number;
    /** Gross Profit percentage. */
    gpPercent?: number;
}

export interface ModelHistory {
    id: number;
    date: string;
    version: string;
    topChoice: string;
    status: string;
    tenantId?: string;
    // Potentially store the answers too?
    answers?: Record<string, string>;
}

export interface Milestone {
    title: string;
    date: string;
    completed: boolean;
    description: string;
}
