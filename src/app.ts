import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { errorMiddleware } from './common/middleware/error.middleware';
import { setupSwagger } from './common/config/swagger';

import { authRoutes } from './features/auth/auth.routes';
import { userRoutes } from './features/user/user.routes';
import { profileRoutes } from './features/profile/profile.routes';

export const createApp = () => {
    const app = express();

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/profile', profileRoutes);

    // Swagger
    setupSwagger(app);

    // Error handling
    app.use(errorMiddleware);

    return app;
};
