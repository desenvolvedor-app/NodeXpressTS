import { NextFunction, Request, Response } from 'express';

import { logger } from '../config/logger';
import { AppError } from '../utils/error.util';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(err);

    if (process.env.NODE_ENV === 'development') {
        res.status(err instanceof AppError ? err.statusCode : 500).json({
            status: 'error',
            message: err.message,
            ...(err instanceof AppError && { type: err.type }),
        });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
        return;
    }

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
    });
};
