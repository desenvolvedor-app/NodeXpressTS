import mongoose from 'mongoose';

import { AppError } from '../../common/utils/error.util';
import { UserSettings } from './user-settings.model';
import { IUserSettingsDocument, ProfileVisibility, Theme } from './user-settings.types';

export class UserSettingsService {
    async getUserSettings(userId: string | mongoose.Types.ObjectId): Promise<IUserSettingsDocument | null> {
        const settings = await UserSettings.findOne({ userId }).exec();
        if (!settings) {
            throw new AppError('User settings not found', 404);
        }
        return settings;
    }

    async updateUserSettings(
        userId: string | mongoose.Types.ObjectId,
        updateData: Partial<IUserSettingsDocument>,
    ): Promise<IUserSettingsDocument> {
        const settings = await UserSettings.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true, runValidators: true },
        ).exec();

        if (!settings) {
            throw new AppError('User settings not found', 404);
        }

        return settings;
    }

    async createDefaultSettings(userId: string, session: mongoose.ClientSession): Promise<void> {
        const existingSettings = await UserSettings.findOne({ userId }).session(session);
        if (existingSettings) {
            throw new AppError('Settings already exists', 409);
        }

        const defaultSettings: IUserSettingsDocument = new UserSettings({
            userId: new mongoose.Types.ObjectId(userId),
            theme: Theme.LIGHT,
            language: 'en',
            privacy: {
                profileVisibility: ProfileVisibility.PUBLIC,
                showEmail: false,
                showActivity: true,
            },
            notifications: {
                emailNotifications: true,
                pushNotifications: false,
            },
        });

        await defaultSettings.save({ session });
    }
}
