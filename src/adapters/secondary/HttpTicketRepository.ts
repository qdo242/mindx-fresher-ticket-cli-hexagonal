import axios  from "axios";
import { Ticket } from "../../domain/entities/Ticket.js";
import type { ITicketRepository } from "../../ports/outbound/ITicketRepository.js";
import type { TicketStatus, TicketPriority } from "../../domain/types.js";


export class HttpTicketRepository implements ITicketRepository{
    private apiUrl: string;

    constructor(baseUrl: string = 'http://localhost:3000'){
        this.apiUrl = baseUrl;
    }


    async save(ticket: Ticket): Promise<void> {
        try{
            await axios.post(`${this.apiUrl}/tickets`, ticket.toJSON());
            console.log('Save ticket success');
        } catch (error: any){
            throw new Error('Error save ticket');
        }
    }

    async findById(id: string): Promise<Ticket | null> {
        try{
            const response = await axios.get(`${this.apiUrl}/tickets/${id}`);
            return Ticket.fromJSON(response.data);
        } catch (error: any){
            if(error.response?.status === 404){
                return null;
            }
        }
        throw new Error('Error to find ticket');
    }


    async findAll(filters?: { status?: string; priority?: string; tags?: string[]; }): Promise<Ticket[]> {
        try{
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.priority) params.append('priority', filters.priority);
            if (filters?.tags) params.append('tags', filters.tags.join(','));

            const url = params.toString()
                ? `${this.apiUrl}/tickets?${params}`
                : `${this.apiUrl}/tickets`;

                const response = await axios.get(url);
                return response.data.map((item: any) => Ticket.fromJSON(item));
        }catch (error: any){
            throw new Error('Error filters');
        }

        
    }


    async update(ticket: Ticket): Promise<void> {
        try{
            await axios.put(`${this.apiUrl}/tickets/${ticket.id}`, ticket.toJSON());
        }catch(error: any){
            throw new Error('Error update');
        }
    }

    async delete(id: string): Promise<void> {
        try{
            await axios.delete(`${this.apiUrl}/tickets/${id}`);
        } catch(error: any){
            throw new Error('Error delete');
        }
    }
}