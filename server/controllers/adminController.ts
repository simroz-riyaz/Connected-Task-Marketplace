import { Request, Response } from 'express';
import pool from '../db';
import { AuthRequest } from '../middleware/auth';

export const getStats = async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

    try {
        const [userCount] = await pool.query('SELECT COUNT(*) as count FROM Users');
        const [taskCount] = await pool.query('SELECT COUNT(*) as count FROM Tasks');
        const [totalRevenue] = await pool.query('SELECT SUM(commission) as total FROM Payments WHERE escrow_status = "released"');
        const [activeDisputes] = await pool.query('SELECT COUNT(*) as count FROM Payments WHERE escrow_status = "held"');

        res.json({
            users: (userCount as any)[0].count,
            tasks: (taskCount as any)[0].count,
            revenue: (totalRevenue as any)[0].total || 0,
            disputes: (activeDisputes as any)[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

    try {
        const [users] = await pool.query('SELECT id, name, email, role, city, verified, created_at FROM Users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const handleDispute = async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const { payment_id, action } = req.body; // action: 'release' or 'refund'

    try {
        const status = action === 'release' ? 'released' : 'refunded';
        await pool.query('UPDATE Payments SET escrow_status = ? WHERE id = ?', [status, payment_id]);

        // Log admin action
        await pool.query(
            'INSERT INTO AdminActions (admin_id, action_type, details) VALUES (?, ?, ?)',
            [req.user.id, `dispute_${action}`, `Payment ${payment_id} ${status}`]
        );

        res.json({ message: `Payment ${status} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error handling dispute' });
    }
};
