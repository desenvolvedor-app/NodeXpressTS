import { z } from 'zod';

// Define Zod schema for updating user achievements
export const UserAchievementsSchema = z.object({
    hackathons: z
        .array(
            z.object({
                title: z.string().max(100, 'Hackathon title cannot exceed 100 characters'),
                date: z.date().refine((v) => v <= new Date(), {
                    message: 'Hackathon date cannot be in the future',
                }),
                position: z.enum(['1st', '2nd', '3rd', 'Participant', 'Finalist']),
            }),
        )
        .optional(),
    badges: z.array(z.string()).max(50, 'Cannot have more than 50 badges').optional(),
    points: z.number().min(0, 'Points cannot be negative').optional(),
    level: z.number().min(1, 'Level must be at least 1').optional(),
});

export type UserAchievementsInput = z.infer<typeof UserAchievementsSchema>;
