import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ApiResponse } from '@/lib/middleware';
import { cache } from '@/lib/cache';

// GET /api/addresses/[id] - Get address by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const addressId = parseInt(id);

        if (isNaN(addressId)) {
            return ApiResponse.error('ID de dirección inválido', 400);
        }

        const cacheKey = `address:${addressId}`;

        // Check cache first
        const cachedAddress = await cache.get<any>(cacheKey);
        if (cachedAddress) {
            return ApiResponse.success(cachedAddress);
        }

        const db = getDatabase();
        const result = await db.execute({
            sql: 'SELECT * FROM addresses WHERE id = ?',
            args: [addressId],
        });

        if (result.rows.length === 0) {
            return ApiResponse.notFound('Dirección no encontrada');
        }

        // Cache for 10 minutes
        await cache.set(cacheKey, result.rows[0], 600);

        return ApiResponse.success(result.rows[0]);
    } catch (error) {
        console.error('Get address error:', error);
        return ApiResponse.serverError('Error al obtener dirección');
    }
}
