import { TicketService } from "../../domain/services/TicketService.js";
import { Ticket } from "../../domain/entities/Ticket.js";
import type { ITicketRepository } from "../../ports/outbound/ITicketRepository.js";

class MockRepository implements ITicketRepository{
    private tickets: Map<string, Ticket> = new Map();

    async save(ticket: Ticket): Promise<void>{
        this.tickets.set(ticket.id, ticket);
    }

    async findById(id: string):Promise<Ticket | null>{
        return this.tickets.get(id) || null;

    }

    async findAll(filters?: any): Promise<Ticket[]> {
        let tickets = Array.from(this.tickets.values());
        if(filters?.status){
            tickets = tickets.filter(t=>t.status === filters.stattus);

        }
        return tickets;

    }

    async update(ticket: Ticket): Promise<void>{
        this.tickets.set(ticket.id, ticket);
    }

    async delete(id: string): Promise<void> {
        this.tickets.delete(id);
    }
}

describe('TicketService', () => {
  let service: TicketService;
  let mockRepo: MockRepository;

  beforeEach(() => {
    mockRepo = new MockRepository();
    service = new TicketService(mockRepo);
  });

  describe('createTicket', () => {
    test('should create and save ticket', async () => {
      const ticket = await service.createTicket({
        title: 'Test Ticket',
        priority: 'high',
        tags: ['test']
      });

      expect(ticket.id).toBeDefined();
      expect(ticket.title).toBe('Test Ticket');
      
      // Kiểm tra ticket đã được lưu
      const saved = await service.getTicket(ticket.id);
      expect(saved).not.toBeNull();
    });
  });

  describe('getTicket', () => {
    test('should throw error for non-existent ticket', async () => {
        await expect(service.getTicket('non-existent'))
            .rejects
            .toThrow('BUSINESS_ERROR: Ticket with non-existent not found');
    });
});

  describe('updateTicketStatus', () => {
    test('should update status successfully', async () => {
      const created = await service.createTicket({
          title: 'Test',
          tags: []
      });
      
      const updated = await service.updateTicketStatus(created.id, 'in_progress');
      
      expect(updated.status).toBe('in_progress');
    });

    test('should throw error for non-existent ticket', async () => {
      await expect(service.updateTicketStatus('non-existent', 'closed'))
        .rejects.toThrow('not found');
    });
  });
});