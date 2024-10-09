import { Request, Response } from 'express';

import { asyncHandler } from '../../common/utils/async.util';
import { AppError } from '../../common/utils/error.util';
import { extractTokenFromHeader } from '../../common/utils/extract-token.util';
import { AuthService } from './auth.service';
import { AuthRequest, LoginDTO, RegisterDTO } from './auth.types';

export class AuthController {
    constructor(private authService: AuthService) {}

    register = asyncHandler(async (req: Request, res: Response) => {
        const userData: RegisterDTO = req.body;
        const result = await this.authService.register(userData);
        res.status(201).json(result);
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const loginData: LoginDTO = req.body;
        const result = await this.authService.login(loginData);
        res.json(result);
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        const token = extractTokenFromHeader(req);

        await this.authService.revokeToken(token);

        res.json({ message: 'Logged out successfully.' });
    });

    requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;

        await this.authService.sendPasswordResetToken(email);
        res.json({ message: 'Password reset email sent.' });
    });

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { token, newPassword } = req.body;

        await this.authService.resetPassword(token, newPassword);
        res.json({ message: 'Password reset successful.' });
    });

    requestEmailVerification = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
        const user = req.user;

        if (!user) {
            throw new AppError('User not found', 400);
        }

        await this.authService.sendVerificationEmail(user.userId);

        res.status(200).json({ message: 'Verification email sent successfully' });
    });

    verifyEmail = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.body;
        await this.authService.verifyEmail(token);
        res.json({ message: 'Email verified successfully.' });
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        const tokens = await this.authService.refreshToken(refreshToken);
        res.json(tokens);
    });
}
