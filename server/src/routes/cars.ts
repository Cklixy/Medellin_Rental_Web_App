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

// Get all cars
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const cars = await db.all('SELECT * FROM cars');
        const formattedCars = cars.map((car: any) => ({
            ...car,
            features: JSON.parse(car.features),
            available: car.available === 1
        }));
        res.json(formattedCars);
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
        const result = await db.run(
            `INSERT INTO cars (name, category, image, price, seats, doors, transmission, fuel, features, description, year, available)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, image ?? '', price, seats, doors ?? 4, transmission, fuel ?? 'Gasolina',
             JSON.stringify(features ?? []), description ?? '', year ?? new Date().getFullYear(), available !== false ? 1 : 0]
        );
        const newCar = await db.get('SELECT * FROM cars WHERE id = ?', [result.lastID]);
        res.status(201).json({ ...newCar, features: JSON.parse(newCar.features), available: newCar.available === 1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar vehiculo' });
    }
});

// Delete car (Admin)
router.delete('/:id', requireAdmin, async (req: any, res) => {
    try {
        const db = await getDb();
        await db.run('DELETE FROM cars WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar vehiculo' });
    }
});

export default router;
