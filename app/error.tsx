'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Aquí podrías enviar el error a un servicio de reporte
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>

            <h2 className="text-3xl font-bold text-[#003366] mb-4">¡Ups! Algo salió mal</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Ha ocurrido un error inesperado al procesar tu solicitud. Nuestro equipo ha sido notificado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={reset}
                    className="px-8 py-3 bg-[#003366] text-white rounded-full font-medium hover:bg-[#002244] transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.051M20.418 9c-.655 4.79-4.738 8-9.47 8-5.462 0-9.916-4.522-9.916-10 0-5.48 4.453-10 9.89-10 .686 0 1.36.07 2.016.202l1.69 1.689" />
                    </svg>
                    Intentar de nuevo
                </button>

                <Link
                    href="/"
                    className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
                >
                    Ir al inicio
                </Link>
            </div>
        </div>
    );
}
