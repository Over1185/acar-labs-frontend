/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    employees?: Array<{
        id: number;
        user_id: number;
        clinic_id: number;
        role_id: number;
        status: string;
        clinic: {
            id: number;
            name: string;
            ruc: string;
            status: string; // Estado real de la clínica en BDD
            [key: string]: any;
        };
        role: {
            id: number;
            name: string;
            [key: string]: any;
        };
        [key: string]: any;
    }>;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Variable de entorno dinámica
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Uso de la URL del .env
                const response = await fetch(`${apiUrl}/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('auth_token');
                        router.push('/login');
                    }
                    throw new Error('Error al cargar el perfil');
                }

                const data = await response.json();
                setUser(data.data || data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router, apiUrl]);

    // Función para validar si el estado es activo (soporta "active", "1", true)
    const isClinicActive = (status: any) => {
        const s = String(status).toLowerCase();
        return s === 'active' || s === 'activo' || s === '1' || s === 'true';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center pt-20">
                <div className="w-16 h-16 border-4 border-[#003366]/20 border-t-[#003366] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 pt-24 text-center">
                <p className="text-red-600 mb-4">{error || 'No se encontró el perfil'}</p>
                <Link href="/" className="px-6 py-2 bg-red-600 text-white rounded-full">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 pt-24 pb-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 mb-8 text-[#003366] hover:underline">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver
                </Link>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-[#003366] to-[#00509e]"></div>

                    <div className="px-6 sm:px-8 pb-8">
                        {/* Avatar and Name */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-8">
                            <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-[#003366] to-[#00509e] flex items-center justify-center text-5xl font-bold text-white border-4 border-white shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Información Personal */}
                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm text-gray-600">Correo: <span className="text-gray-900 font-medium">{user.email}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Estado Usuario:
                                            <span className={user.is_active ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                                                {user.is_active ? "Activo" : "Inactivo"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección Clínicas con Lógica de Bloqueo */}
                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Clínicas Asociadas</h2>
                                {user.employees && user.employees.length > 0 ? (
                                    <div className="space-y-3">
                                        {user.employees.map((employee) => {
                                            const isActive = isClinicActive(employee.clinic.status);

                                            return (
                                                <div
                                                    key={employee.id}
                                                    // Bloqueo de clic si no está activa
                                                    onClick={() => isActive && window.open(`/clinic/${employee.clinic.id}`, '_blank')}
                                                    className={`block p-4 border rounded-lg transition-all ${isActive
                                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg hover:border-blue-400 cursor-pointer"
                                                        : "bg-gray-100 border-gray-200 cursor-not-allowed grayscale opacity-80"
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-gray-600">Clínica</p>
                                                            <p className={`font-bold text-lg ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                                                                {employee.clinic.name} {!isActive && "(Inactiva)"}
                                                            </p>
                                                            <p className="text-sm text-gray-500">RUC: {employee.clinic.ruc}</p>

                                                            <div className="flex items-center gap-2 mt-3">
                                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                                                    {employee.role.name}
                                                                </span>
                                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isActive
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                                    }`}>
                                                                    {isActive ? 'Activo' : 'Inactivo'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {isActive && (
                                                            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-6">No estás asociado a ninguna clínica</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}