import multer from "multer";
import path from "path";
import { checkImageExtenion } from "../utils/commonvalidation.js";
import { ApiError } from "../utils/errorApi.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/temp");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    if (checkImageExtenion(file.originalname)) {
        cb(null, true);
    }
    else {
        cb(new ApiError(400, "Invalid file type", { error: "Only JPG, JPEG, and PNG files are allowed." }));
    }
};

export const upload = multer({
    storage,
    fileFilter
});
