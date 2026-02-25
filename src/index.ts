import { FileRepository } from "./adapters/secondary/FileRepository.js";
import { TicketService } from "./domain/services/TicketService.js";
import { CliAdapter } from "./adapters/primary/CliAdapter.js";


const repository = new FileRepository();

const ticketService = new TicketService(repository);

const cli = new CliAdapter(ticketService);

cli.handleCommand(process.argv).catch(console.error);