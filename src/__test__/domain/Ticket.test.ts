import { Ticket } from "../../domain/entities/Ticket.js";

describe('Ticket Entity', () => {
    test('should create ticket with valid title', () => {
        const ticket = Ticket.create({
            title: 'Học TypeScript'
        });
        
        expect(ticket.title).toBe('Học TypeScript');
        expect(ticket.status).toBe('open');
        expect(ticket.priority).toBe('medium');
    });

    test('should throw error with short title', () => {
        expect(() => {
            Ticket.create({ title: 'ab' });
        }).toThrow('VALIDATION_ERROR');
    });

    test('should update status successfully', () => {
        const ticket = Ticket.create({ title: 'Test' });
        ticket.updateStatus('in_progress');
        expect(ticket.status).toBe('in_progress');
    });
});