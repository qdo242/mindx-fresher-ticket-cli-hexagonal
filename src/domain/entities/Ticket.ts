import type { TicketStatus, TicketPriority } from "../types.js";
import  { TicketValidator } from "../validators/TicketValidator.js";

export class Ticket{
    public readonly id: string;
    public readonly createdAt: Date;

    private _title: string;
    private _status: TicketStatus;
    private _priority: TicketPriority;
    private _description: string;
    private _tags: string[];
    private _updatedAt: Date;

    constructor(params: {
        id: string;
        title: string;
        status: TicketStatus;
        priority: TicketPriority;
        description: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
    }) {
        TicketValidator.validateTitle(params.title);
        // TicketValidator.validateDescription(params.description);
        TicketValidator.validateStatus(params.status)
        TicketValidator.validatePriority(params.priority)
        TicketValidator.validateTags(params.tags)
        
        
        this.id = params.id;
        this._title = params.title.trim();
        this._status = params.status;
        this._priority = params.priority;
        this._description = params.description.trim();
        this._tags = [...params.tags];
        this.createdAt = params.createdAt;
        this._updatedAt = params.updatedAt;

    }


    get title(): string {
        return this._title;
    }

    get status(): TicketStatus {
        return this._status;
    }

    get priority(): TicketPriority{
        return this._priority;
    }

    get description(): string {
        return this._description;
    }

    get tags(): readonly string[]{
        return [...this._tags]; 
    }

    get updatedAt(): Date {
        return new Date(this._updatedAt);
    }

    //Business Methods
    updateStatus(newStatus: TicketStatus): void{
        TicketValidator.validateStatus(newStatus);

        //Validate business rules
        TicketValidator.validateStatusTransition(this._status, newStatus);

        if(this._status === newStatus){
            return;
        }

        this._status = newStatus;
        this._updatedAt = new Date();
    }


    updatePriority(newPriority: TicketPriority): void{

        if(this._status == 'closed'){
            throw new Error('BUSINESS_RULE_ERROR: Cannot change priority of closed ticket');
        }

        TicketValidator.validatePriority(newPriority);

        if(this._priority === newPriority){
            return;
        }

        this._priority = newPriority;
        this._updatedAt = new Date();

    }
    
    //tag
    addTag(tag: string): void {
        const trimmedTag = tag.trim().toLowerCase();


        //validate
        TicketValidator.validateTags([trimmedTag]);

        if(!this._tags.includes(trimmedTag)){
            this._tags.push(trimmedTag);
            this._updatedAt = new Date();
        }
    }

    removeTag(tag: string): void{
        const trimmedTag = tag.trim().toLowerCase();
        const index = this._tags.indexOf(trimmedTag);

        if(index !== -1){
            this._tags.splice(index,1);
            this._updatedAt = new Date();

        }
    }

    checkTag(tag: string): boolean {
        return this._tags.includes(tag.trim().toLowerCase())
    }

    //priority
    isHighPriority(): boolean{
        return this._priority === 'high' || this._priority === 'critical';
    }

    //business rule: Overdue

    isOverdue(days: number = 7): boolean {
        if (this._status === 'closed'){
            return false;
        }

        const ageInMs = Date.now() - this.createdAt.getTime();
        const ageInDays = ageInMs/ (1000 * 60 * 60 * 24);

        return ageInDays > days;
    }

    //Factory Method - create a new ticket
    static create(params: {
        title: string;
        description?: string | undefined;
        priority?: TicketPriority | undefined;
        tags? : string[] | undefined;
    }): Ticket {
        const now = new Date();
        const id = `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        return new Ticket({
            id,
            title: params.title,
            description: params.description || '',
            status: 'open',
            priority: params.priority || 'medium',
            tags: params.tags || [],
            createdAt: now,
            updatedAt: now 
        });
    }
    

    toJSON(): object {
        return {
            id: this.id,
            title: this._title,
            description: this._description,
            status: this._status,
            priority: this._priority,
            tags: [...this._tags],
            createAt: this.createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString()
        };
    }


    static fromJSON(json: any): Ticket{
        return new Ticket({
            id: json.id,
            title: json.title,
            description: json.description,
            status: json.status,
            priority: json.priority,
            tags: json.tags || [],
            createdAt: new Date(json.createdAt),
            updatedAt: new Date(json.updatedAt)
        });
    }

}