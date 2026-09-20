import {
    EMAIL_DLX,
    EMAIL_QUEUE,
    EMAIL_DLQ,
    MAX_RETRIES,
} from "../constants/queue.js";
import { emailHandlers } from "../handlers/index.js";
import { shouldRetry } from "../utils/retry.js";

const startEmailConsumer = async (channel) => {
    console.log("channel :: ", channel ? 'connected' : 'missing');

    if (!channel || typeof channel.consume !== 'function') {
        throw new Error('RabbitMQ channel is missing or invalid. Consumer not started.');
    }

    channel.on('error', (error) => {
        console.error('RabbitMQ consumer channel error:', error);
    });

    channel.on('close', () => {
        console.warn('RabbitMQ consumer channel closed. Messages cannot be acknowledged until a new consumer is started.');
    });

    await channel.assertExchange(EMAIL_DLX, "direct", {
        durable: true,
    });

    await channel.assertQueue(EMAIL_DLQ, {
        durable: true,
    });

    await channel.bindQueue(
        EMAIL_DLQ,
        EMAIL_DLX,
        EMAIL_QUEUE
    );

    await channel.assertQueue(EMAIL_QUEUE, {
        durable: true,
        arguments: {
            "x-dead-letter-exchange": EMAIL_DLX,
            "x-dead-letter-routing-key": EMAIL_QUEUE,
        },
    });

    const consumeResult = await channel.consume(EMAIL_QUEUE, async (msg) => {
        if (!msg) return;

        try {
            const payload = msg.content.toString();
            console.log("payload received:", payload);

            const event = JSON.parse(payload);
            const handler = emailHandlers[event.type];

            if (!handler) {
                console.warn("No handler found for event type:", event.type);
                channel.ack(msg);
                return;
            }

            await handler(event.payload);
            channel.ack(msg);
        } catch (error) {
            if (error.message === 'Unexpected close') {
                console.error('Message was received, but RabbitMQ closed before it could be acknowledged. Check the earlier connection/channel error.');
                return;
            }

            const headers = msg.properties.headers || {};
            const retries = Number(headers.retries || 0);
            const errorCode = error instanceof Error ? error.code : undefined;

            if (errorCode && shouldRetry(errorCode) && retries < MAX_RETRIES) {
                try {
                    channel.sendToQueue(
                        EMAIL_QUEUE,
                        msg.content,
                        {
                            persistent: true,
                            headers: {
                                ...headers,
                                retries: retries + 1,
                            },
                        }
                    );
                    channel.ack(msg);
                } catch (ackError) {
                    console.error('RabbitMQ closed while retrying or acknowledging message:', ackError);
                }
            } else {
                console.log("Maximum retries reached.");
                try {
                    channel.nack(msg, false, false);
                } catch (nackError) {
                    console.error('RabbitMQ closed before message could be rejected:', nackError);
                }
            }
        }
    }, { noAck: false });

    console.log("RabbitMQ consumer started for queue:", EMAIL_QUEUE, "consumerTag:", consumeResult.consumerTag);
    return consumeResult;
};

export { startEmailConsumer };