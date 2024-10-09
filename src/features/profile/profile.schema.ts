import { z } from 'zod';

export const UserProfileSchema = z.object({
    bio: z.string().max(500).optional(), // Bio field with a max length of 500
    skills: z.array(z.string()).max(20).optional(), // Array of skills with a max length of 20 items
    social_links: z
        .object({
            github: z
                .string()
                .url()
                .optional()
                .refine(
                    (url) => !url || url.startsWith('https://github.com/'), // GitHub URL validation
                    { message: 'Invalid GitHub URL' },
                ),
            linkedin: z
                .string()
                .url()
                .optional()
                .refine(
                    (url) => !url || url.startsWith('https://linkedin.com/in/'), // LinkedIn URL validation
                    { message: 'Invalid LinkedIn URL' },
                ),
            twitter: z.string().optional(), // Twitter handle
            website: z
                .string()
                .url()
                .optional()
                .refine(
                    (url) => !url || /^https?:\/\/.+/.test(url), // Website URL validation
                    { message: 'Invalid website URL' },
                ),
        })
        .optional(),
    location: z.string().optional(), // Location field
    jobTitle: z.string().optional(), // Job title field
    company: z.string().optional(), // Company field
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;
