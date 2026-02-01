'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Service {
    id: number | string;
    name: string;
    description?: string;
    price: number | string;
    clinic_name?: string;
    clinic_id?: string | number; // Este es el dato clave
    estimated_time?: string;
}

export default function ServiceCard({ service }: { service: Service }) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const numericPrice = typeof service.price === 'number'
        ? service.price
        : parseFloat(service.price || '0');

    const handleNavigation = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isMounted) return;

        // Ajustado al nombre exacto que vimos en tu consola: auth_token
        const token = localStorage.getItem('auth_token');

        if (!token || token === 'undefined' || token === 'null' || token === '') {
            router.push('/login');
        } else {
            // Aseguramos que el clinicId viaje en la URL
            const params = new URLSearchParams({
                serviceId: service.id.toString(),
                serviceName: service.name,
                clinicName: service.clinic_name || '',
                clinicId: service.clinic_id?.toString() || '',
                price: numericPrice.toString()
            });

            router.push(`/citas?${params.toString()}`);
        }
    };

    return (
        <div
            onClick={handleNavigation}
            className="group block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" strokeWidth={2} /></svg>
                </div>
                <span className="text-xl font-bold text-blue-700">${numericPrice.toFixed(2)}</span>
            </div>

            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                {service.name}
            </h3>

            <p className="text-xs font-bold text-blue-500 uppercase mt-1 tracking-wide">
                {service.clinic_name}
            </p>

            <p className="mt-3 text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                {service.description || 'Descripción no disponible.'}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-gray-400 text-xs gap-1">
                <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0" strokeWidth={2} /></svg>
                Agendar ahora
            </div>
        </div>
    );
}