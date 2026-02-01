'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import ServiceCard from '@/components/ui/ServiceCard';

export default function ServiciosPage() {
    const [services, setServices] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
    const [selectedExams, setSelectedExams] = useState<string[]>([]);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
                const response = await fetch(`${API_URL}/public/clinics`);
                if (!response.ok) throw new Error('Error al obtener datos');
                
                const res = await response.json();
                const clinics = res.data || [];

                // AJUSTE AQUÍ: Mapeamos el clinic_id para que llegue al ServiceCard
                const allServices = clinics.flatMap((clinic: any) => 
                    (clinic.services || []).map((s: any) => ({
                        ...s,
                        clinic_name: clinic.name,
                        clinic_id: clinic.id, // <--- ESTO ES LO QUE FALTABA
                        cleanName: s.name.trim()
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

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesExams = selectedExams.length === 0 || selectedExams.includes(service.cleanName);

            const price = parseFloat(service.price);
            let matchesPrice = true;
            if (selectedPrice === 'low') matchesPrice = price < 50;
            if (selectedPrice === 'medium') matchesPrice = price >= 50 && price < 150;
            if (selectedPrice === 'high') matchesPrice = price >= 150;

            return matchesSearch && matchesExams && matchesPrice;
        });
    }, [services, searchTerm, selectedExams, selectedPrice]);

    const toggleExam = (examName: string) => {
        setSelectedExams(prev => 
            prev.includes(examName) ? prev.filter(e => e !== examName) : [...prev, examName]
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-[#003366] pt-24 pb-12 px-4 text-center">
                <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">Servicios Médicos Disponibles</h1>
                <div className="max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder="Buscar por nombre de examen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 rounded-2xl shadow-lg outline-none text-gray-800 focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-72 shrink-0 space-y-6">
                    <div className="flex flex-col" ref={dropdownRef}>
                        <h3 className="font-bold text-[#003366] mb-2 text-lg">Tipo de Examen</h3>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm shadow-sm flex justify-between items-center hover:border-blue-400 transition-all"
                        >
                            <span className="text-gray-600 truncate">
                                {selectedExams.length === 0 ? "Seleccionar exámenes" : `${selectedExams.length} seleccionados`}
                            </span>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="relative mt-2 bg-white border border-gray-100 rounded-xl shadow-inner max-h-60 overflow-y-auto p-2 space-y-1">
                                {examTypes.map(exam => (
                                    <label key={exam} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer group">
                                        <input 
                                            type="checkbox"
                                            checked={selectedExams.includes(exam)}
                                            onChange={() => toggleExam(exam)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className={`text-sm ${selectedExams.includes(exam) ? 'font-bold text-blue-600' : 'text-gray-600 group-hover:text-blue-500'}`}>
                                            {exam}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 mt-4">
                        <h3 className="font-bold text-[#003366] mb-2 text-lg">Rango de Precio</h3>
                        <select 
                            value={selectedPrice || ''} 
                            onChange={(e) => setSelectedPrice(e.target.value || null)}
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm shadow-sm outline-none cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            <option value="">Cualquier precio</option>
                            <option value="low">Menos de $50</option>
                            <option value="medium">$50 - $150</option>
                            <option value="high">Más de $150</option>
                        </select>
                    </div>
                </aside>

                <div className="flex-1">
                    {(selectedExams.length > 0 || selectedPrice) && (
                        <div className="mb-6 flex flex-wrap gap-2 items-center">
                            {selectedExams.map(exam => (
                                <button key={exam} onClick={() => toggleExam(exam)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-50 transition-colors">
                                    {exam} <span>✕</span>
                                </button>
                            ))}
                            {selectedPrice && (
                                <button onClick={() => setSelectedPrice(null)} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-50 transition-colors">
                                    Precio <span>✕</span>
                                </button>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200 rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredServices.map((service, idx) => (
                                <ServiceCard key={`${service.id}-${idx}`} service={service} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}