import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';
import crypto from 'crypto';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await getDb();

        const user = (await db.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const db = await getDb();

        const existing = (await db.query('SELECT id FROM users WHERE email = $1', [email])).rows[0];
        if (existing) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = crypto.randomUUID();

        await db.query(
            'INSERT INTO users (id, name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, name, email, hashedPassword, phone, 'user']
        );

        const newUser = (await db.query('SELECT * FROM users WHERE id = $1', [id])).rows[0];
        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

export default router;
