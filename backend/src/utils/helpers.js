import { ApiError } from "./errorApi.js";
import { z } from "zod";

const now = new Date()

const validateOtpResendTime = (otpResendAllowedAt) => {
    if (otpResendAllowedAt > Date.now()) {
        const retryAfter = Math.ceil((otpResendAllowedAt - Date.now()) / 1000);
        throw new ApiError(429, `Please wait ${retryAfter} second${retryAfter === 1 ? "" : "s"} before requesting another OTP.`, {
            retryAfter: retryAfter.toString(),
            resendAllowedAt: otpResendAllowedAt.toString(),
        });
    }
}

const currentDate = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
})

const currentTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
})

const convertDate = (date) => {
    const Date = date.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
    });
    return Date
}

const isPastBookingTime = (bookingDate, startTime) => {
    const bookingDateTime = new Date(`${bookingDate}T${startTime}:00`);

    return bookingDateTime <= new Date();
};

const validateTimeRange = (data, ctx) => {
    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (end <= start) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["endTime"],
            message: "End time must be after start time.",
        });
    }
};

export {
    validateOtpResendTime,
    currentDate,
    currentTime,
    isPastBookingTime,
    validateTimeRange,
    convertDate
}
