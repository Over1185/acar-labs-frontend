'use client';

import { useState, useEffect } from 'react';
import { Clinic } from '@/lib/api';
import ClinicCard from '@/components/ui/ClinicCard';
import SearchBar from '@/components/ui/SearchBar';
import Link from 'next/link'; // Importado para la navegación

export default function ClinicasPage() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvince, setSelectedProvince] = useState<string>('all');

    // Fetch clinics from API
    useEffect(() => {
        const fetchClinics = async () => {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/public/clinics`);

                if (!response.ok) {
                    throw new Error('Error al cargar las clínicas');
                }

                const data = await response.json();
                
                let clinicsData = [];
                if (data.data && Array.isArray(data.data)) {
                    clinicsData = data.data;
                } else if (Array.isArray(data)) {
                    clinicsData = data;
                } else if (data.clinics) {
                    clinicsData = data.clinics;
                } else if (data.results) {
                    clinicsData = data.results;
                }

                const mappedClinics = clinicsData.map((clinic: any) => ({
                    ...clinic,
                    address: clinic.address || {
                        city: 'Por confirmar',
                        province: 'Por confirmar',
                        address: ''
                    }
                }));

                setClinics(mappedClinics);
                setFilteredClinics(mappedClinics);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, []);

    const provinces = Array.from(
        new Set(
            clinics
                .filter(clinic => clinic.address?.province)
                .map(clinic => clinic.address!.province)
        )
    ).sort();

    useEffect(() => {
        let filtered = clinics;

        if (searchTerm) {
            filtered = filtered.filter(
                clinic =>
                    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    clinic.address?.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    clinic.address?.province.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedProvince !== 'all') {
            filtered = filtered.filter(
                clinic => clinic.address?.province === selectedProvince
            );
        }

        setFilteredClinics(filtered);
    }, [searchTerm, selectedProvince, clinics]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332]">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#003366] to-[#00509e] dark:from-[#0a1929] dark:to-[#1a2332] pt-24 pb-16 md:pt-32 md:pb-20">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="clinics-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <circle cx="5" cy="5" r="1" fill="white" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#clinics-grid)" />
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Nuestras Clínicas
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Encuentra la clínica más cercana a ti y agenda tu cita con los mejores profesionales de la salud
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <SearchBar
                            variant="compact"
                            onSearch={(query) => setSearchTerm(query)}
                        />
                    </div>
                </div>
            </section>

            {/* Filters and Results Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Filtrar por:
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                        >
                            <option value="all">Todas las provincias</option>
                            {provinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>

                        {(searchTerm || selectedProvince !== 'all') && (
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedProvince('all'); }}
                                className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 transition-all"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {loading ? 'Cargando clínicas...' : (
                            <>Mostrando <span className="font-semibold text-[#003366] dark:text-blue-400">{filteredClinics.length}</span> {filteredClinics.length === 1 ? 'clínica' : 'clínicas'}</>
                        )}
                    </p>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-[#003366]/20 border-t-[#003366] rounded-full animate-spin"></div>
                    </div>
                )}

                {!loading && !error && filteredClinics.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClinics.map((clinic, index) => (
                            <ClinicCard key={clinic.id} clinic={clinic} featured={index === 0} />
                        ))}
                    </div>
                )}

                {/* --- NUEVA SECCIÓN: REGISTRA TU CLÍNICA --- */}
                {!loading && (
                    <div className="mt-16 p-8 bg-white dark:bg-[#1a2332] border border-blue-100 dark:border-blue-900 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-[#003366] dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">¿Eres dueño de una clínica?</h3>
                                <p className="text-gray-600 dark:text-gray-400">Únete a nuestra red de salud y llega a más pacientes.</p>
                            </div>
                        </div>
                        <Link 
                            href="/registerClinic" 
                            className="w-full md:w-auto px-8 py-3 bg-[#003366] hover:bg-[#00509e] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all text-center"
                        >
                            Registra tu clínica ahora
                        </Link>
                    </div>
                )}
            </section>

            {/* CTA Section (Solo si no hay error) */}
            {!loading && !error && (
                <section className="bg-gradient-to-br from-[#003366] to-[#00509e] dark:from-[#0a1929] dark:to-[#1a2332] py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿No encuentras lo que buscas?</h2>
                        <p className="text-xl text-white/90 mb-8">Contáctanos y te ayudaremos a encontrar la clínica perfecta para tus necesidades</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contacto" className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#003366] font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg">Contactar</Link>
                            <Link href="/servicios" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#003366] transition-all">Ver Servicios</Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}