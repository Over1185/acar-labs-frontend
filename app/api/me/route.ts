import { NextRequest } from 'next/server';
import { withAuth, AuthenticatedRequest, ApiResponse } from '@/lib/middleware';
import { getDatabase } from '@/lib/db';
import { cache } from '@/lib/cache';

// GET /api/me - Get current user profile
export async function GET(request: NextRequest) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;
            const db = getDatabase();

            // Check cache first
            const cacheKey = `user:${user.provider}:${user.userId}`;
            const cachedUser = await cache.get<any>(cacheKey);

            if (cachedUser) {
                return ApiResponse.success(cachedUser);
            }

            // Fetch from database
            if (user.provider === 'customer') {
                const result = await db.execute({
                    sql: `SELECT c.id, c.name, c.email, c.phone, c.date_of_birth, c.identification_number, 
                       c.gender, c.verified_email, c.clinic_id, c.address_id,
                       cl.name as clinic_name, cl.ruc as clinic_ruc,
                       a.province, a.canton, a.parish, a.street, a.city
                FROM customers c
                LEFT JOIN clinics cl ON c.clinic_id = cl.id
                LEFT JOIN addresses a ON c.address_id = a.id
                WHERE c.id = ?`,
                    args: [user.userId],
                });

                if (result.rows.length === 0) {
                    return ApiResponse.notFound('Usuario no encontrado');
                }

                const userData = result.rows[0];
                await cache.set(cacheKey, userData, 3600);

                return ApiResponse.success(userData);
            } else {
                // Employee
                const result = await db.execute({
                    sql: `SELECT e.id, e.name, e.email, e.phone, e.gender, e.verified_email, e.clinic_id, e.role_id,
                       r.name as role_name, r.description as role_description,
                       cl.name as clinic_name, cl.ruc as clinic_ruc
                FROM employees e
                LEFT JOIN roles r ON e.role_id = r.id
                LEFT JOIN clinics cl ON e.clinic_id = cl.id
                WHERE e.id = ?`,
                    args: [user.userId],
                });

                if (result.rows.length === 0) {
                    return ApiResponse.notFound('Usuario no encontrado');
                }

                const userData = result.rows[0];
                await cache.set(cacheKey, userData, 3600);

                return ApiResponse.success(userData);
            }
        } catch (error) {
            console.error('Get profile error:', error);
            return ApiResponse.serverError('Error al obtener perfil');
        }
    });
}
