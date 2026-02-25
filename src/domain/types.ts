export type TicketStatus = 'open'|'in_progress' | 'review'| 'closed';
export type TicketPriority = 'low' | 'medium' |'high' | 'critical';


export interface Ticket {
    id: string;
    title: string;
    status: TicketStatus;
    priority: TicketPriority;
    description: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date; 
}