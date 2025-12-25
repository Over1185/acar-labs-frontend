import { NextRequest } from 'next/server';
import { withEmployeeAuth, AuthenticatedRequest, ApiResponse } from '@/lib/middleware';
import { getDatabase } from '@/lib/db';

// GET /api/customers - Get all customers (employee only)
export async function GET(request: NextRequest) {
    return withEmployeeAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;
            const db = getDatabase();

            // Get customers from the same clinic
            const result = await db.execute({
                sql: `SELECT c.id, c.name, c.email, c.phone, c.date_of_birth, c.identification_number, 
                     c.gender, c.verified_email, c.created_at,
                     cl.name as clinic_name
              FROM customers c
              LEFT JOIN clinics cl ON c.clinic_id = cl.id
              WHERE c.clinic_id = ?
              ORDER BY c.created_at DESC`,
                args: [user.clinicId],
            });

            return ApiResponse.success(result.rows);
        } catch (error) {
            console.error('Get customers error:', error);
            return ApiResponse.serverError('Error al obtener clientes');
        }
    });
}
