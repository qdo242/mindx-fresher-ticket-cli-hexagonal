import type { TicketStatus, TicketPriority } from "../types.js";
import { Ticket } from "../entities/Ticket.js";
import { TicketValidator } from "../validators/TicketValidator.js";
import type { ITicketRepository } from "../../ports/outbound/ITicketRepository.js";
import type { ITicketService } from "../../ports/inbound/ITicketService.js";

export class TicketService implements ITicketService{
    constructor(private readonly repository: ITicketRepository){}

    //create ticket
    async createTicket(params: {
        title: string;
        description?: string;
        priority?: TicketPriority;
        tags: string[];
    }): Promise<Ticket> {

        //Validate
        TicketValidator.validateTitle(params.title);
        if(params.priority){
            TicketValidator.validatePriority(params.priority);
        }
        if(params.tags){
            TicketValidator.validateTags(params.tags);
        }

        //create entity
        const ticket = Ticket.create({
            title: params.title,
            description: params.description,
            priority: params.priority,
            tags: params.tags
        });

        await this.repository.save(ticket);
        return ticket;
    }

    //get ticket

    async getTicket(id: string): Promise<Ticket | null> {
        const ticket = await this.repository.findById(id);
        if(!ticket){
            throw new Error(`BUSINESS_ERROR: Ticket with ${id} not found`);
        }
        return ticket;
    }


    async listTicket(filters?: {
        status?: TicketStatus;
        priority?: TicketPriority;
        tags?: string[];
    }): Promise<Ticket[]> {
        if(filters?.status){
            TicketValidator.validateStatus(filters.status);
        }

        if(filters?.priority){
            TicketValidator.validatePriority(filters.priority);
        }

        return this.repository.findAll(filters)
    }


    async updateTicketStatus(id: string, newStatus: TicketStatus): Promise<Ticket> {
        TicketValidator.validateStatus(newStatus);

        //get
        const ticket = await this.repository.findById(id);

        if(!ticket){
            throw new Error(`BUSINESS_ERROR: Ticket with ${id} not found`);
        }

        ticket.updateStatus(newStatus);

        await this.repository.update(ticket);

        return ticket;
    }


    async addTagtoTicket(id:string, tag:string): Promise<Ticket> {
        const ticket = await this.repository.findById(id);
        if(!ticket){
            throw new Error(`BUSINESS_ERROR: Ticket with ${id} not found`);
        }

        ticket.addTag(tag);
        await this.repository.update(ticket);

        return ticket;
    }

    async removeTagfromTicket(id:string, tag:string): Promise<Ticket>{
        const ticket = await this.repository.findById(id);
        if(!ticket){
            throw new Error(`BUSINESS_ERROR: Ticket with ${id} not found`);
        }

        ticket.removeTag(tag);
        await this.repository.update(ticket);
        return ticket;
    }

    async deleteTicket(id: string):Promise<void> {
        const ticket = await this.repository.findById(id);
        if(!ticket){
            throw new Error(`BUSINESS_ERROR: Ticket with ${id} not found`);
        }

        await this.repository.delete(id);
    }
    
}