import { emailServiceSend } from "../services/email.services.js";
import fs from "fs/promises";
import path from "path";

const CreateBookingHandler = async (data) => {
    const filePath = path.join(
        process.cwd(),
        "src",
        "templates",
        "bookingCreate.html"
    );

    let html = await fs.readFile(filePath, "utf-8");

    html = html.replace("{{name}}", data.to);
    html = html.replace("{{spaceName}}", data.data.space);
    html = html.replace("{{startTime}}", data.data.startTime);
    html = html.replace("{{endTime}}", data.data.endTime);
    html = html.replace("{{bookingDate}}", data.data.selectedDate);

    const result = await emailServiceSend.send({
        to: data.to,
        subject: "Welcome",
        text: html,
    });

};

export {
    CreateBookingHandler,
};