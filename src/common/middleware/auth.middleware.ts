import { NextFunction, Response } from 'express';

import { AuthRequest } from '../../features/auth/auth.types';
import { UserService } from '../../features/user/user.service';
import { UserRole } from '../../features/user/user.types';
import TokenService from '../services/token.service';
import { asyncHandler } from '../utils/async.util';
import { AppError } from '../utils/error.util';
import { extractTokenFromHeader } from '../utils/extract-token.util';

export const authMiddleware = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const userService = new UserService();
        const tokenService = new TokenService();

        const token = extractTokenFromHeader(req);

        const isTokenRevoked = await tokenService.isTokenRevoked(token);
        if (isTokenRevoked) {
            throw new AppError('Token is invalid or expired', 401);
        }

        try {
            const decoded = await tokenService.verifyJwtToken(token);

            const user = await userService.getUserById(decoded.userId);
            if (!user) {
                throw new AppError('User not found', 404);
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
    },
);

export const authorizeRoles = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError('Not authorized to access this route', 403);
        }
        next();
    };
};
