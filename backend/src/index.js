import connectDB from './db/index.js';
import 'dotenv/config';
import { app } from './app.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { connectRedis } from './config/redisConnection.js';
import connectionfunction from './consumers/index.js';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();
        try {
            await connectRedis();
        } catch (error) {
            console.warn('Redis unavailable during startup; continuing without Redis:', error.message || error);
        }

        try {
            const channel = await connectRabbitMQ();
            if (channel) {
                await connectionfunction(channel);
            }
        } catch (error) {
            console.warn('RabbitMQ unavailable during startup; continuing without RabbitMQ:', error.message || error);
        }

        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log('Database startup error :: ', error);
        process.exit(1);
    }
};

await startServer();
