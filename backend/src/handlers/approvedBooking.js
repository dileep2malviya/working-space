import { emailServiceSend } from "../services/email.services.js";
import fs from "fs/promises";
import path from "path";

const ApprovedBookingHandler = async (data) => {
    const filePath = path.join(
        process.cwd(),
        "src",
        "templates",
        "approvebooking.html"
    );

    let html = await fs.readFile(filePath, "utf-8");

    html = html.replace("{{name}}", data.to);
    html = html.replace("{{spaceName}}", data.data.space);
    html = html.replace("{{startTime}}", data.data.startTime);
    html = html.replace("{{endTime}}", data.data.endTime);
    html = html.replace("{{bookingDate}}", data.data.bookingDate);

    await emailServiceSend.send({
        to: data.to,
        subject: "Booking Approved",
        text: html,
    });
};

export { ApprovedBookingHandler };
