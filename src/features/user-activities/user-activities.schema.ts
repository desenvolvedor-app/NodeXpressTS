import { z } from 'zod';

import { ActivityType } from './user-activities.types';

// Convert ActivityType enum to a tuple of strings
const activityTypes = Object.values(ActivityType) as [string, ...string[]];

// Zod schema for user activities input
export const UserActivitiesSchema = z.object({
    type: z.enum(activityTypes),
    description: z.string().max(200, 'Description cannot exceed 200 characters'),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UserActivitiesInput = z.infer<typeof UserActivitiesSchema>;
