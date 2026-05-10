import { Router } from 'express';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { getAdminDashboard, listDepartments, listUsers, getHeatmapData } from '../controllers/adminController.js';

const router = Router();

router.use(protect, authorize('admin'));
router.get('/dashboard', getAdminDashboard);
router.get('/users', listUsers);
router.get('/departments', listDepartments);
router.get('/heatmap', getHeatmapData);

export default router;
