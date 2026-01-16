'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ServiceCard from '@/components/ui/ServiceCard';

interface Clinic {
    id: number;
    name: string;
    ruc: string;
    status: string;
    address?: {
        city: string;
        province: string;
        address: string;
    };
}

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
}

export default function ClinicDetailPage() {
    const params = useParams();
    const clinicId = params.id;
    
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

    useEffect(() => {
        const fetchClinicAndServices = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                
                // Fetch all clinics to get clinic details and its services
                const response = await fetch(`${apiUrl}/public/clinics`);
                if (!response.ok) {
                    throw new Error('Error al cargar la información');
                }

                const data = await response.json();
                
                // Extract clinics data
                let clinicsData = [];
                if (data.data && Array.isArray(data.data)) {
                    clinicsData = data.data;
                } else if (Array.isArray(data)) {
                    clinicsData = data;
                }

                // Find the clinic with the current ID
                const foundClinic = clinicsData.find((c: any) => c.id === Number(clinicId));
                
                if (!foundClinic) {
                    throw new Error('Clínica no encontrada');
                }

                // Set clinic data with address
                setClinic({
                    ...foundClinic,
                    address: foundClinic.address || {
                        city: 'Por confirmar',
                        province: 'Por confirmar',
                        address: ''
                    }
                });

                // Extract services from clinic
                const servicesList = (foundClinic.services || []).map((service: any) => ({
                    ...service,
                    price: typeof service.price === 'string' ? parseFloat(service.price) : service.price
                }));
                setServices(servicesList);
                setFilteredServices(servicesList);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        if (clinicId) {
            fetchClinicAndServices();
        }
    }, [clinicId]);

    // Filter services based on search and price
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#003366]/20 border-t-[#003366] dark:border-blue-500/20 dark:border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error || !clinic) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        href="/clinicas"
                        className="inline-flex items-center gap-2 mb-8 text-[#003366] dark:text-blue-400 hover:underline"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver a clínicas
                    </Link>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                            Error al cargar la información
                        </h3>
                        <p className="text-red-600 dark:text-red-400">{error || 'No se encontró la clínica'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332]">
            {/* Header with back button */}
            <div className="bg-white dark:bg-[#1a2332] border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/clinicas"
                        className="inline-flex items-center gap-2 text-[#003366] dark:text-blue-400 hover:underline"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver a clínicas
                    </Link>
                </div>
            </div>

            {/* Clinic Info Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white dark:bg-[#1a2332] rounded-2xl shadow-lg p-8 mb-12">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                {clinic.name}
                            </h1>
                        </div>
                    </div>

                    {clinic.address && (
                        <div className="flex items-start gap-4">
                            <svg className="w-6 h-6 text-[#003366] dark:text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <div>
                                <p className="text-gray-900 dark:text-white">
                                    {[clinic.address.province, 'Ecuador', clinic.address.city]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Services Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Servicios Disponibles
                    </h2>

                    {/* Search and Filters */}
                    <div className="mb-8 space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar servicios..."
                                className="w-full px-6 py-3 pl-12 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-500"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
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

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Mostrando{' '}
                            <span className="font-semibold text-[#003366] dark:text-blue-400">
                                {filteredServices.length}
                            </span>{' '}
                            {filteredServices.length === 1 ? 'servicio' : 'servicios'}
                            {(searchTerm || priceFilter !== 'all') && <> de {services.length} totales</>}
                        </p>
                    </div>
                </div>

                {/* No services found */}
                {filteredServices.length === 0 && (
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
                                : 'Esta clínica aún no tiene servicios registrados'}
                        </p>
                    </div>
                )}

                {/* Services Grid */}
                {filteredServices.length > 0 && (
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
