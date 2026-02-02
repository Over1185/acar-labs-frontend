'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.email.trim()) {
            setError('El email es requerido');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('El email no es válido');
            return;
        }
        if (!formData.password) {
            setError('La contraseña es requerida');
            return;
        }

        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // Store token in localStorage
            if (data.access_token) {
                localStorage.setItem('auth_token', data.access_token);
                localStorage.setItem('token_type', data.token_type || 'bearer');
            }

            setSuccess(true);
            setFormData({
                email: '',
                password: '',
            });

            // Refresh page to reload header with user info
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Iniciar Sesión
                    </h1>
                    <p className="text-gray-600">
                        Accede a tu cuenta para continuar
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    ¡Iniciando sesión!
                                </p>
                                <p className="text-xs text-green-700">
                                    Redirigiendo...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-red-800">
                                    Error
                                </p>
                                <p className="text-sm text-red-700 mt-1">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@ejemplo.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                            disabled={loading || success}
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all pr-12"
                                disabled={loading || success}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={loading || success}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill="none" viewBox="0 0 24 24"><g id="SVGRepo_iconCarrier" fill="currentColor"><path d="M4.496 7.44a15 15 0 0 0-2.307 2.04 3.68 3.68 0 0 0 0 5.04C3.917 16.391 7.19 19 12 19c1.296 0 2.48-.19 3.552-.502l-1.662-1.663A11 11 0 0 1 12 17c-4.033 0-6.812-2.18-8.341-3.837a1.68 1.68 0 0 1 0-2.326 13 13 0 0 1 2.273-1.96z"/><path d="M8.533 11.478q-.038.256-.039.522a3.5 3.5 0 0 0 4.022 3.461zm6.933.969-3.919-3.919q.22-.027.447-.028a3.5 3.5 0 0 1 3.472 3.947"/><path d="M18.112 15.093a13 13 0 0 0 2.23-1.93 1.68 1.68 0 0 0 0-2.326C18.811 9.18 16.032 7 12 7c-.64 0-1.25.055-1.827.154L8.505 5.486A12.6 12.6 0 0 1 12 5c4.811 0 8.083 2.609 9.81 4.48a3.68 3.68 0 0 1 0 5.04c-.58.629-1.334 1.34-2.263 2.008zM2.008 3.422a1 1 0 1 1 1.414-1.414L22 20.586A1 1 0 1 1 20.586 22z"/></g></svg>
                                ) : (
                                    <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7" strokeWidth={2}/></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full bg-linear-to-r from-[#003366] to-[#00509e] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Iniciando sesión...
                            </>
                        ) : success ? (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Iniciado
                            </>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                {/* Forgot Password Link */}
                <div className="text-center mt-4">
                    <a
                        href="#"
                        className="text-sm text-[#003366] hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 mt-6">
                    ¿No tienes cuenta?{' '}
                    <Link
                        href="/registro"
                        className="text-[#003366] font-semibold hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}
