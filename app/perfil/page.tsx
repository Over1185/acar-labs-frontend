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
            status: string;
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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332] flex items-center justify-center pt-20">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#003366]/20 border-t-[#003366] dark:border-blue-500/20 dark:border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332] pt-24">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                            Error
                        </h3>
                        <p className="text-red-600 dark:text-red-400 mb-4">{error || 'No se encontró el perfil'}</p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332] pt-24 pb-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 mb-8 text-[#003366] dark:text-blue-400 hover:underline"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver
                </Link>

                {/* Profile Card */}
                <div className="bg-white dark:bg-[#1a2332] rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-[#003366] to-[#00509e] dark:from-blue-600 dark:to-blue-700"></div>

                    {/* Profile Content */}
                    <div className="px-6 sm:px-8 pb-8">
                        {/* Avatar and Name */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-8">
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#003366] to-[#00509e] dark:from-blue-600 dark:to-blue-700 flex items-center justify-center text-5xl font-bold text-white border-4 border-white dark:border-[#1a2332] shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {user.name}
                                </h1>
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div className="space-y-6">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Información Personal
                                </h2>
                                <div className="space-y-4">
                                    {/* Email */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-[#003366] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Correo Electrónico</p>
                                                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-[#003366] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {user.is_active ? (
                                                        <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400">
                                                            <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <span className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full"></span>
                                                            Inactivo
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Verified */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-[#003366] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Email Verificado</p>
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {user.email_verified_at ? (
                                                        <span className="text-green-600 dark:text-green-400">Sí</span>
                                                    ) : (
                                                        <span className="text-yellow-600 dark:text-yellow-400">Pendiente</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Created At */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-[#003366] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Miembro desde</p>
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clinics Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Clínicas Asociadas
                                </h2>
                                {user.employees && user.employees.length > 0 ? (
                                    <div className="space-y-3">
                                        {user.employees.map((employee) => (
                                            <div
                                                key={employee.id}
                                                onClick={() => window.open(`http://localhost:3000/clinic/${employee.clinic.id}`, '_blank')}
                                                className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Clínica</p>
                                                        <p className="text-gray-900 dark:text-white font-bold text-lg">
                                                            {employee.clinic.name}
                                                        </p>
                                                        {employee.clinic.ruc && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                RUC: {employee.clinic.ruc}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-semibold rounded-full">
                                                                {employee.role.name}
                                                            </span>
                                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                                employee.status === 'active'
                                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                                            }`}>
                                                                {employee.status === 'active' ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m0 0h5.581M9 19h4" />
                                        </svg>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                                            No estás asociado a ninguna clínica
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                            Contacta con el administrador para ser agregado a una clínica
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/"
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-[#003366] dark:bg-blue-600 text-white font-semibold rounded-lg hover:bg-[#00509e] dark:hover:bg-blue-700 transition-all"
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
