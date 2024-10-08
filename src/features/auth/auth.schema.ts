// auth.schema.ts
import { z } from 'zod';

// Schema for user registration
export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Schema for login
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// Schema for password reset request (email only)
export const requestPasswordResetSchema = z.object({
    email: z.string().email('Invalid email format'),
});

// Schema for resetting password using the reset token
export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});

// Schema for email verification
export const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Verification token is required'),
});

// Schema for refreshing token
export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
