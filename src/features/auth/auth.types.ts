import { Request } from 'express';
import mongoose from 'mongoose';

import { UserRole } from '../user/user.types';

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO extends LoginDTO {
    name: string;
}

export interface AuthRequest extends Request {
    user?: {
        userId: mongoose.Types.ObjectId;
        email: string;
        role: UserRole;
    };
}

export interface TokenPayload {
    userId: mongoose.Types.ObjectId;
    email: string;
    role: UserRole;
}

export interface TokenResponse {
    user?: {
        id: mongoose.Types.ObjectId;
        name: string;
        email: string;
        role: UserRole;
    };
    accessToken: string;
    refreshToken: string;
}

export interface DecodedTokenPayload extends TokenPayload {
    exp: number;
    iat: number;
}
