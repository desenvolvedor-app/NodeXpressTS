import mongoose, { Schema } from 'mongoose';

import { IUserProfile } from './user-profile.types';

const userProfileSchema = new Schema<IUserProfile>(
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
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },
        skills: {
            type: [String],
            default: [],
            validate: {
                validator: function (v: string[]) {
                    return v.length <= 20;
                },
                message: 'Cannot have more than 20 skills',
            },
        },
        social_links: {
            github: {
                type: String,
                validate: {
                    validator: (v: string) => !v || v.startsWith('https://github.com/'),
                    message: 'Invalid GitHub URL',
                },
            },
            linkedin: {
                type: String,
                validate: {
                    validator: (v: string) => !v || v.startsWith('https://linkedin.com/in/'),
                    message: 'Invalid LinkedIn URL',
                },
            },
            twitter: String,
            website: {
                type: String,
                validate: {
                    validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
                    message: 'Invalid website URL',
                },
            },
        },
        location: String,
        jobTitle: String,
        company: String,
    },
    { timestamps: true },
);

userProfileSchema.index({ userId: 1 });
userProfileSchema.index({ skills: 1 });

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', userProfileSchema);
