import jwt from 'jsonwebtoken';

import { DecodedTokenPayload, TokenPayload } from '../../features/auth/auth.types';
import { TokenModel } from '../models/token.model';

class TokenService {
    private readonly verificationTokenSecret: string;
    private readonly resetTokenSecret: string;
    private readonly jwtSecret: string;
    private readonly jwtExpiresIn: string;
    private readonly refreshTokenSecret: string;
    private readonly refreshTokenExpiresIn: string;

    constructor() {
        this.verificationTokenSecret = process.env.VERIFICATION_TOKEN_SECRET!;
        this.resetTokenSecret = process.env.RESET_TOKEN_SECRET!;
        this.jwtSecret = process.env.JWT_SECRET!;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN!;
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
        this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN!;
    }

    // Generate Email Verification Token
    signEmailToken(payload: { userId: string }): string {
        return jwt.sign(payload, this.verificationTokenSecret, { expiresIn: '1d' });
    }

    // Generate Reset Password Token
    signResetToken(payload: { userId: string }): string {
        return jwt.sign(payload, this.resetTokenSecret, { expiresIn: '1h' });
    }

    // Verify Email Verification Token
    verifyEmailToken(token: string): DecodedTokenPayload {
        return jwt.verify(token, this.verificationTokenSecret) as DecodedTokenPayload;
    }

    // Verify Reset Password Token
    verifyResetToken(token: string): DecodedTokenPayload {
        return jwt.verify(token, this.resetTokenSecret) as DecodedTokenPayload;
    }

    // Generate Access Token and save it to the database
    async generateAccessToken(payload: TokenPayload): Promise<string> {
        const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });

        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + parseInt(this.jwtExpiresIn));

        // Save token to database
        await new TokenModel({
            token: accessToken,
            userId: payload.userId,
            tokenType: 'access',
            expiryDate,
            isRevoked: false,
        }).save();

        return accessToken;
    }

    // Generate Refresh Token and save it to the database
    async generateRefreshToken(payload: TokenPayload): Promise<string> {
        const refreshToken = jwt.sign(payload, this.refreshTokenSecret, { expiresIn: this.refreshTokenExpiresIn });

        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + parseInt(this.refreshTokenExpiresIn));

        // Save token to database
        await new TokenModel({
            token: refreshToken,
            userId: payload.userId,
            tokenType: 'refresh',
            expiryDate,
            isRevoked: false,
        }).save();

        return refreshToken;
    }

    // Generate Access and Refresh Tokens and save both to the database
    async generateTokens(payload: TokenPayload): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = await this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(payload);

        return { accessToken, refreshToken };
    }

    // Verify Access Token (JWT) and ensure it has not been revoked
    async verifyJwtToken(token: string): Promise<DecodedTokenPayload> {
        const isRevoked = await this.isTokenRevoked(token);
        if (isRevoked) {
            throw new Error('Token has been revoked');
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, this.jwtSecret) as DecodedTokenPayload;
        } catch {
            throw new Error('Invalid or expired token');
        }

        return decodedToken;
    }

    // Verify Refresh Token and ensure it has not been revoked
    async verifyRefreshToken(refreshToken: string): Promise<DecodedTokenPayload> {
        const isRevoked = await this.isTokenRevoked(refreshToken);
        if (isRevoked) {
            throw new Error('Token has been revoked or does not exist');
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(refreshToken, this.refreshTokenSecret) as DecodedTokenPayload;
        } catch {
            throw new Error('Invalid or expired refresh token');
        }

        return decodedToken;
    }

    // Revoke all tokens for a user by marking them revoked in the database
    async revokeAllTokensForUser(userId: string): Promise<void> {
        await TokenModel.updateMany({ userId, isRevoked: false }, { $set: { isRevoked: true } });
    }

    // Check if a specific token is revoked
    async isTokenRevoked(token: string): Promise<boolean> {
        const tokenRecord = await TokenModel.findOne({ token });

        if (!tokenRecord) {
            return true;
        }

        return tokenRecord.isRevoked;
    }
}

export default TokenService;
