import { Router } from 'express';
import {
  addComplaintComment,
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getMyComplaints,
  updateComplaintStatus
} from '../controllers/complaintController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { upload } from '../utils/upload.js';

const router = Router();

router.post('/', protect, upload.single('image'), createComplaint);
router.get('/mine', protect, getMyComplaints);
router.get('/', protect, authorize('admin'), getAllComplaints);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, authorize('admin', 'staff'), updateComplaintStatus);
router.post('/:id/comments', protect, addComplaintComment);

export default router;
