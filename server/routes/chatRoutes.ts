import express from 'express';
import { sendMessage, getMessagesForTask } from '../controllers/chatController';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', authMiddleware, upload.single('file'), sendMessage);
router.get('/task/:task_id', authMiddleware, getMessagesForTask);

export default router;
