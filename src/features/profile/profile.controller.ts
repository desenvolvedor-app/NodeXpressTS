import { Request, Response } from 'express';
import { ProfileService } from './profile.service';
import { asyncHandler } from '../../common/utils/async.util';
import { UserProfileInput } from './profile.schema';
import { AuthRequest } from '../../common/middleware/auth.middleware';

export class ProfileController {
    private profileService = new ProfileService();

    // Get the current user's profile
    getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        const profile = await this.profileService.getProfile(userId);
        res.json(profile);
    });

    // Update the current user's profile
    updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.userId;
        const updateData: UserProfileInput = req.body;
        const updatedProfile = await this.profileService.updateProfile(userId, updateData);
        res.json(updatedProfile);
    });

    // Get another user's public profile
    getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const profile = await this.profileService.getPublicProfile(userId);
        res.json(profile);
    });
}
