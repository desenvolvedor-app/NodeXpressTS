import { z } from 'zod';
import { UserRole } from './user.types';

export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
});

export const updateUserRoleSchema = z.object({
    role: z.enum([UserRole.USER, UserRole.ADMIN, UserRole.MODERATOR]),
});
