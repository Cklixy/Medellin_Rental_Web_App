import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getDb, initializeSchema } from './db';
import { runSeed } from './seed';
import authRoutes from './routes/auth';
import carsRoutes from './routes/cars';
import reservationRoutes from './routes/reservations';
import usersRoutes from './routes/users';
import quotesRoutes from './routes/quotes';
import chatRoutes from './routes/chat';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) return callback(null, true);
        if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io
export const io = new SocketIOServer(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    },
});

io.on('connection', (socket) => {
    const token = socket.handshake.auth?.token as string | undefined;
    let currentUser: { id: string; role: string } | null = null;

    if (token) {
        try {
            currentUser = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
        } catch {
            socket.disconnect();
            return;
        }
    } else {
        socket.disconnect();
        return;
    }

    // Admin joins a room to receive all conversation events
    if (currentUser.role === 'admin') {
        socket.join('admin_room');
    }

    socket.on('join_conversation', (conversationId: number) => {
        socket.join(`conv_${conversationId}`);
    });

    socket.on('send_message', async (data: { conversationId: number; content: string }) => {
        if (!currentUser) return;
        try {
            const db = await getDb();
            const result = await db.query(
                `INSERT INTO messages (conversation_id, sender_id, sender_role, content)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [data.conversationId, currentUser.id, currentUser.role, data.content]
            );
            const message = result.rows[0];
            // Update conversation updated_at
            await db.query(
                `UPDATE conversations SET updated_at = NOW() WHERE id = $1`,
                [data.conversationId]
            );
            // Emit to everyone in the conversation room AND admin room
            io.to(`conv_${data.conversationId}`).emit('new_message', message);
            io.to('admin_room').emit('new_message', message);
        } catch (err) {
            console.error('Error sending message via socket:', err);
        }
    });
});

// Init DB schema and auto-seed if empty
initializeSchema().then(() => runSeed()).catch(console.error);

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/chat', chatRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
