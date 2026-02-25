import type { TicketPriority, TicketStatus } from "../../domain/types.js";
import type { ITicketService } from "../../ports/inbound/ITicketService.js";

export class CliAdapter{
    constructor(private ticketService: ITicketService){}

    async handleCommand(args: string[]): Promise<void> {
        const command = args[2];

        try {
            switch(command){
                case 'create':
                    await this.handleCreate(args.slice(3));
                    break;
                case 'list':
                    await this.handleList(args.slice(3));
                    break;
                case 'show':
                    const id  = args[3];
                    if(!id){
                        console.log('Error: Ticket ID is required to show a ticket.');
                        return;
                    }
                    await this.handleShow(id);
                    break;
                case 'update':
                    const updateId = args[3];
                    const statusFlag = args[4];
                    const newStatus = args[5];
                    if(!updateId){
                        console.log('Error: Ticket ID is required to update a ticket.');
                        return;
                    }
                    if(statusFlag !== '--status'){
                        console.log('Error: Only status update is supported. Use --status flag.');
                        return;
                    }
                    if(!newStatus){
                        console.log('Error: New status value is required to update a ticket.');
                        return;
                    }
                    await this.handleUpdate(updateId, newStatus);
                    break;
                case 'help':
                default:
                    this.showHelp();
            }

        }catch (error: any){
            console.log('Error:', error.message);
        }
    }


    private async handleCreate(args: string[]): Promise<void> {
        if(args.length === 0){
            console.log('Error: Title is required to create a ticket.');
            return;
        }

        const title = args[0];
        if(!title){
            console.log('Error: Title is required to create a ticket.');
            return;
        }
        const description = args[1] || '';
        const priority = args[2] || 'medium';
        const tags = args.slice(3);

        const ticket = await this.ticketService.createTicket({
            title ,
            description,
            priority: priority as any,
            tags
        });

        console.log('Ticket created successfully:');
        console.log(`ID: ${ticket.id}`);
        console.log(`Title: ${ticket.title}`);
        console.log(`Status: ${ticket.status}`);
    }

    private async handleList(args: string[]): Promise<void> {
        const filters: {
            status?: string;
            priority?: string;
            tags?: string[];
        } = {};

        for(let i = 0; i < args.length; i++){
            const flag = args[i];
            const value = args[i+1];

            if(!value) continue;

            if(flag === '--status'){
                filters.status = value;
                i++;
            } else if (flag === '--priority'){
                filters.priority = value;
                i++;
            } else if (flag === '--tags'){
                filters.tags = value.split(',');
                    i++;
            }
    }

    const serviceFilters: {
        status?: TicketStatus;
        priority?: TicketPriority;
        tags?: string[];
    } = {};
    
    if (filters.status) {
        serviceFilters.status = filters.status as TicketStatus;
    }
    if (filters.priority) {
        serviceFilters.priority = filters.priority as TicketPriority;
    }
    if (filters.tags) {
        serviceFilters.tags = filters.tags;
    }
    
    const tickets = await this.ticketService.listTicket(serviceFilters);
    if(tickets.length === 0){
        console.log('No tickets found with the specified filters.');
        return;
    }

    console.log(`List of tickets (${tickets.length}):`);
    console.log('-'.repeat(60));
    tickets.forEach(ticket =>{
        const statusIcon = {
            'open': '🟢',
            'in_progress': '🟡',
            'review': '🟠',
            'closed': '🔴'
        }[ticket.status] || '⚪';
        console.log(`${statusIcon} [${ticket.id}] ${ticket.title}`);
        console.log(`   Status: ${ticket.status} | Priority: ${ticket.priority}`);

        if(ticket.tags.length > 0){
            console.log(`   Tags: ${ticket.tags.join(', ')}`);
        }
        console.log('');
    });
}

    private async handleShow(id: string): Promise<void> {
        if(!id){
            console.log('Error: Ticket ID is required to show a ticket.');
            return;
        }


        console.log(`Fetching details for ticket ID: ${id}...`);
        const ticket = await this.ticketService.getTicket(id);

        if(!ticket){
            console.log(`Ticket with ID ${id} not found.`);
            return;
        }

        console.log('Ticket Details:');
        console.log(`ID: ${ticket.id}`);
        console.log(`Title: ${ticket.title}`);
        console.log(`Description: ${ticket.description}`);
        console.log(`Status: ${ticket.status}`);
        console.log(`Priority: ${ticket.priority}`);
        console.log(`Tags: ${ticket.tags.join(', ')}`);
        console.log(`Created At: ${ticket.createdAt.toLocaleString()}`);
        console.log(`Updated At: ${ticket.updatedAt.toLocaleString()}`);


    }


    private async handleUpdate(id: string, newStatus: string): Promise<void> {

       console.log(`Updating status for ticket ID: ${id} to ${newStatus}...`);
       const ticket = await this.ticketService.updateTicketStatus(id, newStatus as TicketStatus);
       console.log('Ticket status updated successfully:');
    }


    private showHelp(): void {
        console.log(`
            TẠO TICKET MỚI:
        tickets create <title> [description] [priority] [tags...]
  
            Ví dụ:
            tickets create "Học TypeScript" "Cơ bản" high urgent learning

        DANH SÁCH TICKETS:
        tickets list [--status <status>] [--priority <priority>] [--tags <tag1,tag2>]
  
        Ví dụ:
            tickets list
            tickets list --status open
            tickets list --priority high --tags urgent

        XEM CHI TIẾT:
            tickets show <id>
  
        Ví dụ:
            tickets show ticket_123

        CẬP NHẬT:
            tickets update <id> --status <status>
  
        Ví dụ:
            tickets update ticket_123 --status in-progress

        HELP:
            tickets help
            
            `)
    }

}