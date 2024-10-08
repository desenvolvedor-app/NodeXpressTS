import { EmailService } from '../../common/services/email.service';
import TokenService from '../../common/services/token.service';
import { AppError } from '../../common/utils/error.util';
import { ProfileService } from '../profile/profile.service';
import { UserService } from '../user/user.service';
import { LoginDTO, RegisterDTO, TokenPayload, TokenResponse } from './auth.types';
import { LoginAttemptService } from './login-attempt.service';

export class AuthService {
    private userService = new UserService();
    private profileService = new ProfileService();
    private emailService = new EmailService();
    private tokenService = new TokenService();
    private loginAttemptService = new LoginAttemptService();

    async register(userData: RegisterDTO): Promise<{ user: object; accessToken: string; refreshToken: string }> {
        const user = await this.userService.createUser(userData);
        const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
        const tokens = await this.tokenService.generateTokens(payload);

        await this.profileService.createProfile(user.id);
        await this.emailService.sendVerificationEmail(user.id, user.email);

        return {
            user: { id: user.id, name: user.name, email: user.email },
            ...tokens,
        };
    }

    async login(loginData: LoginDTO): Promise<TokenResponse> {
        const user = await this.userService.getUserByEmail(loginData.email);

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        await this.loginAttemptService.checkAccountLock(user);

        if (!user.isActive) {
            throw new AppError('Account is inactive. Please contact support.', 403);
        }

        const isPasswordCorrect = await user.comparePassword(loginData.password);
        if (!isPasswordCorrect) {
            await this.loginAttemptService.handleFailedLogin(user);
            throw new AppError('Invalid email or password', 401);
        }

        await this.loginAttemptService.resetFailedLoginAttempts(user);

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

        const user = await this.userService.getUserById(decoded.userId);

        await this.loginAttemptService.checkAccountLock(user);

        if (!user.isActive) {
            throw new AppError('Account is inactive. Please contact support.', 403);
        }

        await this.tokenService.revokeAllTokensForUser(decoded.userId);

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

        const user = await this.userService.getUserById(decoded.userId);
        if (!user) throw new AppError('User not found', 404);

        user.isEmailVerified = true;
        await user.save();
    }

    async sendPasswordResetToken(email: string): Promise<void> {
        const user = await this.userService.getUserByEmail(email);

        if (!user.isActive) {
            throw new AppError('Account is inactive. Please contact support.', 403);
        }

        const resetToken = await this.tokenService.signResetToken({ userId: user.id });

        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        let decoded;

        try {
            decoded = await this.tokenService.verifyResetToken(token);
        } catch {
            throw new AppError('Invalid or expired reset token', 400);
        }

        const user = await this.userService.getUserById(decoded.userId);

        if (!user) throw new AppError('User not found', 404);

        if (!user.isActive) {
            throw new AppError('Account is inactive. Please contact support.', 403);
        }

        await this.loginAttemptService.unlockAccount(user);

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
}
