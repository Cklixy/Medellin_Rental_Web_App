import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../database.sqlite');

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function getDb() {
    if (!dbInstance) {
        dbInstance = await open({
            filename: DB_PATH,
            driver: sqlite3.Database,
        });

        await initializeSchema(dbInstance);
    }
    return dbInstance;
}

async function initializeSchema(db: Database<sqlite3.Database, sqlite3.Statement>) {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      price REAL NOT NULL,
      seats INTEGER NOT NULL,
      doors INTEGER NOT NULL DEFAULT 4,
      transmission TEXT NOT NULL,
      fuel TEXT NOT NULL,
      features TEXT NOT NULL, -- JSON string
      description TEXT,
      year INTEGER NOT NULL,
      available BOOLEAN DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      carId INTEGER NOT NULL,
      userId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      pickupDate TEXT NOT NULL,
      returnDate TEXT NOT NULL,
      pickupLocation TEXT NOT NULL,
      withDriver BOOLEAN DEFAULT 0,
      additionalNotes TEXT,
      totalPrice REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      adminMessage TEXT DEFAULT '',
      tourName TEXT DEFAULT '',
      tourDate TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(carId) REFERENCES cars(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migrations for existing databases
  const migrations = [
    `ALTER TABLE reservations ADD COLUMN tourName TEXT DEFAULT ''`,
    `ALTER TABLE reservations ADD COLUMN adminMessage TEXT DEFAULT ''`,
    `ALTER TABLE reservations ADD COLUMN tourDate TEXT DEFAULT ''`,
    `ALTER TABLE cars ADD COLUMN doors INTEGER NOT NULL DEFAULT 4`,
  ];
  for (const sql of migrations) {
    try { await db.exec(sql); } catch (_) { /* column already exists */ }
  }
}
