import winston from 'winston';
import path from 'path';

// Define the logs folder path at the root
const logsDirectory = path.join(__dirname, '../', '../', '../', 'logs');

// Create a Winston logger instance
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: path.join(logsDirectory, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logsDirectory, 'combined.log') }),
    ],
});

// Add console logging for non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}
