import type { Ticket } from "../../domain/entities/Ticket.js";
import type { TicketStatus, TicketPriority } from "../../domain/types.js";

/**
 * INBOUND PORT - Core cung cấp cho bên ngoài
 * 
 * Interface này định nghĩa tất cả những gì domain có thể làm
 * Adapter (CLI) sẽ gọi các method này để tương tác với domain
 */

export interface ITicketService{
    /**
     * Create new ticket
     * @param params.title
     * @param params.description
     * @param params.priority
     * @param params.tags
     * @returns
     * @throws
     */

    createTicket(params: {
        title: string;
        description?: string;
        priority?: string;
        tags?: string[];
    }): Promise<Ticket> 

    /**
     * Get ticket
     * @param id
     * @returns
     */


    getTicket(id: string): Promise<Ticket | null>;


    /**
     * List ticket
     * @param id
     * @param filters
     * @returns
     */

    listTicket(filters?:{
        status?: TicketStatus;
        priority?: TicketPriority;
        tags?: string[];
    }): Promise<Ticket[]>


    /**
     * Update ticket status
     * @param id
     * @param status
     * @returns
     * @throws 
     */

    updateTicketStatus(id: string, newStatus: TicketStatus):Promise<Ticket>;


    /**
     * Add tag to Ticket
     * @param id
     * @param tag
     * @returns
     * @throws 
     */

    addTagtoTicket(id: string, tag: string): Promise<Ticket>;

    /**
     * Add tag to Ticket
     * @param id
     * @param tag
     * @returns
     * @throws 
     */

    removeTagfromTicket(id: string, tag: string):Promise<Ticket>;


    /**
     * Delete ticket
     * @param id
     * @throws
     */

    deleteTicket(id: string): Promise<void>;


}