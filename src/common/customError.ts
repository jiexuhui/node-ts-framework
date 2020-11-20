import { config } from '../config/config';

const errors = config.errors;

export class CustomEror {

    private code: string;
    private message: string;
    private details: string;

    constructor(message: string, details?: any) {
        this.code = errors[message] || 'unknown';
        this.message = message;
        this.details = details;
    }

    public toString() {
        return `code=${this.code}, message=${this.message}`;
    }

    public toJson() {
        return { code: this.code, message: this.message, details: this.details }
    }
}