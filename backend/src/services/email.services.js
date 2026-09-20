import Bottleneck from "bottleneck";
import { transporter as defaultTransporter } from "../config/mailer.js";

const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 5,
});

class EmailService {
    constructor(transporter = defaultTransporter) {
        this.transporter = transporter;
    }

    async send(options) {
        return limiter.schedule(async () => {
            return this.transporter.sendMail({
                from: "Work Space <no-reply@example.com>",
                to: options.to,
                subject: options.subject,
                html: options.text,
            });
        });
    }
}

const emailServiceSend = new EmailService();

export {
    EmailService,
    emailServiceSend,
};