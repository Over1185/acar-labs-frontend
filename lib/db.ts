import { createClient } from '@libsql/client';

// Singleton pattern for database client
let db: ReturnType<typeof createClient> | null = null;

export function getDatabase() {
    if (!db) {
        const url = process.env.DATABASE_URL;
        const authToken = process.env.DATABASE_AUTH_TOKEN;

        if (!url) {
            throw new Error('DATABASE_URL environment variable is required');
        }

        db = createClient({
            url,
            authToken,
        });
    }

    return db;
}

export type Database = ReturnType<typeof getDatabase>;
