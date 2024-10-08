import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { AppError } from '../utils/error.util';

export const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.body);
        next();
    } catch {
        next(new AppError('Validation error', 400));
    }
};
