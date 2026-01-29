import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_for_connected_2026';

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role, phone, city } = req.body;

    try {
        // Check if user exists
        const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        if ((existing as any[]).length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await pool.query(
            'INSERT INTO Users (name, email, password_hash, role, phone, city) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password_hash, role, phone, city]
        );

        const userId = (result as any).insertId;
        const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ token, user: { id: userId, name, email, role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        const user = (users as any[])[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
