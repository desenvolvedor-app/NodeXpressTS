import { z } from 'zod';

import { ProfileVisibility, Theme } from './user-settings.types';

export const PrivacySettingsSchema = z.object({
    profileVisibility: z.enum([ProfileVisibility.PUBLIC, ProfileVisibility.PRIVATE]),
    showEmail: z.boolean(),
    showActivity: z.boolean(),
});

export const NotificationSettingsSchema = z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
});

export const UserSettingsSchema = z.object({
    theme: z.enum([Theme.LIGHT, Theme.DARK]),
    language: z.string(),
    privacy: PrivacySettingsSchema,
    notifications: NotificationSettingsSchema,
});

export type UserSettingsInput = z.infer<typeof UserSettingsSchema>;
