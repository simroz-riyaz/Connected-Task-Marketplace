import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../db';

export const createOffer = async (req: AuthRequest, res: Response) => {
    const { task_id, price, message } = req.body;
    const tasker_id = req.user?.id;

    if (req.user?.role !== 'tasker') {
        return res.status(403).json({ message: 'Only taskers can make offers' });
    }

    try {
        // Check if task exists and is open
        const [tasks] = await pool.query('SELECT status FROM Tasks WHERE id = ?', [task_id]);
        if ((tasks as any[]).length === 0) return res.status(404).json({ message: 'Task not found' });
        if ((tasks as any[])[0].status !== 'open') return res.status(400).json({ message: 'Task is no longer open' });

        // Check if tasker already made an offer
        const [existing] = await pool.query('SELECT id FROM Offers WHERE task_id = ? AND tasker_id = ?', [task_id, tasker_id]);
        if ((existing as any[]).length > 0) return res.status(400).json({ message: 'You have already submitted an offer for this task' });

        const [result] = await pool.query(
            'INSERT INTO Offers (task_id, tasker_id, price, message) VALUES (?, ?, ?, ?)',
            [task_id, tasker_id, price, message]
        );

        res.status(201).json({ id: (result as any).insertId, message: 'Offer submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting offer' });
    }
};

export const getOffersByTask = async (req: AuthRequest, res: Response) => {
    const { task_id } = req.params;

    try {
        const [offers] = await pool.query(
            'SELECT O.*, U.name as tasker_name, U.avatar_url FROM Offers O JOIN Users U ON O.tasker_id = U.id WHERE O.task_id = ?',
            [task_id]
        );
        res.json(offers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching offers' });
    }
};

export const acceptOffer = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const client_id = req.user?.id;

    try {
        // Get offer details and verify ownership of task
        const [offers] = await pool.query(
            'SELECT O.*, T.client_id, T.budget FROM Offers O JOIN Tasks T ON O.task_id = T.id WHERE O.id = ?',
            [id]
        );
        const offer = (offers as any[])[0];

        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        if (offer.client_id !== client_id) return res.status(403).json({ message: 'Not authorized' });

        // Update Offer status
        await pool.query('UPDATE Offers SET status = ? WHERE id = ?', ['accepted', id]);

        // Update Task status and assigned tasker
        await pool.query('UPDATE Tasks SET status = ?, tasker_id = ? WHERE id = ?', ['assigned', offer.tasker_id, offer.task_id]);

        // Reject other offers
        await pool.query('UPDATE Offers SET status = ? WHERE task_id = ? AND id != ?', ['rejected', offer.task_id, id]);

        // Create Payment (Escrow)
        const commission = offer.price * 0.15; // 15% commission
        await pool.query(
            'INSERT INTO Payments (task_id, client_id, tasker_id, amount, commission, escrow_status) VALUES (?, ?, ?, ?, ?, ?)',
            [offer.task_id, client_id, offer.tasker_id, offer.price, commission, 'held']
        );

        res.json({ message: 'Offer accepted and tasker assigned. Payment held in escrow.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error accepting offer' });
    }
};

export const getMyOffers = async (req: AuthRequest, res: Response) => {
    const tasker_id = req.user?.id;

    try {
        const [offers] = await pool.query(
            'SELECT O.*, T.title as task_title, T.status as task_status, T.budget as task_budget FROM Offers O JOIN Tasks T ON O.task_id = T.id WHERE O.tasker_id = ?',
            [tasker_id]
        );
        res.json(offers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching your offers' });
    }
};
