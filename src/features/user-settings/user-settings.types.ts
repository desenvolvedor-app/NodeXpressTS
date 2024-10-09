import mongoose, { Document } from 'mongoose';

export enum ProfileVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}

export interface PrivacySettings {
    profileVisibility: ProfileVisibility;
    showEmail: boolean;
    showActivity: boolean;
}

export interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
}

export interface IUserSettingsDocument extends Document {
    userId: mongoose.Types.ObjectId;
    privacy: PrivacySettings;
    notificationSettings: NotificationSettings;
    theme: Theme;
    language: string;
}
