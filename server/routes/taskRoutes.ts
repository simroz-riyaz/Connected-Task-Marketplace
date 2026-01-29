import express from 'express';
import { createTask, getTasks, getTaskById } from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);

export default router;
