/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Image from 'next/image';
import ServiceCard from '@/components/ui/ServiceCard';
import { useSearchParams } from 'next/navigation';

function ServiciosContent() {
    const searchParams = useSearchParams();
    const [services, setServices] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [selectedExams, setSelectedExams] = useState<string[]>([]);

    // Filtros de Ubicación
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchTerm(query);
            // Si el query coincide con un tipo de examen, también podríamos seleccionarlo
            // toggleExam(query); // Opcional, pero setSearchTerm suele ser suficiente para busqueda general
        }
    }, [searchParams]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedPrice, selectedExams, selectedProvince, selectedCity]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);

                // 1. Fetch First Page
                const response = await fetch(`${API_URL}/public/clinics?page=1`);
                if (!response.ok) throw new Error('Error al obtener datos');

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
                        promises.push(fetch(`${API_URL}/public/clinics?page=${i}`).then(res => res.json()));
                    }

                    const responses = await Promise.all(promises);
                    responses.forEach((res: any) => {
                        if (res.data && Array.isArray(res.data)) {
                            allRawClinics = [...allRawClinics, ...res.data];
                        }
                    });
                }

                // AJUSTE AQUÍ: Mapeamos el clinic_id para que llegue al ServiceCard
                const allServices = allRawClinics.flatMap((clinic: any) =>
                    (clinic.services || []).map((s: any) => ({
                        ...s,
                        clinic_name: clinic.name,
                        clinic_id: clinic.id, // <--- ESTO ES LO QUE FALTABA
                        cleanName: s.name.trim(),
                        // Agregamos info de ubicación al servicio
                        province: clinic.address?.province?.trim() || 'Desconocida',
                        city: clinic.address?.city?.trim() || 'Desconocida'
                    }))
                );
                setServices(allServices);
            } catch (err) {
                setError("No se pudieron cargar los servicios médicos.");
            } finally {
                setLoading(false);
            }
        };
        if (API_URL) fetchServices();
    }, [API_URL]);

    const examTypes = useMemo(() => {
        const names = services.map(s => s.cleanName);
        return Array.from(new Set(names)).sort();
    }, [services]);

    const provinces = useMemo(() => {
        const provs = services.map(s => s.province);
        return Array.from(new Set(provs)).filter(p => p !== 'Desconocida' && p).sort() as string[];
    }, [services]);

    const cities = useMemo(() => {
        let relevantServices = services;
        // Si hay provincia seleccionada, solo mostrar ciudades de esa provincia
        if (selectedProvince) {
            relevantServices = services.filter(s => s.province === selectedProvince);
        }
        const cts = relevantServices.map(s => s.city);
        return Array.from(new Set(cts)).filter(c => c !== 'Desconocida' && c).sort() as string[];
    }, [services, selectedProvince]);

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesExams = selectedExams.length === 0 || selectedExams.includes(service.cleanName);

            const price = parseFloat(service.price);
            let matchesPrice = true;
            if (selectedPrice === 'low') matchesPrice = price < 50;
            if (selectedPrice === 'medium') matchesPrice = price >= 50 && price < 150;
            if (selectedPrice === 'high') matchesPrice = price >= 150;

            // Location Filters
            const matchesProvince = !selectedProvince || service.province === selectedProvince;
            const matchesCity = !selectedCity || service.city === selectedCity;

            return matchesSearch && matchesExams && matchesPrice && matchesProvince && matchesCity;
        });
    }, [services, searchTerm, selectedExams, selectedPrice, selectedProvince, selectedCity]);

    const toggleExam = (examName: string) => {
        setSelectedExams(prev =>
            prev.includes(examName) ? prev.filter(e => e !== examName) : [...prev, examName]
        );
    };
    // Pagination logic
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const displayedServices = filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section - Matching Nosotros Page Style */}
            <section className="relative bg-linear-to-br from-[#003366] to-[#00509e] pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 opacity-50">
                    <Image
                        src="/images/services/Banner.avif"
                        alt="Decorative pattern"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="relative max-w-400 mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
                        Servicios Médicos
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Explora nuestro catálogo completo de exámenes y procedimientos disponibles en nuestra red de clínicas aliadas.
                    </p>

                    {/* Search Bar - Integrated into Hero */}
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-teal-300 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-200"></div>
                        <div className="relative bg-white rounded-full p-2 flex items-center shadow-2xl">
                            <div className="pl-4 text-gray-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar examen, procedimiento o especialidad..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 md:p-4 rounded-full outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-8 min-h-125">

                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-80 shrink-0 space-y-8 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-[#003366] mb-4 text-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filtros
                            </h3>

                            {/* Province Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Provincia</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#003366]/10 cursor-pointer"
                                    value={selectedProvince || ''}
                                    onChange={(e) => {
                                        setSelectedProvince(e.target.value || null);
                                        setSelectedCity(null); // Reset city when province changes
                                    }}
                                >
                                    <option value="">Todas las provincias</option>
                                    {provinces.map(prov => (
                                        <option key={prov} value={prov}>{prov}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#003366]/10 cursor-pointer disabled:opacity-50"
                                    value={selectedCity || ''}
                                    onChange={(e) => setSelectedCity(e.target.value || null)}
                                    disabled={cities.length === 0}
                                >
                                    <option value="">Todas las ciudades</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Exam Type Filter */}
                            <div className="mb-6 relative" ref={dropdownRef}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Servicio</label>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full px-4 py-3 bg-gray-50 hover:bg-white border border-gray-200 rounded-xl text-sm shadow-sm flex justify-between items-center transition-all focus:ring-2 focus:ring-[#003366]/10"
                                >
                                    <span className="text-gray-700 truncate font-medium">
                                        {selectedExams.length === 0 ? "Todos los exámenes" : `${selectedExams.length} seleccionados`}
                                    </span>
                                    <svg className={`w-4 h-4 text-[#003366] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div className={`absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto p-2 space-y-1 transition-all origin-top ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                                    {examTypes.map(exam => (
                                        <label key={exam} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50 cursor-pointer group transition-colors">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedExams.includes(exam)}
                                                    onChange={() => toggleExam(exam)}
                                                    className="peer h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]/20"
                                                />
                                            </div>
                                            <span className={`text-sm ${selectedExams.includes(exam) ? 'font-bold text-[#003366]' : 'text-gray-600 group-hover:text-[#003366]'}`}>
                                                {exam}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Rango de Precio</label>
                                <div className="space-y-3">
                                    {[
                                        { value: 'low', label: 'Económico (< )' },
                                        { value: 'medium', label: 'Estándar ( - )' },
                                        { value: 'high', label: 'Premium (> )' }
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                                            <input
                                                type="radio"
                                                name="price"
                                                value={option.value}
                                                checked={selectedPrice === option.value}
                                                onChange={(e) => setSelectedPrice(e.target.value)}
                                                className="h-4 w-4 text-[#003366] border-gray-300 focus:ring-[#003366]/20"
                                            />
                                            <span className="text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">

                        {/* Active Filters Summary */}
                        {(selectedExams.length > 0 || selectedProvince || selectedCity || selectedPrice) && (
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Filtros Activos</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPrice && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100 animate-fade-in">
                                            {selectedPrice === 'low' ? 'Económico' : selectedPrice === 'medium' ? 'Estándar' : 'Premium'}
                                            <button onClick={() => setSelectedPrice(null)} className="hover:text-red-500 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                    {selectedProvince && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 animate-fade-in">
                                            {selectedProvince}
                                            <button onClick={() => { setSelectedProvince(null); setSelectedCity(null); }} className="hover:text-red-500 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                    {selectedCity && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 animate-fade-in">
                                            {selectedCity}
                                            <button onClick={() => setSelectedCity(null)} className="hover:text-red-500 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}

                                    {selectedExams.map(exam => (
                                        <span key={exam} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#003366] text-xs font-bold rounded-full border border-blue-100 animate-fade-in">
                                            {exam}
                                            <button onClick={() => toggleExam(exam)} className="hover:text-red-500 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                    <button
                                        onClick={() => { setSelectedExams([]); setSelectedProvince(null); setSelectedCity(null); setSelectedPrice(null); }}
                                        className="text-xs text-gray-500 hover:text-[#003366] font-medium underline px-2"
                                    >
                                        Limpiar todos
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading State or Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                <p className="text-red-500 font-medium">{error}</p>
                            </div>
                        ) : filteredServices.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedServices.map((service, idx) => (
                                        <ServiceCard key={`${service.id}-${idx}`} service={service} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-12 pb-8">
                                        <button
                                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${currentPage === page
                                                        ? 'bg-[#003366] text-white shadow-md'
                                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No se encontraron servicios</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">
                                    Intenta ajustar tu búsqueda o limpiar los filtros seleccionados.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedExams([]); setSelectedPrice(null); setSelectedProvince(null); setSelectedCity(null); }}
                                    className="mt-4 text-[#003366] font-semibold hover:underline"
                                >
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ServiciosPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin"></div></div>}>
            <ServiciosContent />
        </Suspense>
    );
}
