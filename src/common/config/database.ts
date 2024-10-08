import mongoose from 'mongoose';

import { logger } from './logger';

interface ConnectionOptions extends mongoose.ConnectOptions {
    serverSelectionTimeoutMS: number;
    heartbeatFrequencyMS: number;
}

const options: ConnectionOptions = {
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
};

export const connectDB = async (): Promise<void> => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        logger.error('MONGODB_URI is not defined in environment variables');
        process.exit(1);
    }

    try {
        const connection = await mongoose.connect(MONGODB_URI, options);

        logger.info(`MongoDB connected: ${connection.connection.host}`);

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                logger.error('Error during MongoDB connection closure:', err);
                process.exit(1);
            }
        });
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
