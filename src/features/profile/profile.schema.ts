import { z } from 'zod';
import { ProfileVisibility } from './profile.types';

export const UserProfileSchema = z.object({
    bio: z.string().max(500).optional(),
    skills: z.array(z.string()).optional(),
    social_links: z
        .object({
            github: z.string().url().optional(),
            linkedin: z.string().url().optional(),
            website: z.string().url().optional(),
        })
        .optional(),
    privacy: z
        .object({
            profileVisibility: z.nativeEnum(ProfileVisibility).default(ProfileVisibility.PUBLIC), // Default to 'public'
            showEmail: z.boolean().default(false), // Default to false
        })
        .optional(),
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;
