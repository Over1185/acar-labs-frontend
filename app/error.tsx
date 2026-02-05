'use client';

import Link from 'next/link';

export default function Error({
    reset,
}: {
    reset: () => void;
}) {

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="h-16 w-16 text-red-500" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3" strokeWidth={1.5}/></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24"><path id="SVGRepo_iconCarrier" fill="#fff" d="M4.395 12.001a.75.75 0 0 0 1.5-.001zm1.894-3.89.63.407zm3.046-2.577-.295-.69h-.001zm3.921-.4.152-.735h-.002zM16.73 7.05l-.54.52zm.984 3.157a.75.75 0 0 0 1.442-.415zm-.005-.396a.75.75 0 1 0 1.452.377zm2.162-2.355a.75.75 0 1 0-1.452-.377zm-1.636 3.266a.75.75 0 0 0 .4-1.445zm-2.25-2.177a.75.75 0 1 0-.399 1.446zM19.896 12a.75.75 0 1 0-1.5.001zm-1.894 3.89-.63-.407zm-3.046 2.578.296.689zm-3.921.4-.152.734h.002zM7.56 16.95l.54-.52v-.002zm-.984-3.158a.75.75 0 0 0-1.442.415zm.005.396a.75.75 0 1 0-1.452-.377zm-2.162 2.355a.75.75 0 1 0 1.452.377zm1.636-3.266a.75.75 0 0 0-.4 1.445zm2.25 2.178a.75.75 0 0 0 .399-1.446zM5.894 12a6.4 6.4 0 0 1 1.024-3.482l-1.26-.813A7.9 7.9 0 0 0 4.395 12zM6.92 8.518a6.1 6.1 0 0 1 2.71-2.295l-.59-1.378a7.6 7.6 0 0 0-3.38 2.86zm2.71-2.295a5.85 5.85 0 0 1 3.476-.355l.3-1.47a7.35 7.35 0 0 0-4.366.446zm3.473-.355A6 6 0 0 1 16.19 7.57l1.08-1.04a7.5 7.5 0 0 0-3.861-2.132zm3.088 1.704a6.3 6.3 0 0 1 1.523 2.636l1.442-.415a7.8 7.8 0 0 0-1.887-3.264zm2.97 2.617.71-2.732-1.452-.377-.71 2.732zm-.526-.911-2.65-.732-.399 1.446 2.65.731zM18.395 12a6.4 6.4 0 0 1-1.024 3.482l1.26.813A7.9 7.9 0 0 0 19.895 12zm-1.024 3.482a6.1 6.1 0 0 1-2.712 2.296l.592 1.378a7.6 7.6 0 0 0 3.38-2.861zm-2.711 2.295a5.85 5.85 0 0 1-3.476.355l-.3 1.47a7.35 7.35 0 0 0 4.367-.446zm-3.473.355A6 6 0 0 1 8.1 16.43l-1.08 1.041a7.47 7.47 0 0 0 3.862 2.13zM8.099 16.43a6.3 6.3 0 0 1-1.523-2.637l-1.442.415a7.8 7.8 0 0 0 1.887 3.264zm-2.97-2.618-.71 2.732 1.452.377.71-2.732zm.526.912 2.65.732.399-1.446-2.65-.732z"/></svg>
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
