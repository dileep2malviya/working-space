import axios from 'axios';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/errorApi.js';

const verifyTurnstile = asyncHandler(async (req, res, next) => {
    console.log("verifyTurnstile :: ", req.body);
    const turnstileToken = req.body.turnstile_key;
    try {
        if (!turnstileToken) {
            throw new ApiError(400, 'Turnstile token is missing', { message: 'Captcha is required' });
        }
        const responseTurnstile = await axios.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        if (!responseTurnstile.data.success) {
            throw new ApiError(400, 'Turnstile verification failed', { message: 'Captcha verification failed' });
        }
        next();
    }
    catch (error) {
        console.log("error verifyTurnstile :: ", error);
        throw error;
    }
});
export { verifyTurnstile };
