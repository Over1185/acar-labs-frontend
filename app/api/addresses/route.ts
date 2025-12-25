import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ApiResponse } from '@/lib/middleware';
import { cache } from '@/lib/cache';

// GET /api/addresses - Get all addresses
export async function GET() {
    try {
        const cacheKey = 'addresses:all';

        // Check cache first
        const cachedAddresses = await cache.get<any>(cacheKey);
        if (cachedAddresses) {
            return ApiResponse.success(cachedAddresses);
        }

        const db = getDatabase();
        const result = await db.execute({
            sql: 'SELECT * FROM addresses ORDER BY province, city, canton ASC',
            args: [],
        });

        // Cache for 10 minutes
        await cache.set(cacheKey, result.rows, 600);

        return ApiResponse.success(result.rows);
    } catch (error) {
        console.error('Get addresses error:', error);
        return ApiResponse.serverError('Error al obtener direcciones');
    }
}
