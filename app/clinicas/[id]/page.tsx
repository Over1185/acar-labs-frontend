/* eslint-disable @typescript-eslint/no-explicit-any */
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
    phone?: string;
    email?: string;
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

                // 1. Fetch First Page
                const response = await fetch(`${apiUrl}/public/clinics?page=1`);
                if (!response.ok) throw new Error('Error al cargar la información');

                const data = await response.json();
                let allRawClinics: any[] = [];
                let lastPage = 1;

                // 2. Extract Data & Pagination Info
                if (data.data && Array.isArray(data.data)) {
                    allRawClinics = data.data;

                    if (data.pagination?.last_page) lastPage = data.pagination.last_page;
                    else if (data.last_page) lastPage = data.last_page;
                    else if (data.meta?.last_page) lastPage = data.meta.last_page;
                } else if (Array.isArray(data)) {
                    allRawClinics = data;
                }

                // 3. Fetch Remaining Pages (if any)
                if (lastPage > 1) {
                    const promises = [];
                    for (let i = 2; i <= lastPage; i++) {
                        promises.push(fetch(`${apiUrl}/public/clinics?page=${i}`).then(res => res.json()));
                    }

                    const responses = await Promise.all(promises);
                    responses.forEach((res: any) => {
                        if (res.data && Array.isArray(res.data)) {
                            allRawClinics = [...allRawClinics, ...res.data];
                        }
                    });
                }

                // Find the clinic with the current ID
                const foundClinic = allRawClinics.find((c: any) => c.id === Number(clinicId));

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
                    clinic_id: foundClinic.id,
                    clinic_name: foundClinic.name,
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#003366]/20 border-t-[#003366] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !clinic) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl shadow-xl">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
                    <p className="text-gray-500 mb-6">{error || 'Clínica no encontrada'}</p>
                    <Link
                        href="/clinicas"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-full hover:bg-blue-900 transition-colors"
                    >
                        Volver al listado
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <div className="bg-[#003366] text-white pt-24 pb-32 relative">
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,71.6,35.2C61,47.5,51.1,58.4,39.3,65.8C27.5,73.1,13.7,76.9,-0.8,78.3C-15.3,79.7,-30.6,78.7,-43.8,72.7C-57,66.7,-68.1,55.7,-76.6,42.8C-85.1,29.9,-91.1,15,-90.4,0.4C-89.7,-14.2,-82.3,-28.4,-72.1,-40.1C-61.9,-51.8,-48.9,-60.9,-35.6,-68.5C-22.3,-76.1,-8.7,-82.1,3,-87.3C14.7,-92.5,29.3,-96.9,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link
                        href="/clinicas"
                        className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a clínicas
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{clinic.name}</h1>
                    <div className="flex items-center gap-4 text-blue-200">
                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            {clinic.status === 'active' ? 'Abierto ahora' : 'Disponible'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {clinic.address?.city}, {clinic.address?.province}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Information */}
                    <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Dirección</p>
                                    <p className="text-gray-700 leading-relaxed">
                                        {clinic.address?.address || 'Dirección no disponible'}
                                    </p>
                                </div>
                                <hr className="border-gray-100" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Contacto</p>
                                    <div className="space-y-2">
                                        <p className="flex items-center gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="truncate">{clinic.phone || '+593 99 999 9999'}</span>
                                        </p>
                                        <p className="flex items-center gap-3 text-gray-700">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate">{clinic.email || 'info@acarlabs.com'}</span>
                                        </p>
                                    </div>
                                </div>
                                <hr className="border-gray-100" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">RUC</p>
                                    <p className="text-gray-700 font-mono bg-gray-50 p-2 rounded-lg text-sm inline-block border border-gray-200">
                                        {clinic.ruc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Content */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 min-h-125">

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Servicios Disponibles</h2>
                                    <p className="text-gray-500">Explora los estudios médicos que ofrecemos en esta sede</p>
                                </div>
                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => setPriceFilter('all')}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${priceFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Todos
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter('low')}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${priceFilter === 'low' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        $ Económicos
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter('high')}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${priceFilter === 'high' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        $$$ Premium
                                    </button>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar servicio por nombre..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-[#003366] pl-12 transition-all"
                                    />
                                    <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {filteredServices.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                    {filteredServices.map(service => (
                                        <ServiceCard key={service.id} service={service} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No se encontraron servicios</p>
                                    <button
                                        onClick={() => { setSearchTerm(''); setPriceFilter('all'); }}
                                        className="mt-4 text-[#003366] text-sm font-semibold hover:underline"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
