import { Request, Response } from 'express';

import { asyncHandler } from '../../common/utils/async.util';
import { AuthRequest } from '../auth/auth.types';
import { UserProfileInput } from './profile.schema';
import { ProfileService } from './profile.service';

export class ProfileController {
    private profileService = new ProfileService();

    getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        const profile = await this.profileService.getProfile(userId);
        res.json(profile);
    });

    updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        const updateData: UserProfileInput = req.body;
        const updatedProfile = await this.profileService.updateProfile(userId, updateData);
        res.json(updatedProfile);
    });

    getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const profile = await this.profileService.getPublicProfile(userId);
        res.json(profile);
    });
}
