import { Router } from 'express';
import { getDb } from '../db';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'super-secret-key-change-me-in-production';

// Auth middleware
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
            reservations = await db.all('SELECT * FROM reservations');
        } else {
            reservations = await db.all('SELECT * FROM reservations WHERE userId = ?', [req.user.id]);
        }

        // Format boolean
        const formatted = reservations.map(r => ({ ...r, withDriver: r.withDriver === 1 }));
        res.json(formatted);
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

        await db.run(
            `INSERT INTO reservations 
        (id, carId, userId, customerName, customerEmail, customerPhone, pickupDate, returnDate, pickupLocation, withDriver, additionalNotes, totalPrice, status, tourName, tourDate)
       VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, carId, userId, customerName, customerEmail, customerPhone,
                pickupDate, returnDate, pickupLocation, withDriver ? 1 : 0,
                additionalNotes || '', totalPrice, 'pending', tourName || '', tourDate || ''
            ]
        );

        const newReservation = await db.get('SELECT * FROM reservations WHERE id = ?', [id]);
        res.status(201).json({ ...newReservation, withDriver: newReservation.withDriver === 1 });
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

        await db.run(
            'UPDATE reservations SET status = ?, adminMessage = ? WHERE id = ?',
            [status, adminMessage ?? '', req.params.id]
        );
        const updated = await db.get('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
        res.json({ ...updated, withDriver: updated.withDriver === 1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

export default router;
