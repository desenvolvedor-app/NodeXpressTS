import mongoose, { Document } from 'mongoose';

export interface IToken extends Document {
    token: string;
    userId?: string;
    tokenType: 'access' | 'refresh';
    expiryDate: Date;
    isRevoked: boolean;
}

const TokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenType: { type: String, enum: ['access', 'refresh'], required: true },
    expiryDate: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
});

TokenSchema.index({ expiryDate: 1, isRevoked: 1 }, { expireAfterSeconds: 0 });

export const TokenModel = mongoose.model('Token', TokenSchema);
