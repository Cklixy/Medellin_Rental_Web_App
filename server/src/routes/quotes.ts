import { Router } from 'express';
import { getDb } from '../db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';

const requireAdmin = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Public — submit a quote
router.post('/', async (req, res) => {
    try {
        const db = await getDb();
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const result = await db.query(
            `INSERT INTO quotes (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING id`,
            [name, email, phone, message]
        );
        const quote = (await db.query('SELECT * FROM quotes WHERE id = $1', [result.rows[0].id])).rows[0];
        res.status(201).json(quote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la cotización' });
    }
});

// Admin — list all quotes
router.get('/', requireAdmin, async (_req, res) => {
    try {
        const db = await getDb();
        const quotes = (await db.query('SELECT * FROM quotes ORDER BY "createdAt" DESC')).rows;
        res.json(quotes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener cotizaciones' });
    }
});

// Admin — update status
router.patch('/:id/status', requireAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const { status } = req.body;
        if (!['new', 'attended'].includes(status)) {
            return res.status(400).json({ error: 'Estado inválido' });
        }
        await db.query('UPDATE quotes SET status = $1 WHERE id = $2', [status, req.params.id]);
        const quote = (await db.query('SELECT * FROM quotes WHERE id = $1', [req.params.id])).rows[0];
        res.json(quote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar cotización' });
    }
});

// Admin — delete
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const db = await getDb();
        await db.query('DELETE FROM quotes WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar cotización' });
    }
});

export default router;
