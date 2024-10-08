import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/async.util';
import { AppError } from '../utils/error.util';
import { UserRole } from '../../features/user/user.types';

import { IUser, User } from '../../features/user/user.model';
import { TokenBlacklist } from '../../features/auth/tokenBlacklist.model';

interface DecodedToken {
    userId: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: UserRole;
    };
}

export const authMiddleware = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
        throw new AppError('Token is invalid or expired', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

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
