import mongoose, { Document } from 'mongoose';

export enum ActivityType {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    PASSWORD_CHANGE = 'PASSWORD_CHANGE',
    PROFILE_UPDATE = 'PROFILE_UPDATE',
    POST_CREATED = 'POST_CREATED',
    COMMENT_ADDED = 'COMMENT_ADDED',
    PROJECT_STARTED = 'PROJECT_STARTED',
    ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',
}

export interface IUserActivityDocument extends Document {
    userId: mongoose.Types.ObjectId;
    type: ActivityType;
    description: string;
    metadata?: Record<string, unknown>;
    timestamp: Date;
}
