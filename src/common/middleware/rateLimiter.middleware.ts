import rateLimit from 'express-rate-limit';

export const passwordResetRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1,
    message: 'Too many password reset attempts from this IP, please try again after 5 minutes',
});

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
