import { Pool } from 'pg';

// Remove channel_binding param — not supported by node-postgres driver
const rawConn = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || '';
const connString = rawConn.replace(/[?&]channel_binding=[^&]*/g, '').replace(/\?&/, '?');

const pool = new Pool({
    connectionString: connString,
    ssl: connString.includes('sslmode=require') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
});

export async function getDb() {
    return pool;
}

export async function initializeSchema() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                role TEXT DEFAULT 'user',
                "createdAt" TIMESTAMP DEFAULT NOW(),
                avatar TEXT
            );

            CREATE TABLE IF NOT EXISTS cars (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                image TEXT NOT NULL,
                price REAL NOT NULL,
                seats INTEGER NOT NULL,
                doors INTEGER NOT NULL DEFAULT 4,
                transmission TEXT NOT NULL,
                fuel TEXT NOT NULL,
                features TEXT NOT NULL,
                description TEXT,
                year INTEGER NOT NULL,
                available BOOLEAN DEFAULT true
            );

            CREATE TABLE IF NOT EXISTS reservations (
                id TEXT PRIMARY KEY,
                "carId" INTEGER NOT NULL,
                "userId" TEXT NOT NULL,
                "customerName" TEXT NOT NULL,
                "customerEmail" TEXT NOT NULL,
                "customerPhone" TEXT NOT NULL,
                "pickupDate" TEXT NOT NULL,
                "returnDate" TEXT NOT NULL,
                "pickupLocation" TEXT NOT NULL,
                "withDriver" BOOLEAN DEFAULT false,
                "additionalNotes" TEXT DEFAULT '',
                "totalPrice" REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                "adminMessage" TEXT DEFAULT '',
                "tourName" TEXT DEFAULT '',
                "tourDate" TEXT DEFAULT '',
                "createdAt" TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS quotes (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'new',
                "createdAt" TIMESTAMP DEFAULT NOW()
            );
        `);
    } finally {
        client.release();
    }
}

