import { ApiError } from "../utils/errorApi.js";
import { tokenDecode } from "../utils/tokoenDecode.js";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization?.toString() || req.headers.Authorization?.toString();

        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            throw new ApiError(401, "Authentication required.");
        }

        const decodeedData = await tokenDecode(token);
        if (!decodeedData?._id) {
            throw new ApiError(401, "Invalid or expired token.");
        }

        const userId = decodeedData?._id;

        const currentUser = await User.findById(userId).select("-password -refreshToken -__v").lean();


        if (!currentUser) {
            throw new ApiError(401, "Authentication required.");
        }

        req.user = {
            ...currentUser,
            role: decodeedData.role || currentUser.role || 'member'
        };

        next();
    }
    catch (error) {
        next(error);
    }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return next(new ApiError(403, "You do not have permission to access this resource."));
    }
    next();
};

export { verifyJWT, authorizeRoles };
