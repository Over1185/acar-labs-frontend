/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import ClinicCard from '@/components/ui/ClinicCard';
import SearchBar from '@/components/ui/SearchBar';
import Image from 'next/image';

export default function ClinicasPage() {
    const [clinics, setClinics] = useState<Array<any>>([]);
    const [filteredClinics, setFilteredClinics] = useState<Array<any>>([]);
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

                let clinicsData: any[] = [];
                if (Array.isArray(data?.data)) clinicsData = data.data;
                else if (Array.isArray(data)) clinicsData = data;
                else if (Array.isArray(data?.clinics)) clinicsData = data.clinics;
                else if (Array.isArray(data?.results)) clinicsData = data.results;

                const mappedClinics = clinicsData.map((clinic) => ({
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
                .map(clinic => clinic.address.province)
        )
    ).sort();

    useEffect(() => {
        let filtered = clinics;

        if (searchTerm) {
            filtered = filtered.filter(
                clinic =>
                    clinic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    clinic.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    clinic.address?.province?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-[#003366] text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,71.6,35.2C61,47.5,51.1,58.4,39.3,65.8C27.5,73.1,13.7,76.9,-0.8,78.3C-15.3,79.7,-30.6,78.7,-43.8,72.7C-57,66.7,-68.1,55.7,-76.6,42.8C-85.1,29.9,-91.1,15,-90.4,0.4C-89.7,-14.2,-82.3,-28.4,-72.1,-40.1C-61.9,-51.8,-48.9,-60.9,-35.6,-68.5C-22.3,-76.1,-8.7,-82.1,3,-87.3C14.7,-92.5,29.3,-96.9,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="max-w-400 mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Nuestras Clínicas
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-lg leading-relaxed">
                            Contamos con una amplia red de sedes con tecnología de punta y el mejor equipo humano a su disposición.
                        </p>
                    </div>

                    <div className="md:w-5/12 relative h-64 md:h-80 w-full hidden md:block rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                        <div className="absolute inset-0 bg-linear-to-tr from-blue-600/20 to-transparent z-10"></div>
                        <Image
                            src="/images/clinics/Banner.avif"
                            alt="Hospital interior"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 z-20 pb-20">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">

                    {/* Filters & Search Header */}
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-10 pb-8 border-b border-gray-100">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Encuentra tu sede</h2>
                            <p className="text-gray-500">Busca por nombre, ciudad o sector</p>
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    variant="compact"
                                    onSearch={(query) => setSearchTerm(query)}
                                />
                            </div>

                            <select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-[#003366] appearance-none cursor-pointer min-w-45"
                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .2em top 50%', backgroundSize: '.65em' }}
                            >
                                <option value="all">Todas las provincias</option>
                                {provinces.map(province => (
                                    <option key={province} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </select>

                            {(searchTerm || selectedProvince !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedProvince('all');
                                    }}
                                    className="px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap font-medium"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats or Info */}
                    <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
                        <span>
                            {loading ? 'Cargando...' : `Mostrando ${filteredClinics.length} sedes disponibles`}
                        </span>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="w-16 h-16 border-4 border-[#003366]/20 border-t-[#003366] rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Cargando clínicas...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-12 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Error al cargar datos</h3>
                            <p className="text-gray-600">{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredClinics.map((clinic, index) => (
                                <ClinicCard
                                    key={clinic.id ?? index}
                                    clinic={clinic}
                                    featured={index === 0}
                                />
                            ))}
                            {filteredClinics.length === 0 && (
                                <div className="col-span-full text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron resultados</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto">
                                        Intenta ajustar tus términos de búsqueda o filtros para encontrar lo que necesitas.
                                    </p>
                                    <button
                                        onClick={() => { setSearchTerm(''); setSelectedProvince('all'); }}
                                        className="mt-6 px-6 py-2 bg-[#003366] text-white rounded-full hover:bg-blue-900 transition-colors"
                                    >
                                        Ver todas las clínicas
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
