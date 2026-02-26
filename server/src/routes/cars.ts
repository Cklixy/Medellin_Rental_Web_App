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
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const formatCar = (car: any) => ({
    ...car,
    features: typeof car.features === 'string' ? JSON.parse(car.features) : car.features,
});

// Get all cars
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const cars = (await db.query('SELECT * FROM cars')).rows;
        res.json(cars.map(formatCar));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener vehiculos' });
    }
});

// Add car (Admin)
router.post('/', requireAdmin, async (req: any, res) => {
    try {
        const db = await getDb();
        const { name, category, image, price, seats, doors, transmission, fuel, features, description, year, available } = req.body;
        const result = await db.query(
            `INSERT INTO cars (name, category, image, price, seats, doors, transmission, fuel, features, description, year, available)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
            [name, category, image ?? '', price, seats, doors ?? 4, transmission, fuel ?? 'Gasolina',
             JSON.stringify(features ?? []), description ?? '', year ?? new Date().getFullYear(), available !== false]
        );
        const newCar = (await db.query('SELECT * FROM cars WHERE id = $1', [result.rows[0].id])).rows[0];
        res.status(201).json(formatCar(newCar));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar vehiculo' });
    }
});

// Delete car (Admin)
router.delete('/:id', requireAdmin, async (req: any, res) => {
    try {
        const db = await getDb();
        await db.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar vehiculo' });
    }
});

// Update car (Admin)
router.patch('/:id', requireAdmin, async (req: any, res) => {
    try {
        const db = await getDb();
        const { name, category, image, price, seats, doors, transmission, fuel, features, description, year, available } = req.body;
        await db.query(
            `UPDATE cars SET
              name = COALESCE($1, name),
              category = COALESCE($2, category),
              image = COALESCE($3, image),
              price = COALESCE($4, price),
              seats = COALESCE($5, seats),
              doors = COALESCE($6, doors),
              transmission = COALESCE($7, transmission),
              fuel = COALESCE($8, fuel),
              features = COALESCE($9, features),
              description = COALESCE($10, description),
              year = COALESCE($11, year),
              available = COALESCE($12, available)
            WHERE id = $13`,
            [
                name ?? null, category ?? null, image ?? null, price ?? null,
                seats ?? null, doors ?? null, transmission ?? null, fuel ?? null,
                features ? JSON.stringify(features) : null,
                description ?? null, year ?? null,
                available !== undefined ? available : null,
                req.params.id
            ]
        );
        const updated = (await db.query('SELECT * FROM cars WHERE id = $1', [req.params.id])).rows[0];
        res.json(formatCar(updated));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar vehiculo' });
    }
});

export default router;
