import { Router } from 'express';
import { authorizeRoles, verifyJWT } from '../middleware/auth.middleware.js';
import { approveBooking, cancelBooking, createBooking, getBooking, rejectBooking, updateBooking } from '../controllers/booking.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/').get(getBooking);
router.route('/').post(authorizeRoles('member'), createBooking);

router.route('/update/:id').patch(authorizeRoles('member'), updateBooking);
router.route('/cancel/:id').patch(authorizeRoles('member'), cancelBooking);
router.route('/:id/approve').patch(authorizeRoles('admin'), approveBooking);
router.route('/:id/reject').patch(authorizeRoles('admin'), rejectBooking);

export default router;