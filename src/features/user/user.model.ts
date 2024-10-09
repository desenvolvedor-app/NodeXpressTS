import bcrypt from 'bcryptjs';
import mongoose, { Model, Schema } from 'mongoose';

import { isValidEmail } from '../../common/utils/validation.util';
import { IUserDocument, UserRole } from './user.types';

export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModel extends Model<IUserDocument, object, IUserMethods> {
    findByEmail(email: string): Promise<IUserDocument | null>;
}

const userSchema = new Schema<IUserDocument, UserModel, IUserMethods>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: isValidEmail,
                message: 'Invalid email format',
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false,
        },
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        isEmailVerified: { type: Boolean, default: false },
        isLocked: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        failedLoginAttempts: {
            type: Number,
            default: 0,
            max: [5, 'Too many failed login attempts. Account will be locked.'],
        },
        lastLogin: { type: Date },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.virtual('profile', {
    ref: 'UserProfile',
    localField: '_id',
    foreignField: 'userId',
    justOne: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error instanceof Error ? error : new Error('Password hashing failed'));
    }
});

userSchema.methods.comparePassword = async function (this: IUserDocument, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email });
};

export const User = mongoose.model<IUserDocument, UserModel>('User', userSchema);
