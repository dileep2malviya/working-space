import amqp from 'amqplib';
import { ApiError } from '../utils/errorApi.js';
import { EMAIL_DLX } from '../constants/queue.js';
let channel = null;
let connection = null;
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getRabbitMQConfig = () => ({
    protocol: 'amqp',
    hostname: process.env.RABBITMQ_HOST_NAME || 'rabbitmq',
    port: process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT, 10) : 5672,
    username: process.env.RABBITMQ_DEFAULT_USER || 'guest',
    password: process.env.RABBITMQ_DEFAULT_PASS || 'guest',
    heartbeat: 30
});
const connectRabbitMQ = async () => {
    if (connection && channel) {
        console.log('RabbitMQ already connected');
        return channel;
    }

    const options = getRabbitMQConfig();
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            connection = await amqp.connect(options);
            channel = await connection.createChannel();

            connection.on('error', (err) => {
                console.error('RabbitMQ connection error:', err);
                channel = null;
                connection = null;
            });

            connection.on('close', () => {
                console.warn('RabbitMQ connection closed');
                channel = null;
                connection = null;
            });

            console.log('Connected to RabbitMQ at', options.hostname);
            return channel;
        } catch (err) {
            const message = err && err.message ? err.message : String(err);
            console.warn(`RabbitMQ connect attempt ${attempt} failed; continuing without RabbitMQ:`, message);
            if (attempt === maxAttempts) {
                channel = null;
                connection = null;
                return null;
            }
            await wait(1000 * attempt);
        }
    }

    return null;
};

const publishMessageToQueue = async (queueName, message) => {
    console.log("queueName :: ",queueName)
    try {
        if (!channel) {
            channel = await connectRabbitMQ();
        }

        if (!channel) {
            throw new ApiError(503, 'RabbitMQ is not available. Please start RabbitMQ and try again.', {
                queue: queueName,
                status: 'not_connected'
            });
        }

        await channel.assertExchange(EMAIL_DLX, 'direct', { durable: true });

        const queueOptions = {
            durable: true,
            arguments: {
                "x-dead-letter-exchange": EMAIL_DLX,
                "x-dead-letter-routing-key": queueName,
            },
        };
        await channel.assertQueue(queueName, queueOptions);

        const enqueued = channel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(message)),
            {
                persistent: true,
                expiration: '120000',
            }
        );

        if (!enqueued) {
            throw new ApiError(502, 'Failed to enqueue message to RabbitMQ.', {
                queue: queueName,
                status: 'send_failed'
            });
        }

        console.log('RabbitMQ message queued successfully:', queueName);
    }
    catch (error) {
        console.error('Failed to publish message to RabbitMQ queue', queueName, error);
        channel = null;
        if (typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 406) {
            throw new ApiError(502, 'Failed to publish message: queue configuration mismatch. Please verify queue settings and dead-letter exchange.', { queue: 'Queue already exists with different arguments' });
        }
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(502, 'Failed to publish message to RabbitMQ.', { queue: 'Unable to enqueue message' });
    }
};
export { connectRabbitMQ, publishMessageToQueue };
