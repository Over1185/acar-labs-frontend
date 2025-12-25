import { NextRequest } from 'next/server';
import { withAuth, AuthenticatedRequest, ApiResponse } from '@/lib/middleware';
import { getDatabase } from '@/lib/db';
import { cache } from '@/lib/cache';

// GET /api/appointments/[id] - Get appointment by ID
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;
            const { id } = await context.params;
            const appointmentId = parseInt(id);

            if (isNaN(appointmentId)) {
                return ApiResponse.error('ID de cita inválido', 400);
            }

            const db = getDatabase();
            const result = await db.execute({
                sql: `SELECT a.*,
                     c.name as clinic_name,
                     cust.name as customer_name, cust.email as customer_email, cust.phone as customer_phone,
                     e.name as employee_name, e.email as employee_email,
                     s.name as service_name, s.price as service_price, s.estimated_time
              FROM appointments a
              LEFT JOIN clinics c ON a.clinic_id = c.id
              LEFT JOIN customers cust ON a.customer_id = cust.id
              LEFT JOIN employees e ON a.employee_id = e.id
              LEFT JOIN services s ON a.service_id = s.id
              WHERE a.id = ?`,
                args: [appointmentId],
            });

            if (result.rows.length === 0) {
                return ApiResponse.notFound('Cita no encontrada');
            }

            const appointment = result.rows[0] as any;

            // Check access permissions
            if (user.provider === 'customer' && appointment.customer_id !== user.userId) {
                return ApiResponse.forbidden('No tienes acceso a esta cita');
            }

            if (user.provider === 'employee' && appointment.clinic_id !== user.clinicId) {
                return ApiResponse.forbidden('No tienes acceso a esta cita');
            }

            return ApiResponse.success(appointment);
        } catch (error) {
            console.error('Get appointment error:', error);
            return ApiResponse.serverError('Error al obtener cita');
        }
    });
}

// PUT /api/appointments/[id] - Update appointment
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;
            const { id } = await context.params;
            const appointmentId = parseInt(id);
            const body = await req.json();

            if (isNaN(appointmentId)) {
                return ApiResponse.error('ID de cita inválido', 400);
            }

            const db = getDatabase();

            // Get existing appointment
            const existing = await db.execute({
                sql: 'SELECT * FROM appointments WHERE id = ?',
                args: [appointmentId],
            });

            if (existing.rows.length === 0) {
                return ApiResponse.notFound('Cita no encontrada');
            }

            const appointment = existing.rows[0] as any;

            // Check permissions
            if (user.provider === 'customer' && appointment.customer_id !== user.userId) {
                return ApiResponse.forbidden('No tienes permiso para modificar esta cita');
            }

            if (user.provider === 'employee' && appointment.clinic_id !== user.clinicId) {
                return ApiResponse.forbidden('No tienes permiso para modificar esta cita');
            }

            // Build update query
            const updates: string[] = [];
            const args: any[] = [];

            // Customers can only update scheduled_date and notes if status is pending
            if (user.provider === 'customer') {
                if (appointment.status !== 'pending') {
                    return ApiResponse.error('Solo puedes modificar citas en estado pendiente', 400);
                }

                if (body.scheduled_date) {
                    updates.push('scheduled_date = ?');
                    args.push(body.scheduled_date);
                }

                if (body.notes !== undefined) {
                    updates.push('notes = ?');
                    args.push(body.notes);
                }
            } else {
                // Employees can update status and notes
                if (body.status && ['pending', 'process', 'completed', 'canceled'].includes(body.status)) {
                    updates.push('status = ?');
                    args.push(body.status);
                }

                if (body.notes !== undefined) {
                    updates.push('notes = ?');
                    args.push(body.notes);
                }

                if (body.scheduled_date) {
                    updates.push('scheduled_date = ?');
                    args.push(body.scheduled_date);
                }
            }

            if (updates.length === 0) {
                return ApiResponse.error('No hay campos para actualizar', 400);
            }

            updates.push('updated_at = CURRENT_TIMESTAMP');
            args.push(appointmentId);

            await db.execute({
                sql: `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`,
                args,
            });

            // Get updated appointment
            const updated = await db.execute({
                sql: `SELECT a.*,
                     c.name as clinic_name,
                     s.name as service_name, s.price as service_price
              FROM appointments a
              LEFT JOIN clinics c ON a.clinic_id = c.id
              LEFT JOIN services s ON a.service_id = s.id
              WHERE a.id = ?`,
                args: [appointmentId],
            });

            // Invalidate cache
            await cache.deletePattern('appointments:*');

            return ApiResponse.success(updated.rows[0], 'Cita actualizada exitosamente');
        } catch (error) {
            console.error('Update appointment error:', error);
            return ApiResponse.serverError('Error al actualizar cita');
        }
    });
}
