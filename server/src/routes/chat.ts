import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';

const requireAuth = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const requireAdmin = (req: any, res: any, next: any) => {
    requireAuth(req, res, () => {
        if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        next();
    });
};

// GET /api/chat/conversation — get or create conversation for current user
router.get('/conversation', requireAuth, async (req: any, res) => {
    try {
        const db = await getDb();
        let conv = (await db.query(
            `SELECT * FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [req.user.id]
        )).rows[0];

        if (!conv) {
            conv = (await db.query(
                `INSERT INTO conversations (user_id) VALUES ($1) RETURNING *`,
                [req.user.id]
            )).rows[0];
        }

        const messages = (await db.query(
            `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
            [conv.id]
        )).rows;

        res.json({ conversation: conv, messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching conversation' });
    }
});

// GET /api/chat/conversations — admin: get all conversations with last message
router.get('/conversations', requireAdmin, async (_req, res) => {
    try {
        const db = await getDb();
        const rows = (await db.query(`
            SELECT
                c.id,
                c.user_id,
                c.status,
                c.updated_at,
                u.name as user_name,
                u.email as user_email,
                (SELECT content FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
                (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_role = 'user') as user_message_count
            FROM conversations c
            LEFT JOIN users u ON u.id = c.user_id
            ORDER BY c.updated_at DESC
        `)).rows;
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching conversations' });
    }
});

// GET /api/chat/conversations/:id/messages — admin: get messages of a conversation
router.get('/conversations/:id/messages', requireAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const messages = (await db.query(
            `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
            [req.params.id]
        )).rows;
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// PATCH /api/chat/conversations/:id/close — admin: close conversation
router.patch('/conversations/:id/close', requireAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const conv = (await db.query(
            `UPDATE conversations SET status = 'closed' WHERE id = $1 RETURNING *`,
            [req.params.id]
        )).rows[0];
        res.json(conv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error closing conversation' });
    }
});

export default router;
