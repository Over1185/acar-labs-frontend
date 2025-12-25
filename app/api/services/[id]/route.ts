import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ApiResponse } from '@/lib/middleware';
import { cache } from '@/lib/cache';

// GET /api/services/[id] - Get service by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const serviceId = parseInt(id);

        if (isNaN(serviceId)) {
            return ApiResponse.error('ID de servicio inválido', 400);
        }

        const cacheKey = `service:${serviceId}`;

        // Check cache first
        const cachedService = await cache.get<any>(cacheKey);
        if (cachedService) {
            return ApiResponse.success(cachedService);
        }

        const db = getDatabase();
        const result = await db.execute({
            sql: `SELECT s.*, c.name as clinic_name, c.ruc as clinic_ruc
            FROM services s
            LEFT JOIN clinics c ON s.clinic_id = c.id
            WHERE s.id = ?`,
            args: [serviceId],
        });

        if (result.rows.length === 0) {
            return ApiResponse.notFound('Servicio no encontrado');
        }

        // Cache for 5 minutes
        await cache.set(cacheKey, result.rows[0], 300);

        return ApiResponse.success(result.rows[0]);
    } catch (error) {
        console.error('Get service error:', error);
        return ApiResponse.serverError('Error al obtener servicio');
    }
}
