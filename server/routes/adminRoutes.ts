import express from 'express';
import { getStats, getAllUsers, handleDispute } from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/stats', authMiddleware, getStats);
router.get('/users', authMiddleware, getAllUsers);
router.post('/dispute', authMiddleware, handleDispute);

export default router;
