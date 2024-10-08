import path from 'path';

import winston from 'winston';

const logsDirectory = path.join(__dirname, '../', '../', '../', 'logs');

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: path.join(logsDirectory, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logsDirectory, 'combined.log') }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}
