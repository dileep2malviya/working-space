import { publishMessageToQueue } from '../config/rabbitmq.js';
import { checkRateLimit, deleteDataFromRedis, getRedisFunction } from '../config/redisConnection.js';
import { User } from '../models/user.model.js';
import { ActivityAction } from '../constants.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError, preparedErrorObject } from '../utils/errorApi.js';
import { apiResponse } from '../utils/responseApi.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { otpVerifyValidation, userLoginValidation, userRegisterValidation, sentOtpAgainValidation, resetPasswordValidation, changePasswordValidation, userUpdateValidation, userSearchValidation, bulkUsersSchema, verifyForgotPasswordValidation } from '../validation/user.validation.js';
import { isReservedUsername } from '../utils/commonvalidation.js';
import { refreshtokenDecode, tokenDecode } from '../utils/tokoenDecode.js';
import { EMAIL_QUEUE } from '../constants/queue.js';
import { UserActivity } from '../models/activity.model.js';
import { Types } from 'mongoose';
import { userFetchflag } from '../constants.js';
import { sendEmail, sendOtp } from '../utils/sendOtp.js';
import { validateOtpResendTime } from '../utils/helpers.js';

const generateAccessAndRefreshToken = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating access and referesh token", {});
    }
};

const generateResetPasswordToken = async (user) => {
    try {
        const resetPasswordToken = user.generateAccessToken('15m');
        return { resetPasswordToken };
    }
    catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating reset password token", {});
    }
};

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, role } = req.body ?? {};
        const validationResult = userRegisterValidation.safeParse(req.body ?? {});
        if (!validationResult.success) {
            const errors = preparedErrorObject(validationResult.error.issues);
            throw new ApiError(400, 'Validation error', errors);
        }
        await checkRateLimit({
            key: `userRegister:${email}`,
            limit: 5,
            ttl: 60
        });

        const isReserved = isReservedUsername(username);
        if (isReserved) {
            throw new ApiError(400, "Username is reserved. Please choose a different username.", { username: "Username is reserved. Please choose a different username." });
        }

        const existingUser = await User.find({
            $or: [{ username }, { email }],
        }, {
            username: 1,
            email: 1,
        }).lean();

        const errors = {};

        if (existingUser) {
            for (const user of existingUser) {
                if (user.username === username) {
                    errors.username = "Username already exists";
                }
                if (user.email === email) {
                    errors.email = "Email already exists";
                }
            }
        }

        if (Object.keys(errors).length) {
            throw new ApiError(409, "Registration failed", errors);
        }

        const avatarLocalPath = req.file?.path ?? "";

        if (!avatarLocalPath) {
            throw new ApiError(400, "Profile picture is required", {});
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if (!avatar?.url) {
            throw new ApiError(500, "Something went wrong while uploading the profile picture", {});
        }

        const userSave = new User({
            firstName,
            lastName,
            username,
            email,
            avatar: avatar?.url ? avatar.url : "",
            password,
            role: ['member', 'admin'].includes(role) ? role : 'member'
        });

        const token = userSave.generateEmailVerificationToken();
        const userResponse = await userSave.save();

        const createdUser = await User.findById(userResponse._id).select("-password -refreshToken -isDeleted -isActive -isVerified -__v").lean();
        await UserActivity.create({
            userId: userResponse._id,
            action: ActivityAction.REGISTER,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user", {});
        }

        const verificationUrl = `${process.env.FRONTEND_URL}/account-verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

        await sendEmail({
            email,
            text: verificationUrl,
            emailType: "WELCOME_USER",
            subject: "Your Email Verification Url",
        });

        return res.status(201).json(apiResponse(201, null, "User registered successfully"));
    }

    catch (error) {

        console.log("error catch", error);
        const err = error;
        if (err.code === 11000) {
            console.log("Duplicate key error:", err.keyPattern, err.keyValue);
            const field = Object.keys(err.keyPattern)[0];
            throw new ApiError(409, `${field} already exists`, { [field]: `${field} already exists` });
        }
        throw error;
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body ?? {};
        const validationResult = userLoginValidation.safeParse(req.body ?? {});

        if (!validationResult.success) {
            const errors = preparedErrorObject(validationResult.error.issues);
            throw new ApiError(400, 'Validation error', errors);
        }

        await checkRateLimit({
            key: `login:${email}`,
            limit: 5,
            ttl: 60
        });

        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            throw new ApiError(401, 'Invalid credentials', {});
        }
        if (!currentUser.isVerified) {
            throw new ApiError(409, "Please verify your email before logging in.", {});
        }
        if (!currentUser.isActive) {
            throw new ApiError(403, "Your account is disabled.");
        }
        if (currentUser.isDeleted) {
            throw new ApiError(403, "Account no longer exists.");
        }

        console.info({
            userId: currentUser._id,
            email: currentUser.email,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        const isPasswordValid = await currentUser.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(currentUser);

        const options = {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: process.env.COOKIE_SAME_SITE,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        await UserActivity.create({
            userId: currentUser._id,
            action: ActivityAction.LOGIN,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .json(apiResponse(200, {
            user: currentUser,
            accessToken
        }, "User Logged In Successfully"));
    }
    catch (error) {
        console.log("error: ", error);
        throw error;
    }
});

const verifyUser = asyncHandler(async (req, res) => {
    const validationResult = otpVerifyValidation.safeParse(req.body ?? {});

    if (!validationResult.success) {
        const errors = preparedErrorObject(validationResult.error.issues);
        throw new ApiError(400, 'Validation error', errors);
    }

    const { email, token } = validationResult.data;
    await checkRateLimit({
        key: `verify:${email}`,
        limit: 2,
        ttl: 90
    });

    const findUser = await User.findOne({ email }).select("_id email isVerified emailVerifyToken").lean();

    if (!findUser) {
        throw new ApiError(404, 'User not found', { error: "Verification failed" });
    }

    if (findUser.isVerified) {
        return res.status(200).json(apiResponse(200, findUser, "Account is already verified."));
    }

    const decodedToken = await tokenDecode(token);

    if (!decodedToken || decodedToken.email !== email || decodedToken._id.toString() !== findUser._id.toString() || findUser.emailVerifyToken !== token) {
        throw new ApiError(400, "Invalid or expired verification link.");
    }

    const verifiedUser = await User.findOneAndUpdate({
        _id: decodedToken._id,
        email,
        isVerified: false,
        emailVerifyToken: token
    }, {
        $set: {
            isVerified: true
        },
        $unset: {
            emailVerifyToken: ""
        }
    }, {
        returnDocument: "after"
    }).select("_id email isVerified").lean();

    if (!verifiedUser) {
        throw new ApiError(500, "Unable to verify account.");
    }

    return res.status(200).json(apiResponse(200, verifiedUser, "Account verified successfully."));
});

const sentOptAgainForVerify = asyncHandler(async (req, res) => {
    const validationResult = sentOtpAgainValidation.safeParse(req.body ?? {});
    if (!validationResult.success) {
        const errors = preparedErrorObject(validationResult.error.issues);
        throw new ApiError(400, 'Validation error', errors);
    }

    const { email } = validationResult.data;
    await checkRateLimit({
        key: `sentOptAgain:${email}`,
        limit: 5,
        ttl: 120
    });

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).json(apiResponse(200, null, "If an account exists for this email, a verification email has been sent."));
    }
    if (user.isVerified) {
        return res.status(200).json(apiResponse(200, null, 'User is already verified.'));
    }

    const token = user.generateEmailVerificationToken();

    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.FRONTEND_URL}/account-verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

    await sendEmail({
        email,
        text: verificationUrl,
        emailType: "WELCOME_USER",
        subject: "Your Email Verification Url",
    });

    return res.status(200).json(apiResponse(200, null, 'Your email verification link has been sent again. Please verify your email as soon as possible.'));
});

const ForgotPassword = asyncHandler(async (req, res) => {
    try {
        const validationResult = sentOtpAgainValidation.safeParse(req.body ?? {});

        if (!validationResult.success) {
            const errors = preparedErrorObject(validationResult.error.issues);
            throw new ApiError(400, 'Validation error', errors);
        }

        const { email, otpResendAllowedAt } = validationResult.data;

        const resendAllowedAt = Number(otpResendAllowedAt);

        validateOtpResendTime(resendAllowedAt);
        await checkRateLimit({
            key: `forgotpassword:${email}`,
            limit: 1,
            ttl: 120
        });

        const currentUser = await User.findOne({ email }).select("_id isVerified isActive isDeleted");

        if (!currentUser ||
            !currentUser.isActive ||
            !currentUser.isVerified ||
            currentUser.isDeleted) {
            return res.status(200).json(apiResponse(200, null, "If an account exists for this email, a password reset OTP has been sent."));
        }

        await sendOtp({
            email,
            redisKey: `forgotPassword:${email}`,
            emailType: "RESET_PASSWORD",
            subject: "Your Password Reset Code",
        });

        const nextResendAllowedAt = Date.now() + 120 * 1000;
        const responsedata = {
            email,
            retryAfter: 120,
            resendAllowedAt: nextResendAllowedAt.toString()
        };

        return res.status(200).json(apiResponse(200, responsedata, 'If an account exists for this email, a password reset OTP has been sent.'));
    }
    catch (error) {
        throw error;
    }
});

const verifyForgotPasswordEmail = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body ?? {};
        const validationResult = verifyForgotPasswordValidation.safeParse(req.body ?? {});

        if (!validationResult.success) {
            const errors = preparedErrorObject(validationResult.error.issues);
            throw new ApiError(400, 'Please request a new OTP.', errors);
        }

        await checkRateLimit({
            key: `verifyForgotPassword:${email}`,
            limit: 3,
            ttl: 90
        });

        const redisKey = `forgotPassword:${email}`;
        const savedOtp = await getRedisFunction(redisKey);
        
        if (!savedOtp || savedOtp !== otp) {
            throw new ApiError(400, 'Otp is invalid or expired');
        }

        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            await deleteDataFromRedis(redisKey);
            throw new ApiError(404, 'Invalid OTP or email');
        }

        const { resetPasswordToken } = await generateResetPasswordToken(currentUser);
        await deleteDataFromRedis(redisKey);

        const options = {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: process.env.COOKIE_SAME_SITE,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        return res
            .cookie("resetToken", resetPasswordToken, options)
            .status(200).json(apiResponse(200, null, "OTP verified successfully. You can now reset your password."));

    }
    catch (error) {
        throw error;
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const resetToken = req.cookies.resetToken;

    if (!resetToken) {
        throw new ApiError(401, "Reset session has expired.");
    }

    const validationResult = resetPasswordValidation.safeParse(req.body);
    if (!validationResult.success) {
        throw new ApiError(400, "Validation error", preparedErrorObject(validationResult.error.issues));
    }

    await checkRateLimit({
        key: `resetPassword:${req.ip}`,
        limit: 5,
        ttl: 90
    });

    const { newPassword } = validationResult.data;
    const decoded = await tokenDecode(resetToken);
    if (!decoded) {
        throw new ApiError(401, "Invalid or expired reset token.");
    }

    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
        throw new ApiError(404, "User not found.");
    }

    const isSamePassword = await currentUser.isPasswordCorrect(newPassword);
    if (isSamePassword) {
        throw new ApiError(400, "New password must be different from your previous password.");
    }

    currentUser.password = newPassword;
    await currentUser.save();
    currentUser.refreshToken = "";
    await currentUser.save({ validateBeforeSave: false });
    await deleteDataFromRedis(`reset-password:${decoded._id}`);

    const message = {
        type: 'PASSWORD_CHANGED',
        payload: {
            to: currentUser.email,
            subject: "Your Email Verification Code",
            text: `"Your password has been changed successfully."`
        }
    };

    await publishMessageToQueue(EMAIL_QUEUE, message);
    await UserActivity.create({
        userId: currentUser._id,
        action: ActivityAction.PASSWORD_RESET,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });

    const options = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAME_SITE,
    };

    return res
        .clearCookie("resetToken", options)
        .status(200).json(apiResponse(200, null, "Password has been reset successfully. Please log in again."));
});

const changePassword = asyncHandler(async (req, res) => {
    const validationResult = changePasswordValidation.safeParse(req.body);

    if (!validationResult.success) {
        throw new ApiError(400, "Validation error", preparedErrorObject(validationResult.error.issues));
    }

    await checkRateLimit({
        key: `changePassword:${req.ip}`,
        limit: 5,
        ttl: 90
    });

    const { currentPassword, newPassword } = validationResult.data;
    const currentUser = await User.findById(req?.user?._id);

    if (!currentUser) {
        throw new ApiError(401, "Unauthorized");
    }

    const isCurrentPasswordValid = await currentUser.isPasswordCorrect(currentPassword);
    if (!isCurrentPasswordValid) {
        throw new ApiError(400, "Current password is incorrect.");
    }

    const isSamePassword = await currentUser.isPasswordCorrect(newPassword);
    if (isSamePassword) {
        throw new ApiError(400, "New password must be different from your current password.");
    }

    currentUser.password = newPassword;
    currentUser.refreshToken = "";
    await currentUser.save({ validateBeforeSave: false });

    await UserActivity.create({
        userId: currentUser._id,
        action: ActivityAction.PASSWORD_CHANGED,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    
    const options = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAME_SITE,
    };

    return res.status(200)
        .clearCookie("refreshToken", options)
        .json(apiResponse(200, null, "Password changed successfully. Please log in again."));
});

const logOutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized access", {});
    }

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
        throw new ApiError(404, "User not found.");
    }

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: "",
            updatedAt: new Date(),
        }
    }, {
        runValidators: false
    });

    await UserActivity.create({
        userId: currentUser._id,
        action: ActivityAction.LOGOUT,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });

    const options = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAME_SITE,
    };

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .json(apiResponse(200, "Logged out successfully.", "Logged out successfully."));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const getRefreshToken = req.cookies.refreshToken;

    if (!getRefreshToken) {
        throw new ApiError(401, "Refresh token is required.");
    }

    const decoded = await refreshtokenDecode(getRefreshToken)

    const user = await User.findById(decoded._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token.");
    }

    if (user.refreshToken !== getRefreshToken) {
        throw new ApiError(401, "Refresh token has expired.");
    }

     const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const options = {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: process.env.COOKIE_SAME_SITE,
        };

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .json(apiResponse(200, {
            user,
            accessToken
        }, "User Logged In Successfully"));
});

export { registerUser, loginUser, verifyUser, sentOptAgainForVerify, ForgotPassword, verifyForgotPasswordEmail, resetPassword, changePassword, logOutUser, refreshAccessToken };
