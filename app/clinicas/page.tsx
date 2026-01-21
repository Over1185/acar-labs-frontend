'use client';

import { useState, useEffect } from 'react';
import ClinicCard from '@/components/ui/ClinicCard';
import SearchBar from '@/components/ui/SearchBar';
import Link from 'next/link';

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-[#0a1929] dark:to-[#1a2332]">

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-[#003366] to-[#00509e] pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Nuestras Clínicas
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Encuentra la clínica más cercana y agenda tu cita
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <SearchBar
                            variant="compact"
                            onSearch={(query) => setSearchTerm(query)}
                        />
                    </div>
                </div>
            </section>

            {/* Filtros */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
                    <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="px-4 py-2 rounded-full border bg-white dark:bg-gray-800"
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
                            className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    {loading
                        ? 'Cargando clínicas...'
                        : `Mostrando ${filteredClinics.length} clínicas`}
                </p>

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-700 rounded-full animate-spin" />
                    </div>
                )}

                {!loading && !error && filteredClinics.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClinics.map((clinic, index) => (
                            <ClinicCard
                                key={clinic.id ?? index}
                                clinic={clinic}
                                featured={index === 0}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredClinics.length === 0 && (
                    <p className="text-center text-gray-500 py-20">
                        No se encontraron clínicas
                    </p>
                )}

                {/* Registrar clínica */}
                {!loading && (
                    <div className="mt-16 p-8 bg-white dark:bg-[#1a2332] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold">
                                ¿Eres dueño de una clínica?
                            </h3>
                            <p className="text-gray-600">
                                Únete a nuestra red de salud
                            </p>
                        </div>
                        <Link
                            href="/registerClinic"
                            className="px-8 py-3 bg-[#003366] text-white font-bold rounded-xl"
                        >
                            Registra tu clínica
                        </Link>
                    </div>
                )}
            </section>

            {!loading && !error && (
                <section className="bg-gradient-to-br from-[#003366] to-[#00509e] py-16 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        ¿No encuentras lo que buscas?
                    </h2>
                    <p className="mb-8">
                        Contáctanos y te ayudamos
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/contacto" className="px-8 py-3 bg-white text-[#003366] rounded-full">
                            Contactar
                        </Link>
                        <Link href="/servicios" className="px-8 py-3 border border-white rounded-full">
                            Ver servicios
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}
