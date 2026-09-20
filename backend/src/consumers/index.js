import { connectRabbitMQ } from '../config/rabbitmq.js';
import { DLQConsumer } from './dlq.consumer.js';
import { startEmailConsumer } from './email.consumer.js';

const connectionfunction = async (existingChannel) => {
    const channel = existingChannel ?? await connectRabbitMQ();

    if (!channel) {
        console.warn('RabbitMQ consumer startup skipped because the broker is not available.');
        return null;
    }

    await startEmailConsumer(channel);
    await DLQConsumer(channel);

    return channel;
};

export default connectionfunction;



