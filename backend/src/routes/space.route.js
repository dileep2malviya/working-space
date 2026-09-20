import { Router } from 'express';
import { authorizeRoles, verifyJWT } from '../middleware/auth.middleware.js';
import { createSpace, deleteSpace, getAllSpace, getSpaceById, getSpaceDropdown, updateSpace } from '../controllers/space.controller.js';

const router = Router();

router.route('/').get(getAllSpace);
router.route('/').post(verifyJWT,authorizeRoles("admin"),createSpace);
router.route('/update/:id').patch(verifyJWT,authorizeRoles("admin"),updateSpace);
router.route('/delete/:id').patch(verifyJWT,authorizeRoles("admin"),deleteSpace)
router.route('/dropdown').get(getSpaceDropdown);
router.route('/space-details/:id').get(getSpaceById);

export default router;