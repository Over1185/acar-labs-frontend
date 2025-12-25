import { NextRequest } from 'next/server';
import { withAuth, AuthenticatedRequest, ApiResponse } from '@/lib/middleware';
import { cache } from '@/lib/cache';

// POST /api/logout - Logout user
export async function POST(request: NextRequest) {
    return withAuth(request, async (req: AuthenticatedRequest) => {
        try {
            const user = req.user!;

            // Remove cached user data
            await cache.delete(`user:${user.provider}:${user.userId}`);

            return ApiResponse.success({ message: 'Sesión cerrada exitosamente' });
        } catch (error) {
            console.error('Logout error:', error);
            return ApiResponse.serverError('Error al cerrar sesión');
        }
    });
}
