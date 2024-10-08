import { NextFunction, Request, Response } from 'express';

import { IUser, User } from '../../features/user/user.model';
import { UserRole } from '../../features/user/user.types';
import TokenService from '../services/token.service';
import { asyncHandler } from '../utils/async.util';
import { AppError } from '../utils/error.util';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: UserRole;
    };
}

export const authMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const tokenService = new TokenService();

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const isTokenRevoked = await tokenService.isTokenRevoked(token);
    if (isTokenRevoked) {
        throw new AppError('Token is invalid or expired', 401);
    }

    try {
        const decoded = await tokenService.verifyJwtToken(token);

        const user = (await User.findById(decoded.userId)) as IUser;
        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = {
            userId: user._id,
            email: user.email,
            role: user.role,
        };
        next();
    } catch {
        throw new AppError('Invalid token', 401);
    }
});

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError('Not authorized to access this route', 403);
        }
        next();
    };
};
