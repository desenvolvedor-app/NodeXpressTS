import mongoose, { Schema } from 'mongoose';

import { ActivityType, IUserActivityDocument } from './user-activities.types';

const userActivitySchema = new Schema<IUserActivityDocument>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            validate: {
                validator: async function (value) {
                    const user = await mongoose.model('User').findById(value).session(this.$session());
                    return !!user;
                },
                message: 'Referenced user must exist',
            },
        },
        type: {
            type: String,
            enum: Object.values(ActivityType),
            required: true,
        },
        description: {
            type: String,
            required: true,
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },
        metadata: {
            type: Map,
            of: Schema.Types.Mixed,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
        timeseries: {
            timeField: 'timestamp',
            metaField: 'userId',
            granularity: 'hours',
        },
    },
);

userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ type: 1, timestamp: -1 });

export const UserActivity = mongoose.model<IUserActivityDocument>('UserActivity', userActivitySchema);
