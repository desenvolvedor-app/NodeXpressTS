import mongoose from 'mongoose';

import { UserRole } from '../../features/user/user.types';

export function validateRoleOrSelf(
    user: {
        userId: mongoose.Types.ObjectId;
        email: string;
        role: UserRole;
    },
    userId: string,
    requiredRole: UserRole,
) {
    if (user.role !== requiredRole && user.userId.toString() !== userId) {
        throw new Error('Access denied');
    }
}
