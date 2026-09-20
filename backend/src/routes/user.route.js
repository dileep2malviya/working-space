import { Router } from 'express';
import { 
    registerUser, 
    verifyUser, 
    loginUser, 
    ForgotPassword, 
    verifyForgotPasswordEmail, 
    resetPassword, 
    changePassword, 
    logOutUser,
    sentOptAgainForVerify,
    refreshAccessToken,
 } from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/register').post(upload.single("avatar"), 
// verifyTurnstile,
registerUser);
router.route('/verify-account').post(verifyUser);
router.route('/send-verification-otp').post(sentOptAgainForVerify);
router.route('/login').post(loginUser);
router.route('/forgot-password').post(ForgotPassword);
router.route('/verify-forgot-password-email').post(verifyForgotPasswordEmail);
router.route('/reset-password').post(resetPassword);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/logout-user').post(verifyJWT, logOutUser);
router.route('/refresh-token').post(refreshAccessToken)

export default router;
