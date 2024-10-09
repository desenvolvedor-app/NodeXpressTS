import mongoose from 'mongoose';

import { AppError } from '../../common/utils/error.util';
import { UserProfile } from './user-profile.model';
import { UserProfileDTO } from './user-profile.types';

export class UserProfileService {
    async getProfile(userId: string | mongoose.Types.ObjectId) {
        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            throw new AppError('Profile not found', 404);
        }
        return profile;
    }

    async updateProfile(userId: string | mongoose.Types.ObjectId, updateData: UserProfileDTO) {
        const profile = await UserProfile.findOne({ userId });

        console.log(updateData, profile);

        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        Object.assign(profile, updateData);
        await profile.save();

        return profile;
    }

    async getPublicProfile(userId: string) {
        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        return profile;
    }

    async createDefaultProfile(userId: string, session: mongoose.ClientSession): Promise<void> {
        const existingProfile = await UserProfile.findOne({ userId }).session(session);
        if (existingProfile) {
            throw new AppError('Profile already exists', 409);
        }

        console.log(userId, 'userId');

        const defaultProfile = new UserProfile({
            userId,
            bio: '',
            skills: [],
            social_links: {},
            location: '',
            jobTitle: '',
            company: '',
        });

        await defaultProfile.save({ session });
    }
}
