import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { setupSwagger } from './common/config/swagger';
import { errorMiddleware } from './common/middleware/error.middleware';
import { apiRateLimiter } from './common/middleware/rate-limiter.middleware';
import { authRoutes } from './features/auth/auth.routes';
import { userAchievementsRoutes } from './features/user-achievements/user-achievements.routes';
import { userActivitiesRoutes } from './features/user-activities/user-activities.routes';
import { userProfileRoutes } from './features/user-profile/user-profile.routes';
import { userSettingsRoutes } from './features/user-settings/user-settings.routes';
import { userRoutes } from './features/user/user.routes';

export const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(apiRateLimiter);

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/user-profile', userProfileRoutes);
    app.use('/api/user-settings', userSettingsRoutes);
    app.use('/api/user-achievements', userAchievementsRoutes);
    app.use('/api/user-activities', userActivitiesRoutes);

    setupSwagger(app);

    app.use(errorMiddleware);

    return app;
};
