
export type TicketStatus = 'Open' | 'In Progress' | 'Closed';
export type TicketCategory = 'Billing' | 'Technical' | 'Mentor Support' | 'General';

export interface SupportTicket {
    id: string;
    subject: string;
    category: TicketCategory;
    status: TicketStatus;
    lastUpdated: string;
}
