import mongoose, { Document } from 'mongoose';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    name: string;
    email: string;
}

// DTO representing the user object
export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

// DTO for updating user role
export interface UserRoleUpdateDTO {
    role: UserRole;
}

export interface IUserDocument extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: UserRole;
    isEmailVerified: boolean;
    isLocked: boolean;
    isActive: boolean;
    failedLoginAttempts: number;
    lastLogin?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
