import 'dotenv/config';

import { createApp } from './app';

import { connectDB } from './common/config/database';
import { logger } from './common/config/logger';

const startServer = async () => {
    try {
        await connectDB();
        const app = createApp();
        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
