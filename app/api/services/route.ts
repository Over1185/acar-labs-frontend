import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ApiResponse } from '@/lib/middleware';
import { cache } from '@/lib/cache';

// GET /api/services - Get all services or filter by clinic
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const clinicId = searchParams.get('clinic_id');

        const cacheKey = clinicId ? `services:clinic:${clinicId}` : 'services:all';

        // Check cache first
        const cachedServices = await cache.get<any>(cacheKey);
        if (cachedServices) {
            return ApiResponse.success(cachedServices);
        }

        const db = getDatabase();

        let sql = `SELECT s.*, c.name as clinic_name
               FROM services s
               LEFT JOIN clinics c ON s.clinic_id = c.id
               WHERE s.is_active = 1`;
        const args: any[] = [];

        if (clinicId) {
            sql += ' AND s.clinic_id = ?';
            args.push(parseInt(clinicId));
        }

        sql += ' ORDER BY s.name ASC';

        const result = await db.execute({ sql, args });

        const response = { services: result.rows };

        // Cache for 5 minutes
        await cache.set(cacheKey, response, 300);

        return ApiResponse.success(response);
    } catch (error) {
        console.error('Get services error:', error);
        return ApiResponse.serverError('Error al obtener servicios');
    }
}
