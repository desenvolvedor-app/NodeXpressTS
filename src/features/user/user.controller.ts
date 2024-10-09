import { Response } from 'express';

import { asyncHandler } from '../../common/utils/async.util';
import { ForbiddenError, NotFoundError } from '../../common/utils/error.util';
import { validateRoleOrSelf } from '../../common/utils/role.util';
import { AuthRequest } from '../auth/auth.types';
import { UserService } from './user.service';
import { UserRole } from './user.types';

export class UserController {
    constructor(private userService: UserService) {}

    private ensureAdminOrSelf(req: AuthRequest, userId: string): void {
        this.ensureAuthenticated(req);
        if (req.user) {
            validateRoleOrSelf(req.user, userId, UserRole.ADMIN);
        } else {
            throw new ForbiddenError('User information is missing');
        }
    }

    private ensureAuthenticated(req: AuthRequest): void {
        if (!req.user) {
            throw new ForbiddenError('You do not have permission to perform this action');
        }
    }

    private ensureAdmin(req: AuthRequest): void {
        this.ensureAuthenticated(req);
        if (req.user?.role !== UserRole.ADMIN) {
            throw new ForbiddenError('Access denied: Admins only');
        }
    }

    getAllUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        this.ensureAdmin(req);

        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    });

    getUserById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdminOrSelf(req, id);

        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json(user);
    });

    updateUserDetails = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdminOrSelf(req, id);

        const updatedUser = await this.userService.updateUserDetails(id, req.body);
        res.status(200).json(updatedUser);
    });

    deactivateUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdminOrSelf(req, id);

        await this.userService.deactivateUser(id);
        res.status(200).json({ message: 'User account deactivated successfully' });
    });

    activateUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdminOrSelf(req, id);

        await this.userService.activateUser(id);
        res.status(200).json({ message: 'User account reactivated successfully' });
    });

    deleteUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdmin(req);

        await this.userService.deleteUser(id);
        res.status(200).json({ message: 'User account deleted successfully' });
    });

    updateUserRole = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const { role }: { role: UserRole } = req.body;

        this.ensureAdmin(req);

        const updatedUser = await this.userService.updateUserRole(id, role);
        res.status(200).json(updatedUser);
    });
}
