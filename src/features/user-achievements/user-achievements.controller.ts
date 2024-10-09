import { Response } from 'express';

import { asyncHandler } from '../../common/utils/async.util';
import { AppError, NotFoundError } from '../../common/utils/error.util'; // Assuming you have a centralized error utility
import { AuthRequest } from '../auth/auth.types';
import { UserAchievementsInput } from './user-achievements.schema';
import { UserAchievementsService } from './user-achievements.service';

export class UserAchievementsController {
    constructor(private userAchievementsService: UserAchievementsService) {}

    getUserAchievements = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        if (!userId) {
            throw new NotFoundError('User not found');
        }

        const achievements = await this.userAchievementsService.getUserAchievements(userId);
        res.status(200).json(achievements);
    });

    updateUserAchievements = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        if (!userId) {
            throw new NotFoundError('User not found');
        }

        const updateData: UserAchievementsInput = req.body;
        if (!updateData) {
            throw new AppError('Update data is missing', 400);
        }

        const updatedAchievements = await this.userAchievementsService.updateUserAchievements(userId, updateData);
        res.status(200).json(updatedAchievements);
    });
}
