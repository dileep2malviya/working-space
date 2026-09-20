import { Router } from 'express';
import { authorizeRoles, verifyJWT } from '../middleware/auth.middleware.js';
import { createMaintenance, getAllMaintenance } from '../controllers/maintaince.controller.js';

const router = Router();

router
	.route('/')
	.post(verifyJWT, authorizeRoles('admin'), createMaintenance)
	.get(verifyJWT, authorizeRoles('admin'), getAllMaintenance);

export default router;