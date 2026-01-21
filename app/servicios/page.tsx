'use client';

import { useState, useEffect } from 'react';
import ServiceCard from '@/components/ui/ServiceCard';

export default function ServiciosPage() {
    const [services, setServices] = useState<Array<any>>([]);
    const [filteredServices, setFilteredServices] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/services');

                if (!response.ok) {
                    throw new Error('Error al cargar los servicios');
                }

                const data = await response.json();
                setServices(data.services || []);
                setFilteredServices(data.services || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        let filtered = services;

        if (searchTerm) {
            filtered = filtered.filter(
                service =>
                    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    service.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (priceFilter !== 'all') {
            filtered = filtered.filter(service => {
                const price = service.price;
                if (priceFilter === 'low') return price < 50;
                if (priceFilter === 'medium') return price >= 50 && price < 150;
                if (priceFilter === 'high') return price >= 150;
                return true;
            });
        }

        setFilteredServices(filtered);
    }, [searchTerm, priceFilter, services]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332]">
            <section className="relative bg-gradient-to-br from-[#003366] to-[#00509e] dark:from-[#0a1929] dark:to-[#1a2332] pt-24 pb-16 md:pt-32 md:pb-20">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="services-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 0 5 Q 2.5 3 5 5 T 10 5" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#services-pattern)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Nuestros Servicios
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                        Ofrecemos una amplia gama de servicios médicos de alta calidad para cuidar tu salud y la de tu familia
                    </p>

                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar servicios médicos..."
                                className="w-full px-6 py-4 pl-14 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
                            />
                            <svg
                                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-gray-600 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Filtrar por precio:
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setPriceFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priceFilter === 'all'
                                    ? 'bg-[#003366] dark:bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setPriceFilter('low')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priceFilter === 'low'
                                    ? 'bg-[#003366] dark:bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            Menos de $50
                        </button>
                        <button
                            onClick={() => setPriceFilter('medium')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priceFilter === 'medium'
                                    ? 'bg-[#003366] dark:bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            $50 - $150
                        </button>
                        <button
                            onClick={() => setPriceFilter('high')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priceFilter === 'high'
                                    ? 'bg-[#003366] dark:bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            Más de $150
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {loading ? (
                            'Cargando servicios...'
                        ) : (
                            <>
                                Mostrando{' '}
                                <span className="font-semibold text-[#003366] dark:text-blue-400">
                                    {filteredServices.length}
                                </span>{' '}
                                {filteredServices.length === 1 ? 'servicio' : 'servicios'}
                                {(searchTerm || priceFilter !== 'all') && <> de {services.length} totales</>}
                            </>
                        )}
                    </p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-[#003366]/20 border-t-[#003366] dark:border-blue-500/20 dark:border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                        <svg
                            className="w-12 h-12 text-red-500 mx-auto mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                            Error al cargar los servicios
                        </h3>
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {!loading && !error && filteredServices.length === 0 && (
                    <div className="text-center py-20">
                        <svg
                            className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No se encontraron servicios
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {searchTerm || priceFilter !== 'all'
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'Aún no hay servicios disponibles'}
                        </p>
                    </div>
                )}

                {!loading && !error && filteredServices.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
