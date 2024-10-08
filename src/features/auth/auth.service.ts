import { EmailService } from '../../common/services/email.service';
import TokenService from '../../common/services/token.service';
import { AppError } from '../../common/utils/error.util';
import { ProfileService } from '../profile/profile.service';
import { IUser, User } from '../user/user.model';
import { LoginDTO, RegisterDTO, TokenPayload, TokenResponse } from './auth.types';

export class AuthService {
    private profileService = new ProfileService();
    private emailService = new EmailService();
    private tokenService = new TokenService();

    private MAX_FAILED_LOGIN_ATTEMPTS = 5;

    async register(userData: RegisterDTO): Promise<{ user: object; accessToken: string; refreshToken: string }> {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const user = await User.create(userData);
        const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
        const tokens = await this.tokenService.generateTokens(payload);

        await this.profileService.createProfile(user.id);
        await this.sendVerificationEmail(user.email);

        return {
            user: { id: user.id, name: user.name, email: user.email },
            ...tokens,
        };
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

        const tokens = await this.tokenService.generateTokens({
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

    async refreshToken(refreshToken: string): Promise<TokenResponse> {
        const decoded = await this.tokenService.verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded.userId);
        if (!user) throw new AppError('User not found', 404);

        await this.tokenService.revokeAllTokensForUser(decoded.userId); // Revoke all tokens for the user

        const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
        return await this.tokenService.generateTokens(payload);
    }

    async verifyEmail(token: string): Promise<void> {
        let decoded;
        try {
            decoded = await this.tokenService.verifyEmailToken(token);
        } catch {
            throw new AppError('Invalid or expired verification token', 400);
        }

        const user = await User.findById(decoded.userId);
        if (!user) throw new AppError('User not found', 404);

        user.isEmailVerified = true;
        await user.save();
    }

    async sendVerificationEmail(email: string): Promise<void> {
        const user = await User.findOne({ email });
        if (!user) throw new AppError('User not found', 404);

        const verificationToken = await this.tokenService.signEmailToken({ userId: user.id });

        await this.emailService.sendVerificationEmail(user.email, verificationToken);
    }

    async sendPasswordResetToken(email: string): Promise<void> {
        const user = await User.findOne({ email });
        if (!user) throw new AppError('User not found', 404);

        const resetToken = await this.tokenService.signResetToken({ userId: user.id });

        console.log(resetToken);

        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        let decoded;

        try {
            decoded = await this.tokenService.verifyResetToken(token);
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
        if (!token) throw new AppError('Token not provided', 400);

        const decoded = await this.tokenService.verifyJwtToken(token);

        const isRevoked = await this.tokenService.isTokenRevoked(token);
        if (isRevoked) {
            throw new AppError('Token has been revoked or does not exist', 401);
        }

        await this.tokenService.revokeAllTokensForUser(decoded.userId);
    }

    private async handleFailedLogin(user: IUser): Promise<void> {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= this.MAX_FAILED_LOGIN_ATTEMPTS) {
            user.isLocked = true;

            await this.emailService.sendLockedAccountEmail(user.email);
        }

        await user.save();
    }
}
