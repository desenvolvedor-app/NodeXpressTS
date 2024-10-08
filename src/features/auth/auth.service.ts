import { IUser, User } from '../user/user.model';

import { ProfileService } from '../profile/profile.service';

import { LoginDTO, RegisterDTO, TokenPayload, TokenResponse } from './auth.types';
import { TokenBlacklist } from './tokenBlacklist.model';

import { AppError } from '../../common/utils/error.util';
import { EmailService } from '../../common/services/email.service';

import {
    generateTokens,
    signEmailToken,
    signResetToken,
    verifyEmailToken,
    verifyJwtToken,
    verifyRefreshToken,
    verifyResetToken,
} from '../../common/utils/tokens.utils';

export class AuthService {
    private profileService = new ProfileService();
    private emailService = new EmailService();
    private MAX_FAILED_LOGIN_ATTEMPTS = 5;

    async register(userData: RegisterDTO) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const user = await User.create(userData);
        const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
        const tokens = generateTokens(payload);

        await this.profileService.createProfile(user.id);
        await this.sendVerificationEmail(user.email);

        return {
            user: { id: user.id, name: user.name, email: user.email },
            ...tokens,
        };
    }

    async sendVerificationEmail(email: string) {
        const user = await User.findOne({ email });
        if (!user) throw new AppError('User not found', 404);

        const verificationToken = signEmailToken({ userId: user.id });

        await this.emailService.sendVerificationEmail(user.email, verificationToken);
    }

    async login(loginData: LoginDTO): Promise<TokenResponse> {
        const user = await User.findOne({ email: loginData.email }).exec();

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        if (user.isLocked) {
            throw new AppError(
                'Account locked due to multiple failed login attempts. Please reset your password.',
                403,
            );
        }

        const isPasswordCorrect = await user.comparePassword(loginData.password);
        if (!isPasswordCorrect) {
            await this.handleFailedLogin(user);
            throw new AppError('Invalid email or password', 401);
        }

        const tokens = generateTokens({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    private async handleFailedLogin(user: IUser): Promise<void> {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= this.MAX_FAILED_LOGIN_ATTEMPTS) {
            user.isLocked = true;
        }

        await user.save();
    }

    async refreshToken(refreshToken: string) {
        const decoded = verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded.userId);
        if (!user) throw new AppError('User not found', 404);

        await TokenBlacklist.create({
            token: refreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
        return await generateTokens(payload);
    }

    async verifyEmail(token: string) {
        let decoded;
        try {
            decoded = verifyEmailToken(token);
        } catch {
            throw new AppError('Invalid or expired verification token', 400);
        }

        const user = await User.findById(decoded.userId);
        if (!user) throw new AppError('User not found', 404);

        user.isEmailVerified = true;
        await user.save();
    }

    async sendPasswordResetToken(email: string) {
        const user = await User.findOne({ email });
        if (!user) throw new AppError('User not found', 404);

        const resetToken = signResetToken({ userId: user.id });

        console.log(resetToken);

        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    async resetPassword(token: string, newPassword: string) {
        let decoded;

        try {
            decoded = verifyResetToken(token);
        } catch {
            throw new AppError('Invalid or expired reset token', 400);
        }

        const user = await User.findById(decoded.userId);
        if (!user) throw new AppError('User not found', 404);

        user.password = newPassword;

        user.failedLoginAttempts = 0;
        user.isLocked = false;

        await user.save();
    }

    async revokeToken(token: string) {
        if (!token) throw new AppError('User not found', 404);

        const decoded = verifyJwtToken(token);

        await TokenBlacklist.create({
            token: token,
            userId: decoded.userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
    }
}
