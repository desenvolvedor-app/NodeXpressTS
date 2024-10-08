import mongoose, { Schema, Document } from 'mongoose';

export interface ITokenBlacklist extends Document {
    token: string;
    expiresAt: Date;
    userId: string;
}

const TokenBlacklistSchema: Schema = new Schema({
    token: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    userId: { type: String, required: true },
});

TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = mongoose.model<ITokenBlacklist>('TokenBlacklist', TokenBlacklistSchema);
