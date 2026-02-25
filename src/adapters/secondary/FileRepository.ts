import fs from 'fs/promises';
import path from 'path';
import { Ticket } from '../../domain/entities/Ticket.js';
import type { ITicketRepository } from '../../ports/outbound/ITicketRepository.js';
import process from 'process';


export class FileRepository implements ITicketRepository {

    private filePath: string;

    constructor(){
        this.filePath = path.join(process.cwd(), 'data','ticket.json')
    }


    private async readFile(): Promise<any> {
        try {
            const data = await fs.readFile(this.filePath,'utf-8');
            return JSON.parse(data)

        } catch (error){
            return {}
        }
    }

    private async writeFile(data: any):Promise<void> {
        await fs.mkdir(path.dirname(this.filePath), {recursive:true});

        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    private serialize(ticket: Ticket): any{

        return{
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            tags: ticket.tags,
            createdAt: ticket.createdAt.toISOString(),
            updatedAt: ticket.updatedAt.toISOString()
        }
    }

    private deserialize(data: any): Ticket {
        
        return new Ticket({
            id: data.id,
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            tags: data.tags || [],
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt)
        });
    }


    async save(ticket: Ticket): Promise<void> {
        const data = await this.readFile();   
        data[ticket.id] = this.serialize(ticket);
        await this.writeFile(data);
    }

    async findById(id: string): Promise<Ticket | null> {
        const data = await this.readFile();

        if(data[id]){
            return this.deserialize(data[id])

        }

        return null;
    }

    async findAll(filters?: { status?: string; priority?: string; tags?: string[]; }): Promise<Ticket[]> {
        const data = await this.readFile();

        let tickets = Object.values(data).map((item: any)=> this.deserialize(item));

        if(filters){
            if(filters.status){
                tickets = tickets.filter(t => t.status === filters.status);
            }

            if(filters.priority){
                tickets = tickets.filter(t => t.priority === filters.priority);
            }
            if(filters.tags && filters.tags.length >0){
                tickets = tickets.filter(t => filters.tags!.some(tag=>t.checkTag(tag)));
            }
        }

        return tickets;
    }


    async update(ticket: Ticket): Promise<void> {
        await this.save(ticket)
    }


    async delete(id: string): Promise<void> {
        const data = await this.readFile();
        delete data[id];

        await this.writeFile(data)
    }


}

