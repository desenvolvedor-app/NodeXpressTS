import { Request } from 'express';

import { AppError } from './error.util';

export const extractTokenFromHeader = (req: Request): string => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Authorization token is missing or invalid', 401);
    }
    return authHeader.split(' ')[1];
};
