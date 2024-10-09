import { Response } from 'express';

import { asyncHandler } from '../../common/utils/async.util';
import { NotFoundError } from '../../common/utils/error.util';
import { AuthRequest } from '../auth/auth.types';
import { UserSettingsSchema } from './user-settings.schema';
import { UserSettingsService } from './user-settings.service';

export class UserSettingsController {
    constructor(private userSettingsService: UserSettingsService) {}

    getUserSettings = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        if (!userId) {
            throw new NotFoundError('User not found');
        }

        const settings = await this.userSettingsService.getUserSettings(userId);
        res.status(200).json(settings);
    });

    updateUserSettings = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        if (!userId) {
            throw new NotFoundError('User not found');
        }

        const parsedData = UserSettingsSchema.safeParse(req.body);
        if (!parsedData.success) {
            throw new NotFoundError('Invalid input');
        }

        const updatedSettings = await this.userSettingsService.updateUserSettings(userId, parsedData.data);
        res.status(200).json(updatedSettings);
    });
}
