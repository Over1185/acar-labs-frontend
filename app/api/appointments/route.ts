import { NextRequest } from 'next/server';
import { withAuth, AuthenticatedRequest, ApiResponse } from '@/lib/middleware';
import { getDatabase } from '@/lib/db';
import { cache } from '@/lib/cache';

// GET /api/appointments - Get all appointments (filtered by user)
export async function GET(request: NextRequest) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;
            const db = getDatabase();

            let sql = `SELECT a.*,
                        c.name as clinic_name,
                        cust.name as customer_name, cust.email as customer_email,
                        e.name as employee_name, e.email as employee_email,
                        s.name as service_name, s.price as service_price
                 FROM appointments a
                 LEFT JOIN clinics c ON a.clinic_id = c.id
                 LEFT JOIN customers cust ON a.customer_id = cust.id
                 LEFT JOIN employees e ON a.employee_id = e.id
                 LEFT JOIN services s ON a.service_id = s.id`;

            const args: any[] = [];

            // Filter by user type
            if (user.provider === 'customer') {
                sql += ' WHERE a.customer_id = ?';
                args.push(user.userId);
            } else {
                // Employee can see appointments from their clinic
                sql += ' WHERE a.clinic_id = ?';
                args.push(user.clinicId);
            }

            sql += ' ORDER BY a.scheduled_date DESC';

            const result = await db.execute({ sql, args });

            return ApiResponse.success(result.rows);
        } catch (error) {
            console.error('Get appointments error:', error);
            return ApiResponse.serverError('Error al obtener citas');
        }
    });
}

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;
            const body = await req.json();
            const { scheduled_date, clinic_id, employee_id, service_id, notes } = body;

            // Only customers can create appointments
            if (user.provider !== 'customer') {
                return ApiResponse.forbidden('Solo los clientes pueden crear citas');
            }

            // Validate required fields
            if (!scheduled_date || !clinic_id || !employee_id || !service_id) {
                return ApiResponse.error('Todos los campos requeridos deben ser proporcionados', 400);
            }

            const db = getDatabase();

            // Verify service exists and belongs to clinic
            const serviceCheck = await db.execute({
                sql: 'SELECT id FROM services WHERE id = ? AND clinic_id = ? AND is_active = 1',
                args: [service_id, clinic_id],
            });

            if (serviceCheck.rows.length === 0) {
                return ApiResponse.error('Servicio no válido o inactivo', 400);
            }

            // Verify employee exists and belongs to clinic
            const employeeCheck = await db.execute({
                sql: 'SELECT id FROM employees WHERE id = ? AND clinic_id = ?',
                args: [employee_id, clinic_id],
            });

            if (employeeCheck.rows.length === 0) {
                return ApiResponse.error('Empleado no válido', 400);
            }

            // Check for conflicting appointments
            const conflictCheck = await db.execute({
                sql: `SELECT id FROM appointments 
              WHERE employee_id = ? 
              AND scheduled_date = ? 
              AND status NOT IN ('canceled', 'completed')`,
                args: [employee_id, scheduled_date],
            });

            if (conflictCheck.rows.length > 0) {
                return ApiResponse.error('El horario seleccionado no está disponible', 409);
            }

            // Create appointment
            const result = await db.execute({
                sql: `INSERT INTO appointments 
              (scheduled_date, status, notes, clinic_id, customer_id, employee_id, service_id)
              VALUES (?, 'pending', ?, ?, ?, ?, ?)`,
                args: [scheduled_date, notes || null, clinic_id, user.userId, employee_id, service_id],
            });

            // Get created appointment
            const appointment = await db.execute({
                sql: `SELECT a.*,
                     c.name as clinic_name,
                     s.name as service_name, s.price as service_price
              FROM appointments a
              LEFT JOIN clinics c ON a.clinic_id = c.id
              LEFT JOIN services s ON a.service_id = s.id
              WHERE a.id = ?`,
                args: [result.lastInsertRowid],
            });

            // Invalidate cache
            await cache.deletePattern('appointments:*');

            return ApiResponse.created(
                appointment.rows[0],
                'Cita creada exitosamente'
            );
        } catch (error) {
            console.error('Create appointment error:', error);
            return ApiResponse.serverError('Error al crear cita');
        }
    });
}
