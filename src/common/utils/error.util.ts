export enum ErrorType {
    VALIDATION = 'VALIDATION',
    AUTHENTICATION = 'AUTHENTICATION',
    AUTHORIZATION = 'AUTHORIZATION',
    NOT_FOUND = 'NOT_FOUND',
    INTERNAL = 'INTERNAL',
}

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public type: ErrorType = ErrorType.INTERNAL,
        public isOperational: boolean = true,
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}
