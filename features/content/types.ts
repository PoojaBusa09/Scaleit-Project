
export interface EmailTemplate {
    id: string;
    name: string;
    type: 'Email' | 'SMS' | 'Push';
    audience: string;
    lastModified: string;
    status: 'Draft' | 'Published' | 'Archived';
    subject?: string;
    content?: string;
    tenantId?: string;
}

export interface Notification {
    id: string;
    name: string;
    trigger: 'Event' | 'Condition' | 'Schedule';
    audience: string;
    status: 'Active' | 'Inactive' | 'Draft';
    message: string;
    tenantId?: string;
}

export interface Form {
    id: string;
    name: string;
    fields: number;
    responses: number;
    status: 'Draft' | 'Published' | 'Closed';
    lastUpdated: string;
    tenantId?: string;
}

export interface WebContent {
    id: string;
    title: string;
    type: 'Page' | 'Blog' | 'Resource';
    author: string;
    status: 'Published' | 'Draft' | 'Scheduled';
    publishDate: string;
    views: number;
    tenantId?: string;
}
