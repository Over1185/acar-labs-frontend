import { NextRequest } from 'next/server';
import { withAuth, AuthenticatedRequest, ApiResponse } from '@/lib/middleware';
import { getDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { cache } from '@/lib/cache';

// GET /api/customers/[id] - Get customer by ID
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;
            const { id } = await context.params;
            const customerId = parseInt(id);

            if (isNaN(customerId)) {
                return ApiResponse.error('ID de cliente inválido', 400);
            }

            // Check permissions
            if (user.provider === 'customer' && user.userId !== customerId) {
                return ApiResponse.forbidden('No tienes acceso a este perfil');
            }

            const db = getDatabase();
            const result = await db.execute({
                sql: `SELECT c.id, c.name, c.email, c.phone, c.date_of_birth, c.identification_number, 
                     c.gender, c.verified_email, c.clinic_id, c.address_id, c.created_at,
                     cl.name as clinic_name, cl.ruc as clinic_ruc,
                     a.province, a.canton, a.parish, a.street, a.reference, a.city
              FROM customers c
              LEFT JOIN clinics cl ON c.clinic_id = cl.id
              LEFT JOIN addresses a ON c.address_id = a.id
              WHERE c.id = ?`,
                args: [customerId],
            });

            if (result.rows.length === 0) {
                return ApiResponse.notFound('Cliente no encontrado');
            }

            // If employee, check if customer belongs to their clinic
            if (user.provider === 'employee') {
                const customer = result.rows[0] as any;
                if (customer.clinic_id !== user.clinicId) {
                    return ApiResponse.forbidden('No tienes acceso a este cliente');
                }
            }

            return ApiResponse.success(result.rows[0]);
        } catch (error) {
            console.error('Get customer error:', error);
            return ApiResponse.serverError('Error al obtener cliente');
        }
    });
}

// PUT /api/customers/[id] - Update customer
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;
            const { id } = await context.params;
            const customerId = parseInt(id);
            const body = await req.json();

            if (isNaN(customerId)) {
                return ApiResponse.error('ID de cliente inválido', 400);
            }

            // Only customers can update their own profile
            if (user.provider !== 'customer' || user.userId !== customerId) {
                return ApiResponse.forbidden('No tienes permiso para modificar este perfil');
            }

            const db = getDatabase();

            // Build update query
            const updates: string[] = [];
            const args: any[] = [];

            const allowedFields = ['name', 'phone', 'date_of_birth', 'gender'];

            allowedFields.forEach((field) => {
                if (body[field] !== undefined) {
                    updates.push(`${field} = ?`);
                    args.push(body[field]);
                }
            });

            // Handle password change separately
            if (body.password) {
                if (body.password.length < 6) {
                    return ApiResponse.error('La contraseña debe tener al menos 6 caracteres', 400);
                }
                const hashedPassword = await hashPassword(body.password);
                updates.push('password = ?');
                args.push(hashedPassword);
            }

            if (updates.length === 0) {
                return ApiResponse.error('No hay campos para actualizar', 400);
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            args.push(customerId);

            await db.execute({
                sql: `UPDATE customers SET ${updates.join(', ')} WHERE id = ?`,
                args,
            });

            // Get updated customer
            const updated = await db.execute({
                sql: `SELECT id, name, email, phone, date_of_birth, identification_number, 
                     gender, verified_email, clinic_id, address_id, updated_at
              FROM customers WHERE id = ?`,
                args: [customerId],
            });

            // Invalidate cache
            await cache.delete(`user:customer:${customerId}`);

            return ApiResponse.success(updated.rows[0], 'Perfil actualizado exitosamente');
        } catch (error) {
            console.error('Update customer error:', error);
            return ApiResponse.serverError('Error al actualizar cliente');
        }
    });
}
