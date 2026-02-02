'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Popup from '@/components/ui/Popup';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Estado del Popup
    const [popup, setPopup] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        message: string;
    }>({
        isOpen: false,
        type: 'success',
        message: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClosePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
        if (popup.type === 'success') {
            router.push('/login');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            setPopup({ isOpen: true, type: 'error', message: 'El nombre es requerido' });
            return;
        }
        if (!formData.email.trim()) {
            setPopup({ isOpen: true, type: 'error', message: 'El email es requerido' });
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setPopup({ isOpen: true, type: 'error', message: 'El email no es válido' });
            return;
        }
        if (!formData.password) {
            setPopup({ isOpen: true, type: 'error', message: 'La contraseña es requerida' });
            return;
        }
        if (formData.password.length < 6) {
            setPopup({ isOpen: true, type: 'error', message: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            setPopup({ isOpen: true, type: 'error', message: 'Las contraseñas no coinciden' });
            return;
        }

        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrarse');
            }

            setPopup({
                isOpen: true,
                type: 'success',
                message: '¡Registro exitoso! Ya puedes iniciar sesión.'
            });

            setFormData({
                name: '',
                email: '',
                password: '',
                passwordConfirm: '',
            });

        } catch (err) {
            setPopup({
                isOpen: true,
                type: 'error',
                message: err instanceof Error ? err.message : 'Error desconocido'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center px-4 py-12">
            <Popup
                isOpen={popup.isOpen}
                type={popup.type}
                message={popup.message}
                onClose={handleClosePopup}
            />
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Crear Cuenta
                    </h1>
                    <p className="text-gray-600">
                        Regístrate para acceder a nuestros servicios
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">

                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                            Nombre Completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Juan Pérez"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                            disabled={loading}
                        />
                    </div>

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
                            placeholder="juan@ejemplo.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                            disabled={loading}
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
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' fill="none" viewBox="0 0 24 24"><g id="SVGRepo_iconCarrier" fill="currentColor"><path d="M4.496 7.44a15 15 0 0 0-2.307 2.04 3.68 3.68 0 0 0 0 5.04C3.917 16.391 7.19 19 12 19c1.296 0 2.48-.19 3.552-.502l-1.662-1.663A11 11 0 0 1 12 17c-4.033 0-6.812-2.18-8.341-3.837a1.68 1.68 0 0 1 0-2.326 13 13 0 0 1 2.273-1.96z" /><path d="M8.533 11.478q-.038.256-.039.522a3.5 3.5 0 0 0 4.022 3.461zm6.933.969-3.919-3.919q.22-.027.447-.028a3.5 3.5 0 0 1 3.472 3.947" /><path d="M18.112 15.093a13 13 0 0 0 2.23-1.93 1.68 1.68 0 0 0 0-2.326C18.811 9.18 16.032 7 12 7c-.64 0-1.25.055-1.827.154L8.505 5.486A12.6 12.6 0 0 1 12 5c4.811 0 8.083 2.609 9.81 4.48a3.68 3.68 0 0 1 0 5.04c-.58.629-1.334 1.34-2.263 2.008zM2.008 3.422a1 1 0 1 1 1.414-1.414L22 20.586A1 1 0 1 1 20.586 22z" /></g></svg>
                                ) : (
                                    <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7" strokeWidth={2}/></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-900 mb-2">
                            Confirmar Contraseña
                        </label>
                        <input
                            id="passwordConfirm"
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-[#003366] to-[#00509e] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Registrando...
                            </>
                        ) : (
                            'Crear Cuenta'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-600 mt-6">
                    ¿Ya tienes cuenta?{' '}
                    <Link
                        href="/login"
                        className="text-[#003366] font-semibold hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
