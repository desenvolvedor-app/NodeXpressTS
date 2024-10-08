import { UserRole } from '../../features/user/user.types';

export function validateRoleOrSelf(
    user: {
        userId: string;
        email: string;
        role: UserRole;
    },
    userId: string,
    requiredRole: UserRole,
) {
    if (user.role !== requiredRole && user.userId !== userId) {
        throw new Error('Access denied');
    }
}
