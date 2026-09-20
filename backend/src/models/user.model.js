import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errorApi.js';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member',
        index: true,
    },
    refreshToken: {
        type: String
    },
    emailVerifyToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password, 10);
    this.updatedAt = new Date();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateEmailVerificationToken = function (expiresIn = '5m') {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error("ACCESS_TOKEN_SECRET is not defined in environment variables");
        throw new ApiError(500, "Invalid server configuration");
    }
    const token = jwt.sign({
        data: {
            _id: this._id,
            email: this.email
        }
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn
    });
    this.emailVerifyToken = token;
    return token;
};

userSchema.methods.generateAccessToken = function (expiresIn = '60m') {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error("ACCESS_TOKEN_SECRET is not defined in environment variables");
        throw new ApiError(500, "Invalid server configuration");
    }
    return jwt.sign({
        data: {
            _id: this._id,
            email: this.email,
            role: this.role || 'member'
        }
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn
    });
};

userSchema.methods.generateRefreshToken = function (expiresIn = '2d') {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        console.error("REFRESH_TOKEN_SECRET is not defined in environment variables");
        throw new ApiError(500, "Invalid server configuration");
    }
    return jwt.sign({
        data: {
            _id: this._id,
            role: this.role || 'member'
        }
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn
    });
};

userSchema.methods.hasRole = function (...roles) {
    return roles.includes(this.role || 'member');
};

userSchema.set("toJSON", {
    transform(_doc, ret) {
        const { password, refreshToken, isDeleted, isActive, __v, ...safeUser } = ret;
        return safeUser;
    },
});
export const User = mongoose.model("User", userSchema);
