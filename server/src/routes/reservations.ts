import { Router } from 'express';
import { getDb } from '../db';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';

const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Get reservations (all for admin, only own for user)
router.get('/', requireAuth, async (req: any, res) => {
    try {
        const db = await getDb();
        let reservations;
        if (req.user.role === 'admin') {
            reservations = (await db.query('SELECT * FROM reservations')).rows;
        } else {
            reservations = (await db.query('SELECT * FROM reservations WHERE "userId" = $1', [req.user.id])).rows;
        }
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener reservaciones' });
    }
});

// Create reservation
router.post('/', requireAuth, async (req: any, res) => {
    try {
        const db = await getDb();
        const id = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const userId = req.user.id;
        const {
            carId, customerName, customerEmail, customerPhone,
            pickupDate, returnDate, pickupLocation, withDriver,
            additionalNotes, totalPrice, tourName, tourDate
        } = req.body;

        await db.query(
            `INSERT INTO reservations
        (id, "carId", "userId", "customerName", "customerEmail", "customerPhone", "pickupDate", "returnDate", "pickupLocation", "withDriver", "additionalNotes", "totalPrice", status, "tourName", "tourDate")
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
            [
                id, carId, userId, customerName, customerEmail, customerPhone,
                pickupDate, returnDate, pickupLocation, withDriver ?? false,
                additionalNotes || '', totalPrice, 'pending', tourName || '', tourDate || ''
            ]
        );

        const newReservation = (await db.query('SELECT * FROM reservations WHERE id = $1', [id])).rows[0];
        res.status(201).json(newReservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la reservación' });
    }
});

// Update status (Admin only)
router.patch('/:id/status', requireAuth, async (req: any, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const { status, adminMessage } = req.body;
        const db = await getDb();
        await db.query(
            'UPDATE reservations SET status = $1, "adminMessage" = $2 WHERE id = $3',
            [status, adminMessage ?? '', req.params.id]
        );
        const updated = (await db.query('SELECT * FROM reservations WHERE id = $1', [req.params.id])).rows[0];
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

export default router;
