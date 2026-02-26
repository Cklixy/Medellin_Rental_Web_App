/**
 * Script para exportar los datos de SQLite a JSON
 * Uso: npx ts-node src/export-db.ts
 */
import { getDb } from './db';
import fs from 'fs';
import path from 'path';

async function exportDatabase() {
    const db = await getDb();

    console.log('Exportando base de datos SQLite...');

    const users = await db.all('SELECT * FROM users');
    const cars = await db.all('SELECT * FROM cars');
    const reservations = await db.all('SELECT * FROM reservations');
    const quotes = await db.all('SELECT * FROM quotes').catch(() => []);

    const exportData = {
        exportedAt: new Date().toISOString(),
        tables: { users, cars, reservations, quotes },
    };

    const outputPath = path.resolve(__dirname, '../../db-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

    console.log(`✅ Datos exportados a: db-export.json`);
    console.log(`   - users: ${users.length} registros`);
    console.log(`   - cars: ${cars.length} registros`);
    console.log(`   - reservations: ${reservations.length} registros`);
    console.log(`   - quotes: ${quotes.length} registros`);

    process.exit(0);
}

exportDatabase().catch(console.error);
