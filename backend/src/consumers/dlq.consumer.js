import { EMAIL_DLQ } from "../constants/queue.js";
import { emailHandlers } from "../handlers/index.js";

const DLQConsumer = async (channel) => {
    await channel.assertExchange("email-dlx", "direct", { durable: true });
    await channel.assertQueue(EMAIL_DLQ, { durable: true });

    await channel.bindQueue(EMAIL_DLQ, "email-dlx", "email-events");

    channel.consume(EMAIL_DLQ, async (msg) => {
        console.log(msg);

        if (!msg) return;

        try {
            const event = JSON.parse(msg.content.toString());

            const handler = emailHandlers[event.type];

            if (!handler) {
                channel.ack(msg);
                return;
            }

            const headers = msg.properties.headers || {};

            const xDeath = headers["x-death"];

            const reason = xDeath?.[0]?.reason;

            if (reason === "expired") {
                channel.ack(msg);
                return;
            }

            console.log("x-death:", xDeath);

            await handler(event.payload);

            channel.ack(msg);
        } catch (error) {
            console.error("DLQ processing failed:", error);

            // Prevent infinite retries on the DLQ.
            channel.ack(msg);
        }
    });
};

export { DLQConsumer };