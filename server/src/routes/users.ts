import { Router } from 'express';
import { getDb } from '../db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'super-secret-key-change-me-in-production';

const requireAdmin = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Get all users (Admin only)
router.get('/', requireAdmin, async (req: any, res) => {
    try {
        const db = await getDb();
        const users = await db.all('SELECT id, name, email, phone, role, createdAt, avatar FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Update user role (Admin only)
router.patch('/:id/role', requireAdmin, async (req: any, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: 'Rol inválido' });
        }
        const db = await getDb();
        await db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        const updated = await db.get(
            'SELECT id, name, email, phone, role, createdAt, avatar FROM users WHERE id = ?',
            [req.params.id]
        );
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar rol' });
    }
});

export default router;
