import { Request, Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '../../common/utils/async.util';
import { AuthRequest } from '../../common/middleware/auth.middleware';

export class UserController {
    constructor(private userService: UserService) {}

    getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        const user = await this.userService.getUserProfile(userId);
        res.json(user);
    });

    updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        const updatedUser = await this.userService.updateUser(userId, req.body);
        res.json(updatedUser);
    });

    deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        await this.userService.deleteUser(userId);
        res.status(204).send();
    });

    getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
        const users = await this.userService.getAllUsers();
        res.json(users);
    });

    updateUserRole = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { role } = req.body;
        const updatedUser = await this.userService.updateUserRole(userId, role);
        res.json(updatedUser);
    });
}
