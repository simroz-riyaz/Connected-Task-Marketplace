import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../db';

export const createReview = async (req: AuthRequest, res: Response) => {
    const { task_id, reviewee_id, rating, comment } = req.body;
    const reviewer_id = req.user?.id;

    try {
        // Check if task is completed
        const [tasks] = await pool.query('SELECT status FROM Tasks WHERE id = ?', [task_id]);
        if ((tasks as any[]).length === 0) return res.status(404).json({ message: 'Task not found' });
        if ((tasks as any[])[0].status !== 'completed') return res.status(400).json({ message: 'Can only review completed tasks' });

        // Check if already reviewed
        const [existing] = await pool.query('SELECT id FROM Reviews WHERE task_id = ? AND reviewer_id = ?', [task_id, reviewer_id]);
        if ((existing as any[]).length > 0) return res.status(400).json({ message: 'You have already reviewed this task' });

        await pool.query(
            'INSERT INTO Reviews (task_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [task_id, reviewer_id, reviewee_id, rating, comment]
        );

        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting review' });
    }
};

export const getUserReviews = async (req: AuthRequest, res: Response) => {
    const { user_id } = req.params;

    try {
        const [reviews] = await pool.query(
            'SELECT R.*, U.name as reviewer_name FROM Reviews R JOIN Users U ON R.reviewer_id = U.id WHERE R.reviewee_id = ?',
            [user_id]
        );
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};
