import type {TicketPriority, TicketStatus} from '../types.js';

export class TicketValidator {
    //Validate tittle
    static validateTitle(title: string): void {
        if(!title) {
            throw new Error('VALIDATION_ERROR: Title is required');
        }

        const trimmed = title.trim();


        if(trimmed.length === 0){
            throw new Error('VALIDATION_ERROR: Title cannot be empty');
        }

        if(trimmed.length < 3){
            throw new Error('VALIDATION_ERROR: Title must be at least 3 characters long');
        }

        if(trimmed.length > 100){
            throw new Error('VALIDATION_ERROR: Title cannot exceed 100 characters');
        }
    }

    //Validate status
    static validateStatus(status: TicketStatus): void {
        const validStatus: TicketStatus[] = ['open', 'in_progress', 'review', 'closed'];
        
        if(!validStatus.includes(status)){
            throw new Error(`VALIDATION_ERROR: Invalid status. Must be one of: ${validStatus.join(', ')}`);
        };
    }

    //Validate priority
    static validatePriority(priority: TicketPriority): void {
        const validPriority: TicketPriority[] = ['low', 'medium', 'high', 'critical'];

        if(!validPriority.includes(priority)){
            throw new Error(`VALIDATION_ERROR: Invalid priority value. Must be one of: ${validPriority.join(', ')}`);
        };
    }
    
    //validate tags
    static validateTags(tags: string[]): void {
        // Ensure tags is an array
        if(!Array.isArray(tags)){
            throw new Error('VALIDATION_ERROR: Tag must be an array of strings');
        }

        // Ensure each tag is a non-empty string
        for (const tag of tags){
            if(typeof tag !== 'string' || tag.trim().length === 0){ 
                throw new Error('VALIDATION_ERROR: Each tag must be a non-empty string');
        }
            if(tag.length > 30) {
                throw new Error('VALIDATION_ERROR: Tag cannot exceed 30 characters');
            }

        
     }
    }


    // //validate description
    // static validateDescription(description: string): void {
    //     if(!description){
    //         throw new Error('VALIDATION_ERROR: Description is required');
    //     }
    // }

    //validate status transition ( Bussiness rule)
    static validateStatusTransition(currentStatus: TicketStatus, newStatus: TicketStatus): void{
        //cannot open ticket when it is closed 
        if(currentStatus === 'closed' && newStatus !== 'closed'){
            throw new Error('BUSINESS_RULE_ERROR: Cannot reopen a closed ticket');
        }
        //The in-progress step cannot be skipped 
        if(currentStatus === 'open' && newStatus === 'review'){
            throw new Error('BUSINESS_RULE_ERROR: Must go through in_progress before review');
        }
        //Cannot move review ticket back to open
        if(currentStatus === 'review' && newStatus ==='open'){
            throw new Error('BUSINESS_RULE_ERROR: Cannot go from review ticket back to open');
        }

    }

}