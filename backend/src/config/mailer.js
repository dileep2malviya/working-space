import nodemailer from "nodemailer";
import "dotenv/config";

const connectNodemailer = () => {
    const host = process.env.EMAIL_HOST_NAME || process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.EMAIL_PORT_NAME || process.env.SMTP_PORT || 465);
    const user = process.env.EMAIL_HOST_USERNAME || process.env.SMTP_USER;
    const pass = process.env.EMAIL_HOST_PASSWORD || process.env.SMTP_PASS;

    console.log(host,)

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });
};

const transporter = connectNodemailer();

export {
    transporter,
};