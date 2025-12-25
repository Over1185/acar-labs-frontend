import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { ApiResponse } from '@/lib/middleware';

// POST /api/register-customer - Register new customer
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            password,
            phone,
            date_of_birth,
            identification_number,
            gender,
            clinic_id,
            address_id,
        } = body;

        // Validate required fields
        if (!name || !email || !password || !identification_number || !gender || !clinic_id) {
            return ApiResponse.error('Todos los campos requeridos deben ser proporcionados', 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return ApiResponse.error('Formato de email inválido', 400);
        }

        // Validate password strength
        if (password.length < 6) {
            return ApiResponse.error('La contraseña debe tener al menos 6 caracteres', 400);
        }

        const db = getDatabase();

        // Check if email already exists
        const existingEmail = await db.execute({
            sql: 'SELECT id FROM customers WHERE email = ?',
            args: [email],
        });

        if (existingEmail.rows.length > 0) {
            return ApiResponse.error('El email ya está registrado', 409);
        }

        // Check if identification number already exists
        const existingId = await db.execute({
            sql: 'SELECT id FROM customers WHERE identification_number = ?',
            args: [identification_number],
        });

        if (existingId.rows.length > 0) {
            return ApiResponse.error('El número de identificación ya está registrado', 409);
        }

        // Check if clinic exists
        const clinicExists = await db.execute({
            sql: 'SELECT id FROM clinics WHERE id = ?',
            args: [clinic_id],
        });

        if (clinicExists.rows.length === 0) {
            return ApiResponse.error('La clínica especificada no existe', 404);
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Insert customer
        const result = await db.execute({
            sql: `INSERT INTO customers 
            (name, email, password, phone, date_of_birth, identification_number, gender, clinic_id, address_id, verified_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'process')`,
            args: [
                name,
                email,
                hashedPassword,
                phone || null,
                date_of_birth || null,
                identification_number,
                gender,
                clinic_id,
                address_id || null,
            ],
        });

        // Get created customer
        const customer = await db.execute({
            sql: `SELECT id, name, email, phone, date_of_birth, identification_number, gender, verified_email, clinic_id, address_id, created_at
            FROM customers WHERE id = ?`,
            args: [result.lastInsertRowid],
        });

        return ApiResponse.created(
            customer.rows[0],
            'Cliente registrado exitosamente'
        );
    } catch (error) {
        console.error('Register error:', error);
        return ApiResponse.serverError('Error al registrar cliente');
    }
}
