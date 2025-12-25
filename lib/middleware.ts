import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
    user?: JWTPayload;
}

// Middleware to verify JWT token
export async function withAuth(
    request: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    try {
        const authHeader = request.headers.get('Authorization');
        const token = extractToken(authHeader);

        if (!token) {
            return NextResponse.json(
                { message: 'No se proporcionó token de autenticación' },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { message: 'Token inválido o expirado' },
                { status: 401 }
            );
        }

        // Attach user to request
        (request as AuthenticatedRequest).user = payload;

        return handler(request as AuthenticatedRequest);
    } catch (error) {
        console.error('Auth middleware error:', error);
        return NextResponse.json(
            { message: 'Error de autenticación' },
            { status: 500 }
        );
    }
}

// Middleware to check if user is customer
export async function withCustomerAuth(
    request: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        if (req.user?.provider !== 'customer') {
            return NextResponse.json(
                { message: 'Acceso denegado. Solo clientes' },
                { status: 403 }
            );
        }
        return handler(req);
    });
}

// Middleware to check if user is employee
export async function withEmployeeAuth(
    request: NextRequest,
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        if (req.user?.provider !== 'employee') {
            return NextResponse.json(
                { message: 'Acceso denegado. Solo empleados' },
                { status: 403 }
            );
        }
        return handler(req);
    });
}

// API Response helpers
export class ApiResponse {
    static success<T>(data: T, message?: string, status = 200) {
        return NextResponse.json({ data, message, status }, { status });
    }

    static error(message: string, status = 400) {
        return NextResponse.json({ message, status }, { status });
    }

    static created<T>(data: T, message = 'Creado exitosamente') {
        return NextResponse.json({ data, message, status: 201 }, { status: 201 });
    }

    static noContent() {
        return new NextResponse(null, { status: 204 });
    }

    static notFound(message = 'Recurso no encontrado') {
        return NextResponse.json({ message, status: 404 }, { status: 404 });
    }

    static unauthorized(message = 'No autorizado') {
        return NextResponse.json({ message, status: 401 }, { status: 401 });
    }

    static forbidden(message = 'Acceso prohibido') {
        return NextResponse.json({ message, status: 403 }, { status: 403 });
    }

    static serverError(message = 'Error interno del servidor') {
        return NextResponse.json({ message, status: 500 }, { status: 500 });
    }
}
