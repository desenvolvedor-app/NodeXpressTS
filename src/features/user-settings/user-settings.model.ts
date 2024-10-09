import mongoose, { Schema } from 'mongoose';

import { IUserSettingsDocument, ProfileVisibility, Theme } from './user-settings.types';

const userSettingsSchema = new Schema<IUserSettingsDocument>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            validate: {
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value).session(this.$session());
                    return !!user;
                },
                message: 'Referenced user must exist',
            },
        },
        privacy: {
            profileVisibility: {
                type: String,
                enum: Object.values(ProfileVisibility),
                default: ProfileVisibility.PUBLIC,
            },
            showEmail: { type: Boolean, default: false },
            showActivity: { type: Boolean, default: true },
        },
        notificationSettings: {
            emailNotifications: { type: Boolean, default: true },
            pushNotifications: { type: Boolean, default: false },
        },
        theme: {
            type: String,
            enum: Object.values(Theme),
            default: Theme.LIGHT,
        },
        language: {
            type: String,
            default: 'en',
            enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh'],
        },
    },
    {
        timestamps: true,
        minimize: false,
    },
);

userSettingsSchema.index({ userId: 1 });

export const UserSettings = mongoose.model<IUserSettingsDocument>('UserSettings', userSettingsSchema);
