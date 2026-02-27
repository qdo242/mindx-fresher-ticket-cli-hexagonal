import { HttpTicketRepository } from "./adapters/secondary/HttpTicketRepository.js";
import { TicketService } from "./domain/services/TicketService.js";
import { CliAdapter } from "./adapters/primary/CliAdapter.js";


const repository = new HttpTicketRepository('http://localhost:3000');

const ticketService = new TicketService(repository);

const cli = new CliAdapter(ticketService);

cli.handleCommand(process.argv).catch(console.error);