import { otpHandler } from "./otpHandler.js";
import { passwordChangedHandler } from "./passwordChanged.handler.js";
import { resetPasswordHandler } from "./resetPassword.handler.js";
import { WelcomeHandler } from "./welcome.handler.js";
import { CreateBookingHandler } from "./createBooking.js";
import { RejectBookingHandler } from "./rejectedBooking.js";
import { ApprovedBookingHandler } from "./approvedBooking.js";

export const emailHandlers = {
    OTP: otpHandler,
    PASSWORD_CHANGED: passwordChangedHandler,
    RESET_PASSWORD: resetPasswordHandler,
    WELCOME_USER: WelcomeHandler,
    USER_VERIFICATION: WelcomeHandler,
    CREATE_BOOKING: CreateBookingHandler,
    APPROVED_BOOKING: ApprovedBookingHandler,
    REJECTED_BOOKING: RejectBookingHandler,
};