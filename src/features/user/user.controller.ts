import { Request, Response } from 'express';

import { AuthRequest } from '../../common/middleware/auth.middleware';
import { asyncHandler } from '../../common/utils/async.util';
import { ForbiddenError, NotFoundError } from '../../common/utils/error.util';
import { validateRoleOrSelf } from '../../common/utils/role.util';
import { UserService } from './user.service';
import { UserRole } from './user.types';

export class UserController {
    constructor(private userService: UserService) {}

    private ensureAdminOrSelf(req: AuthRequest, userId: string): void {
        // Ensure the user is authenticated before proceeding
        this.ensureAuthenticated(req);

        // Since we already checked that req.user exists, we can safely assert the type here
        if (req.user) {
            validateRoleOrSelf(req.user, userId, UserRole.ADMIN);
        } else {
            throw new ForbiddenError('User information is missing');
        }
    }

    // Helper to ensure user is authenticated
    private ensureAuthenticated(req: AuthRequest): void {
        if (!req.user) {
            throw new ForbiddenError('You do not have permission to perform this action');
        }
    }

    // Helper to ensure user is admin
    private ensureAdmin(req: AuthRequest): void {
        this.ensureAuthenticated(req);
        if (req.user?.role !== UserRole.ADMIN) {
            throw new ForbiddenError('Access denied: Admins only');
        }
    }

    // GET /users - Fetch list of all users (Admin only)
    getAllUsers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        this.ensureAdmin(req);

        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    });

    // GET /users/:id - Get detailed info about a specific user (Admin, Self)
    getUserById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdminOrSelf(req, id);

        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json(user);
    });

    // POST /users - Create a new user (Public registration)
    createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userData = req.body; // User input data validation happens through middleware (e.g., Joi)

        const newUser = await this.userService.createUser(userData);
        res.status(201).json(newUser);
    });

    // PUT /users/:id - Update specific user details (Admin, Self)
    updateUserDetails = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdminOrSelf(req, id);

        const updatedUser = await this.userService.updateUserDetails(id, req.body);
        res.status(200).json(updatedUser);
    });

    // PUT /users/:id/deactivate - Deactivate a user account (Admin, Self)
    deactivateUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdminOrSelf(req, id);

        await this.userService.deactivateUser(id);
        res.status(200).json({ message: 'User account deactivated successfully' });
    });

    // PUT /users/:id/activate - Reactivate a user account (Admin, Self)
    activateUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdminOrSelf(req, id);

        await this.userService.activateUser(id);
        res.status(200).json({ message: 'User account reactivated successfully' });
    });

    // DELETE /users/:id - Permanently delete a user account (Admin only)
    deleteUser = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        this.ensureAdmin(req);

        await this.userService.deleteUser(id);
        res.status(200).json({ message: 'User account deleted successfully' });
    });

    // PUT /users/:id/role - Assign or update user roles (Admin only)
    updateUserRole = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const { id } = req.params;
        const { role }: { role: UserRole } = req.body;

        this.ensureAdmin(req);

        const updatedUser = await this.userService.updateUserRole(id, role);
        res.status(200).json(updatedUser);
    });
}
