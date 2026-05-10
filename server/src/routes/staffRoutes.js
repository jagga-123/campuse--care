import { Router } from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { getAssignedComplaints, resolveComplaint } from '../controllers/staffController.js';

const router = Router();

router.use(protect, authorize('staff', 'admin'));
router.get('/assigned', getAssignedComplaints);
router.patch('/:id/resolve', resolveComplaint);

export default router;
