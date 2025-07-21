export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(
        errorDefinition: { code: string; message: string; statusCode: number },
        description: string = '',
        isOperational: boolean = true
    ) {
        super(description || errorDefinition.message);
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain

        this.code = errorDefinition.code;
        this.statusCode = errorDefinition.statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}