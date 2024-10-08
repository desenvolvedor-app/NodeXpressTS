import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.types';
import { asyncHandler } from '../../common/utils/async.util';
import { AppError } from '../../common/utils/error.util';

export class AuthController {
    constructor(private authService: AuthService) {}

    register = asyncHandler(async (req: Request, res: Response) => {
        const userData: RegisterDTO = req.body;
        const result = await this.authService.register(userData);
        res.status(201).json(result);
    });

    verifyEmail = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.body;
        await this.authService.verifyEmail(token);
        res.json({ message: 'Email verified successfully.' });
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const loginData: LoginDTO = req.body;
        const result = await this.authService.login(loginData);
        res.json(result);
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('No refresh token provided', 400);
        }

        const tokens = await this.authService.refreshToken(refreshToken);
        res.json(tokens);
    });

    requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            throw new AppError('No email provided', 400);
        }

        await this.authService.sendPasswordResetToken(email);
        res.json({ message: 'Password reset email sent.' });
    });

    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw new AppError('No token or new password provided', 400);
        }

        await this.authService.resetPassword(token, newPassword);
        res.json({ message: 'Password reset successful.' });
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Authorization token is missing or invalid', 401);
        }

        const token = authHeader.split(' ')[1];

        await this.authService.revokeToken(token);

        res.json({ message: 'Logged out successfully.' });
    });
}
