import jwt from 'jsonwebtoken';

import { DecodedTokenPayload, TokenPayload } from '../../features/auth/auth.types';

const VERIFICATION_TOKEN_SECRET = process.env.VERIFICATION_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function signEmailToken(payload: any): string {
    return jwt.sign(payload, VERIFICATION_TOKEN_SECRET!, {
        expiresIn: '1d',
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function signResetToken(payload: any): string {
    return jwt.sign(payload, RESET_TOKEN_SECRET!, {
        expiresIn: '1h',
    });
}

export function verifyResetToken(token: string): DecodedTokenPayload {
    return jwt.verify(token, RESET_TOKEN_SECRET!) as DecodedTokenPayload;
}

export function verifyEmailToken(token: string): DecodedTokenPayload {
    return jwt.verify(token, VERIFICATION_TOKEN_SECRET!) as DecodedTokenPayload;
}

export function verifyRefreshToken(refreshToken: string): DecodedTokenPayload {
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!) as DecodedTokenPayload;
}

export function verifyJwtToken(token: string): DecodedTokenPayload {
    return jwt.verify(token, JWT_SECRET!) as DecodedTokenPayload;
}

export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET!, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET!, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
}

export const generateTokens = (payload: TokenPayload): { accessToken: string; refreshToken: string } => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
};
