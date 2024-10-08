import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { errorMiddleware } from './common/middleware/error.middleware';
import { setupSwagger } from './common/config/swagger';

import { authRoutes } from './features/auth/auth.routes';
import { userRoutes } from './features/user/user.routes';
import { profileRoutes } from './features/profile/profile.routes';

import { apiRateLimiter } from './common/middleware/rateLimiter.middleware';

export const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(apiRateLimiter);

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/profile', profileRoutes);

    setupSwagger(app);

    app.use(errorMiddleware);

    return app;
};
