import { TicketValidator } from "../../domain/validators/TicketValidator.js";
describe('TicketValidator', () => {
  describe('validateTitle', () => {
    test('should pass with valid title', () => {
      expect(() => {
        TicketValidator.validateTitle('Học TypeScript');
      }).not.toThrow();
    });

    test('should throw error when title is empty', () => {
      expect(() => {
        TicketValidator.validateTitle('');
      }).toThrow('VALIDATION_ERROR');
    });

    test('should throw error when title is too short', () => {
      expect(() => {
        TicketValidator.validateTitle('ab');
      }).toThrow('VALIDATION_ERROR');
    });
  });

  describe('validateStatus', () => {
    test('should pass with valid status', () => {
      expect(() => {
        TicketValidator.validateStatus('open');
        TicketValidator.validateStatus('in_progress');
        TicketValidator.validateStatus('review');
        TicketValidator.validateStatus('closed');
      }).not.toThrow();
    });

    test('should throw error with invalid status', () => {
      expect(() => {
        TicketValidator.validateStatus('invalid' as any);
      }).toThrow('VALIDATION_ERROR');
    });
  });
});