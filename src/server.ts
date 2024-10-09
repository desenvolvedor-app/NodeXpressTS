import 'dotenv/config';

import { Server } from 'http';
import { AddressInfo } from 'net';

import { createApp } from './app';
import { connectDB } from './common/config/database';
import { logger } from './common/config/logger';

interface ServerInstance {
    server: Server;
    shutdown: () => Promise<void>;
}

export const createServer = async (port: number = 0): Promise<ServerInstance> => {
    await connectDB();
    const app = createApp();

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            const actualPort = (server.address() as AddressInfo).port;
            logger.info(`Server running on port ${actualPort}`);

            const shutdown = async () => {
                return new Promise<void>((resolveShutdown) => {
                    server.close(() => resolveShutdown());
                });
            };

            resolve({ server, shutdown });
        });
    });
};

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    createServer(PORT).catch((error) => {
        logger.error('Failed to start server:', error);
        process.exit(1);
    });
}
