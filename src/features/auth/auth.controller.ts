import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './auth.types';
import { asyncHandler } from '../../common/utils/async.util';

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
}
