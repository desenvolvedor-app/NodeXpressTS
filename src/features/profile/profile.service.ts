import { UserProfile } from './profile.model';
import { ProfileVisibility, UserProfileDTO } from './profile.types';
import { AppError } from '../../common/utils/error.util';

export class ProfileService {
    async createProfile(userId: string) {
        const existingProfile = await UserProfile.findOne({ userId });
        if (existingProfile) {
            throw new AppError('Profile already exists', 400);
        }

        const profile = new UserProfile({
            userId,
            bio: '',
            skills: [],
            social_links: {},
            privacy: {
                profileVisibility: 'public',
                showEmail: false,
            },
        });

        await profile.save();
    }

    async getProfile(userId: string) {
        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            throw new AppError('Profile not found', 404);
        }
        return profile;
    }

    async updateProfile(userId: string, updateData: UserProfileDTO) {
        const profile = await UserProfile.findOne({ userId });

        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        updateData.privacy = {
            profileVisibility: updateData?.privacy?.profileVisibility || ProfileVisibility.PUBLIC,
            showEmail: updateData?.privacy?.showEmail ?? false,
        };

        Object.assign(profile, updateData);
        await profile.save();

        return profile;
    }

    async getPublicProfile(userId: string) {
        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        if (profile.privacy.profileVisibility === 'private') {
            throw new AppError('This profile is private', 403);
        }

        return profile;
    }
}
