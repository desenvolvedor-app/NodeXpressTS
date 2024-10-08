import { Schema, model } from 'mongoose';
import { UserProfileDocument } from './profile.types';

const UserProfileSchema = new Schema<UserProfileDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Correct reference
        bio: { type: String, default: '' },
        skills: { type: [String], default: [] },
        social_links: {
            github: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            website: { type: String, default: '' },
        },
        privacy: {
            profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
            showEmail: { type: Boolean, default: false },
        },
    },
    {
        timestamps: true,
    },
);

export const UserProfile = model<UserProfileDocument>('UserProfile', UserProfileSchema);
