'use client';

import { useState } from 'react';
import Link from 'next/link';
import Popup from '@/components/ui/Popup';

export default function RecuperarContrasenaPage() {
    const [loading, setLoading] = useState(false);

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

    const [email, setEmail] = useState('');

    const handleClosePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
        // Si el envío fue exitoso, podríamos redirigir al login o limpiar el formulario
        if (popup.type === 'success') {
            setEmail('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validación simple
        if (!email.trim()) {
            setPopup({ isOpen: true, type: 'error', message: 'El email es requerido' });
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setPopup({ isOpen: true, type: 'error', message: 'El email no es válido' });
            return;
        }

        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${apiUrl}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al solicitar recuperación');
            }

            setPopup({
                isOpen: true,
                type: 'success',
                message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.'
            });

        } catch (err) {
            setPopup({
                isOpen: true,
                type: 'error',
                message: err instanceof Error ? err.message : 'Error al procesar la solicitud'
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
                        Recuperar Contraseña
                    </h1>
                    <p className="text-gray-600">
                        Ingresa tu correo y te enviaremos las instrucciones
                    </p>
                </div>

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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@ejemplo.com"
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
                                Enviando...
                            </>
                        ) : (
                            'Enviar Instrucciones'
                        )}
                    </button>

                    {/* Back to Login */}
                    <div className="text-center pt-2">
                        <Link
                            href="/login"
                            className="text-sm text-[#003366] hover:underline flex items-center justify-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
