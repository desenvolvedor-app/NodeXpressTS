import mongoose from 'mongoose';

import { AppError } from '../../common/utils/error.util';
import { UserProfile } from './profile.model';
import { UserProfileDTO } from './profile.types';

export class ProfileService {
    async createProfile(userId: string) {
        const existingProfile = await UserProfile.findOne({ userId });
        if (existingProfile) {
            throw new AppError('Profile already exists', 400);
        }

        const profile = new UserProfile({
            userId,
            bio: '',
            skills: [''],
            social_links: {
                github: '',
                linkedin: '',
                twitter: '',
                website: '',
            },
            location: '',
            jobTitle: '',
            company: '',
        });

        await profile.save();
    }

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
}
