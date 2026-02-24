import express from 'express';
import cors from 'cors';
import { getDb } from './db';
import authRoutes from './routes/auth';
import carsRoutes from './routes/cars';
import reservationRoutes from './routes/reservations';
import usersRoutes from './routes/users';
import quotesRoutes from './routes/quotes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Init DB
getDb().catch(console.error);

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/quotes', quotesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
