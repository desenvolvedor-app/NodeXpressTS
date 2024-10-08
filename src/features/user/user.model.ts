import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

import { UserRole } from './user.types';

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isEmailVerified: boolean;
    isLocked: boolean;
    failedLoginAttempts: number;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
        isEmailVerified: { type: Boolean, default: false },
        isLocked: { type: Boolean, default: false },
        failedLoginAttempts: { type: Number, default: 0 },
    },
    { timestamps: true },
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
