import { emailServiceSend } from "../services/email.services.js";
import fs from "fs/promises";
import path from "path";

const WelcomeHandler = async (data) => {
    const filePath = path.join(
        process.cwd(),
        "src",
        "templates",
        "welcome.html"
    );

    let html = await fs.readFile(filePath, "utf-8");

    html = html.replace("{{name}}", data.to);
    html = html.replace("{{email}}", data.to);
    html = html.replace("{{url}}", data.text);

    await emailServiceSend.send({
        to: data.to,
        subject: "Welcome",
        text: html,
    });

};

export {
    WelcomeHandler,
};