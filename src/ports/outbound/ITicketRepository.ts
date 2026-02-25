import type { Ticket } from "../../domain/entities/Ticket.js";

/**
 * Interface định nghĩa những gì domain cần để lưu trữ dữ liệu
 * Adapter (FileRepo) sẽ implement các method này
 */


export interface ITicketRepository {
    /**
     *  Save new ticket to storage
     * @param ticket 
     */

    save(ticket: Ticket): Promise<void>

    /**
     * Find ticket by ID
     * @param id
     * @returns 
     */

    findById(id: string): Promise<Ticket | null>

    /**
     * Find all ticket
     * @param filters
     * @returns
     */

    findAll(filters?: {
        status?: string;
        priority?: string;
        tags?: string[];
    }): Promise<Ticket[]>;


    /**
     * Update ticket
     * @param update
     */

    update(ticket: Ticket):Promise<void>;

    /**
     * Delete ticket by id
     * @param id
     * @param delete
     */

    delete(id: string): Promise<void>;


}