import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../db';

export const createTask = async (req: AuthRequest, res: Response) => {
    const { title, category, description, location, date_time, budget } = req.body;
    const client_id = req.user?.id;

    if (req.user?.role !== 'client') {
        return res.status(403).json({ message: 'Only clients can post tasks' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO Tasks (client_id, title, category, description, location, date_time, budget) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [client_id, title, category, description, location, date_time, budget]
        );
        res.status(201).json({ id: (result as any).insertId, message: 'Task created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task' });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    const { category, status, search, client_id, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT T.*, U.name as client_name FROM Tasks T JOIN Users U ON T.client_id = U.id WHERE 1=1';
    const params: any[] = [];

    if (category) {
        query += ' AND T.category = ?';
        params.push(category);
    }

    if (status) {
        query += ' AND T.status = ?';
        params.push(status);
    }

    if (search) {
        query += ' AND (T.title LIKE ? OR T.description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (client_id) {
        query += ' AND T.client_id = ?';
        params.push(Number(client_id));
    }

    query += ' ORDER BY T.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    try {
        const [tasks] = await pool.query(query, params);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const [tasks] = await pool.query(
            'SELECT T.*, U.name as client_name, U.avatar_url FROM Tasks T JOIN Users U ON T.client_id = U.id WHERE T.id = ?',
            [id]
        );

        if ((tasks as any[]).length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json((tasks as any[])[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching task details' });
    }
};
