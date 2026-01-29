import express from 'express';
import { createReview, getUserReviews } from '../controllers/reviewController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/user/:user_id', getUserReviews);

export default router;
