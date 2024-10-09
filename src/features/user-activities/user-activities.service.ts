import mongoose from 'mongoose';

import { AppError } from '../../common/utils/error.util'; // Assuming you have centralized error handling
import { UserActivity } from './user-activities.model';
import { IUserActivityDocument } from './user-activities.types';

export class UserActivitiesService {
    async getUserActivities(userId: string | mongoose.Types.ObjectId): Promise<IUserActivityDocument[]> {
        const activities = await UserActivity.find({ userId }).sort({ timestamp: -1 });
        if (!activities) {
            throw new AppError('No activities found for this user', 404);
        }
        return activities;
    }

    async createUserActivity(
        userId: string | mongoose.Types.ObjectId,
        activityData: IUserActivityDocument,
    ): Promise<IUserActivityDocument> {
        const newActivity = new UserActivity(activityData);
        await newActivity.save();
        return newActivity;
    }
}
