import jwt from 'jsonwebtoken';
import { ApiError } from './errorApi.js';
const scretKey = process.env.ACCESS_TOKEN_SECRET ?? "";
const refreshScretKey = process.env.REFRESH_TOKEN_SECRET ?? "";
const tokenDecode = async (token) => {
    if (!token)
        return null;
    try {
        const decoded = await jwt.verify(token, scretKey);
        return decoded.data;
    }
    catch (err) {
        console.error('Error decoding token:', err);
        throw new ApiError(401, 'Unauthorized access', err);
    }
};

const refreshtokenDecode = async (token) => {
    if (!token)
        return null;
    try {
        const decoded = await jwt.verify(token, refreshScretKey);
        return decoded.data;
    }
    catch (err) {
        console.error('Error decoding token:', err);
        throw new ApiError(401, 'Unauthorized access', err);
    }
};
export { tokenDecode, refreshtokenDecode };
