import { Request, Response } from 'express';

import { asyncHandler } from '../../common/utils/async.util';
import { AuthRequest } from '../auth/auth.types';
import { UserProfileInput } from './user-profile.schema';
import { UserProfileService } from './user-profile.service';

export class UserProfileController {
    private userProfileService = new UserProfileService();

    getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        const profile = await this.userProfileService.getProfile(userId);
        res.json(profile);
    });

    updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        const updateData: UserProfileInput = req.body;
        const updatedProfile = await this.userProfileService.updateProfile(userId, updateData);
        res.json(updatedProfile);
    });

    getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const profile = await this.userProfileService.getPublicProfile(userId);
        res.json(profile);
    });
}
