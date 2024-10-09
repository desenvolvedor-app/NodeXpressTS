import mongoose from 'mongoose';

import { AppError } from '../../common/utils/error.util'; // Assuming you have centralized error utility
import { UserAchievement } from './user-achievements.model';
import { UserAchievementsInput } from './user-achievements.schema';
import { IUserAchievementDocument } from './user-achievements.types';

export class UserAchievementsService {
    async getUserAchievements(userId: string | mongoose.Types.ObjectId): Promise<IUserAchievementDocument> {
        const achievements = await UserAchievement.findOne({ userId });
        if (!achievements) {
            throw new AppError('User achievements not found', 404);
        }
        return achievements;
    }

    async updateUserAchievements(
        userId: string | mongoose.Types.ObjectId,
        updateData: UserAchievementsInput,
    ): Promise<IUserAchievementDocument> {
        const achievements = await UserAchievement.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true, runValidators: true },
        ).exec();

        if (!achievements) {
            throw new AppError('User achievements not found', 404);
        }
        return achievements;
    }

    async createDefaultAchievements(userId: string, session: mongoose.ClientSession): Promise<void> {
        const existingAchievement = await UserAchievement.findOne({ userId }).session(session);
        if (existingAchievement) {
            throw new AppError('Achievement already exists', 409);
        }

        const defaultAchievements = new UserAchievement({
            userId,
            hackathons: [],
            badges: [],
            points: 0,
            level: 1,
        });

        await defaultAchievements.save({ session });
    }
}
