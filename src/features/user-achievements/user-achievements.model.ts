import mongoose, { Schema } from 'mongoose';

import { IUserAchievementDocument } from './user-achievements.types';

const userAchievementSchema = new Schema<IUserAchievementDocument>(
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
        hackathons: [
            {
                title: {
                    type: String,
                    required: true,
                    maxlength: [100, 'Hackathon title cannot exceed 100 characters'],
                },
                date: {
                    type: Date,
                    required: true,
                    validate: {
                        validator: function (v: Date): boolean {
                            return v <= new Date();
                        },
                        message: 'Hackathon date cannot be in the future',
                    },
                },
                position: {
                    type: String,
                    required: true,
                    enum: ['1st', '2nd', '3rd', 'Participant', 'Finalist'],
                },
            },
        ],
        badges: {
            type: [String],
            default: [],
            validate: {
                validator: (v: string[]): boolean => v.length <= 50,
                message: 'Cannot have more than 50 badges',
            },
        },
        points: {
            type: Number,
            default: 0,
            min: [0, 'Points cannot be negative'],
        },
        level: {
            type: Number,
            default: 1,
            min: [1, 'Level must be at least 1'],
        },
    },
    {
        timestamps: true,
    },
);

userAchievementSchema.index({ userId: 1 });
userAchievementSchema.index({ points: -1 });
userAchievementSchema.index({ level: -1 });

export const UserAchievement = mongoose.model<IUserAchievementDocument>('UserAchievement', userAchievementSchema);
