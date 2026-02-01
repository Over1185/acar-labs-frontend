import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="mb-6 relative">
                <h1 className="text-9xl font-black text-[#003366]/5 select-none">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg fill="none" stroke="currentColor" className="w-24 h-24 text-[#003366]" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 0 1 5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" strokeWidth={1.5}/></svg>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-[#003366] mb-4">Página no encontrada</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Parece que te has perdido. La página que buscas no está disponible o ha sido movida.
            </p>

            <Link
                href="/"
                className="group flex items-center gap-2 px-8 py-3 bg-[#003366] text-white rounded-full font-medium hover:bg-[#002244] transition-all transform hover:scale-105 shadow-md"
            >
                <span>Volver al inicio</span>
                <svg fill="none" stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14 5 7 7m0 0-7 7m7-7H3" strokeWidth={2}/></svg>
            </Link>
        </div>
    );
}
