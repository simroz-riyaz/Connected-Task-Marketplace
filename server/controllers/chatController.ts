import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../db';
import { encrypt, decrypt } from '../utils/encryption';

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { task_id, receiver_id, message } = req.body;
    const sender_id = req.user?.id;
    const file_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // Validate Task and Permissions
        const [tasks] = await pool.query('SELECT client_id, tasker_id, status FROM Tasks WHERE id = ?', [task_id]);
        if ((tasks as any[]).length === 0) return res.status(404).json({ message: 'Task not found' });

        const task = (tasks as any[])[0];

        // Ensure task is assigned (or completed) before allowing chat
        if (task.status !== 'assigned' && task.status !== 'completed') {
            return res.status(403).json({ message: 'Chat is only available for assigned tasks' });
        }

        // Identify roles
        const isClient = sender_id === task.client_id;
        const isTasker = sender_id === task.tasker_id;

        if (!isClient && !isTasker) {
            return res.status(403).json({ message: 'You are not a participant in this task' });
        }

        // Validate receiver
        const validReceiverId = isClient ? task.tasker_id : task.client_id;
        if (parseInt(receiver_id) !== validReceiverId) {
            return res.status(400).json({ message: 'Invalid receiver for this task' });
        }

        // Encrypt message if it exists
        let encryptedMessage = '';
        if (message) {
            const { iv, encryptedData } = encrypt(message);
            encryptedMessage = `${iv}:${encryptedData}`;
        }

        const [result] = await pool.query(
            'INSERT INTO Chats (task_id, sender_id, receiver_id, message, file_url) VALUES (?, ?, ?, ?, ?)',
            [task_id, sender_id, receiver_id, encryptedMessage, file_url]
        );

        res.status(201).json({
            id: (result as any).insertId,
            message: 'Message sent',
            file_url
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

export const getMessagesForTask = async (req: AuthRequest, res: Response) => {
    const { task_id } = req.params;
    const user_id = req.user?.id;

    try {
        // Validate Task and Permissions
        const [tasks] = await pool.query('SELECT client_id, tasker_id FROM Tasks WHERE id = ?', [task_id]);
        if ((tasks as any[]).length === 0) return res.status(404).json({ message: 'Task not found' });

        const task = (tasks as any[])[0];
        if (user_id !== task.client_id && user_id !== task.tasker_id) {
            return res.status(403).json({ message: 'You are not a participant in this task' });
        }

        const [messages] = await pool.query(
            'SELECT * FROM Chats WHERE task_id = ? ORDER BY timestamp ASC',
            [task_id]
        );

        // Decrypt messages
        const decryptedMessages = (messages as any[]).map(msg => {
            try {
                const [iv, encryptedData] = msg.message.split(':');
                return {
                    ...msg,
                    message: decrypt(encryptedData, iv)
                };
            } catch (err) {
                return { ...msg, message: '[Error decrypting message]' };
            }
        });

        res.json(decryptedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
