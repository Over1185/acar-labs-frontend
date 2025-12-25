import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ApiResponse } from '@/lib/middleware';
import { cache } from '@/lib/cache';

// GET /api/clinics/[id] - Get clinic by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const clinicId = parseInt(id);

        if (isNaN(clinicId)) {
            return ApiResponse.error('ID de clínica inválido', 400);
        }

        const cacheKey = `clinic:${clinicId}`;

        // Check cache first
        const cachedClinic = await cache.get<any>(cacheKey);
        if (cachedClinic) {
            return ApiResponse.success(cachedClinic);
        }

        const db = getDatabase();
        const result = await db.execute({
            sql: `SELECT c.*, 
                   a.province, a.canton, a.parish, a.street, a.reference, a.country, a.city
            FROM clinics c
            LEFT JOIN addresses a ON c.address_id = a.id
            WHERE c.id = ?`,
            args: [clinicId],
        });

        if (result.rows.length === 0) {
            return ApiResponse.notFound('Clínica no encontrada');
        }

        // Cache for 5 minutes
        await cache.set(cacheKey, result.rows[0], 300);

        return ApiResponse.success(result.rows[0]);
    } catch (error) {
        console.error('Get clinic error:', error);
        return ApiResponse.serverError('Error al obtener clínica');
    }
}
