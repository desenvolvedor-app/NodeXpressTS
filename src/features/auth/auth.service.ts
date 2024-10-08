import jwt from 'jsonwebtoken';

import { User } from '../user/user.model';
import { LoginDTO, RegisterDTO, TokenPayload } from './auth.types';
import { AppError } from '../../common/utils/error.util';

import { ProfileService } from '../profile/profile.service';

export class AuthService {
    private profileService = new ProfileService();

    private generateTokens(payload: TokenPayload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        });
        return { accessToken, refreshToken };
    }

    async register(userData: RegisterDTO) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const user = await User.create(userData);
        const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
        const tokens = this.generateTokens(payload);

        await this.profileService.createProfile(user.id);

        return {
            user: { id: user.id, name: user.name, email: user.email },
            ...tokens,
        };
    }

    async login(loginData: LoginDTO) {
        const user = await User.findOne({ email: loginData.email });
        if (!user || !(await user.comparePassword(loginData.password))) {
            throw new AppError('Invalid email or password', 401);
        }

        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const tokens = this.generateTokens(payload);

        return {
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            ...tokens,
        };
    }

    async refreshToken(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
            const user = await User.findById(decoded.userId);

            if (!user) {
                throw new AppError('User not found', 404);
            }

            const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
            return this.generateTokens(payload);
        } catch {
            throw new AppError('Invalid refresh token', 401);
        }
    }
}
