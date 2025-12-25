import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { ApiResponse } from '@/lib/middleware';
import { cache } from '@/lib/cache';

// GET /api/clinics - Get all clinics
export async function GET() {
    try {
        const cacheKey = 'clinics:all';

        // Check cache first
        const cachedClinics = await cache.get<any>(cacheKey);
        if (cachedClinics) {
            return ApiResponse.success(cachedClinics);
        }

        const db = getDatabase();
        const result = await db.execute({
            sql: `SELECT c.*, 
                   a.province, a.canton, a.parish, a.street, a.reference, a.country, a.city
            FROM clinics c
            LEFT JOIN addresses a ON c.address_id = a.id
            ORDER BY c.name ASC`,
            args: [],
        });

        // Format response with nested address object
        const clinics = result.rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            ruc: row.ruc,
            address_id: row.address_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
            address: row.province ? {
                province: row.province,
                canton: row.canton,
                parish: row.parish,
                street: row.street,
                reference: row.reference,
                country: row.country,
                city: row.city,
            } : undefined,
        }));

        const response = { clinics };

        // Cache for 5 minutes
        await cache.set(cacheKey, response, 300);

        return ApiResponse.success(response);
    } catch (error) {
        console.error('Get clinics error:', error);
        return ApiResponse.serverError('Error al obtener clínicas');
    }
}
