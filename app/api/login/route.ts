import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { generateToken, hashPassword, comparePassword } from '@/lib/auth';
import { ApiResponse } from '@/lib/middleware';
import { cache } from '@/lib/cache';

// POST /api/login - Login for customers and employees
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return ApiResponse.error('Email y contraseña son requeridos', 400);
        }

        const db = getDatabase();

        // Try to find customer first
        const customerResult = await db.execute({
            sql: 'SELECT * FROM customers WHERE email = ?',
            args: [email],
        });

        if (customerResult.rows.length > 0) {
            const customer = customerResult.rows[0] as any;
            const isValid = await comparePassword(password, customer.password);

            if (!isValid) {
                return ApiResponse.error('Credenciales inválidas', 401);
            }

            const token = await generateToken({
                userId: customer.id,
                email: customer.email,
                provider: 'customer',
                clinicId: customer.clinic_id,
            });

            // Cache user data
            await cache.set(`user:customer:${customer.id}`, {
                id: customer.id,
                name: customer.name,
                email: customer.email,
            }, 3600); // 1 hour

            return ApiResponse.success({
                access_token: token,
                token_type: 'Bearer',
                provider: 'customer',
                user: {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                },
            });
        }

        // Try to find employee
        const employeeResult = await db.execute({
            sql: `SELECT e.*, r.name as role_name 
            FROM employees e 
            JOIN roles r ON e.role_id = r.id 
            WHERE e.email = ?`,
            args: [email],
        });

        if (employeeResult.rows.length > 0) {
            const employee = employeeResult.rows[0] as any;
            const isValid = await comparePassword(password, employee.password);

            if (!isValid) {
                return ApiResponse.error('Credenciales inválidas', 401);
            }

            const token = await generateToken({
                userId: employee.id,
                email: employee.email,
                provider: 'employee',
                clinicId: employee.clinic_id,
            });

            // Cache user data
            await cache.set(`user:employee:${employee.id}`, {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: employee.role_name,
            }, 3600); // 1 hour

            return ApiResponse.success({
                access_token: token,
                token_type: 'Bearer',
                provider: 'employee',
                user: {
                    id: employee.id,
                    name: employee.name,
                    email: employee.email,
                    phone: employee.phone,
                    role: employee.role_name,
                },
            });
        }

        return ApiResponse.error('Credenciales inválidas', 401);
    } catch (error) {
        console.error('Login error:', error);
        return ApiResponse.serverError('Error al iniciar sesión');
    }
}
