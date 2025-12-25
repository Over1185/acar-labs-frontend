#!/usr/bin/env tsx

/**
 * Database Setup Script
 * 
 * This script initializes the database with the required schema and seed data.
 * 
 * Usage:
 *   pnpm db:setup           # Setup with default options
 *   pnpm db:setup --seed    # Setup and seed with sample data
 *   pnpm db:setup --reset   # Drop all tables and recreate
 */

import { createClient } from '@libsql/client';
import { DATABASE_SCHEMA, SEED_DATA } from '../lib/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const args = process.argv.slice(2);
const shouldSeed = args.includes('--seed');
const shouldReset = args.includes('--reset');

async function setupDatabase() {
    console.log('🚀 Iniciando configuración de la base de datos...\n');

    // Check required environment variables
    if (!process.env.DATABASE_URL) {
        console.error('❌ ERROR: DATABASE_URL no está definida en .env');
        console.error('   Por favor, configura tu base de datos Turso primero.');
        process.exit(1);
    }

    // Create database client
    const db = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    try {
        // Reset database if requested
        if (shouldReset) {
            console.log('⚠️  Eliminando tablas existentes...');
            const dropTables = `
        DROP TABLE IF EXISTS laboratory_results;
        DROP TABLE IF EXISTS appointments;
        DROP TABLE IF EXISTS services;
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS employees;
        DROP TABLE IF EXISTS roles;
        DROP TABLE IF EXISTS clinics;
        DROP TABLE IF EXISTS addresses;
      `;

            await db.executeMultiple(dropTables);
            console.log('✅ Tablas eliminadas\n');
        }

        // Create schema
        console.log('📋 Creando schema de la base de datos...');
        await db.executeMultiple(DATABASE_SCHEMA);
        console.log('✅ Schema creado exitosamente\n');

        // Seed data if requested
        if (shouldSeed) {
            console.log('🌱 Insertando datos de prueba...');
            await db.executeMultiple(SEED_DATA);
            console.log('✅ Datos de prueba insertados\n');
        }

        // Verify setup
        console.log('🔍 Verificando configuración...');
        const tables = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);

        console.log('\n📊 Tablas creadas:');
        tables.rows.forEach((row) => {
            console.log(`   - ${row.name}`);
        });

        // Show counts if seeded
        if (shouldSeed) {
            console.log('\n📈 Datos insertados:');
            const counts = await db.batch([
                { sql: 'SELECT COUNT(*) as count FROM addresses', args: [] },
                { sql: 'SELECT COUNT(*) as count FROM clinics', args: [] },
                { sql: 'SELECT COUNT(*) as count FROM roles', args: [] },
                { sql: 'SELECT COUNT(*) as count FROM employees', args: [] },
            ]);

            console.log(`   - Direcciones: ${counts[0].rows[0].count}`);
            console.log(`   - Clínicas: ${counts[1].rows[0].count}`);
            console.log(`   - Roles: ${counts[2].rows[0].count}`);
            console.log(`   - Empleados: ${counts[3].rows[0].count}`);
        }

        console.log('\n✨ ¡Base de datos configurada exitosamente!\n');

        if (shouldSeed) {
            console.log('🔐 Credenciales de prueba:');
            console.log('   Email: admin@demo.com');
            console.log('   Password: admin123\n');
        }

    } catch (error) {
        console.error('❌ Error al configurar la base de datos:', error);
        process.exit(1);
    }
}

// Run setup
setupDatabase();
