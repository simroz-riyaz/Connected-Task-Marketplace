import express from 'express';
import { createOffer, getOffersByTask, acceptOffer, getMyOffers } from '../controllers/offerController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createOffer);
router.get('/my-offers', authMiddleware, getMyOffers);
router.get('/task/:task_id', authMiddleware, getOffersByTask);
router.put('/:id/accept', authMiddleware, acceptOffer);

export default router;
