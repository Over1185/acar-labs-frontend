import React, { useState } from 'react';

// 1. Definimos la interfaz correctamente
interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
}

// Definimos un tipo para los tabs (opcional pero recomendado)
type Tab = 'home' | 'servicios' | 'contacto';

export default function ServiciosTab({ services }: { services: Service[] }) {
    // 2. El estado debe ir DENTRO del componente
    const [activeTab, setActiveTab] = useState<Tab>('servicios');

    return (
        // 3. Usamos un Fragment <> o un div para envolver la lógica
        <>
            {activeTab === 'servicios' && (
                <div className="p-4">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Servicios Disponibles
                        </h2>
                        <p className="text-gray-600">
                            Todos los análisis y servicios que ofrecemos
                        </p>
                    </div>

                    {services && services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#003366] transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                        </div>
                                        <span className="text-2xl font-bold text-[#003366]">
                                            ${service.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                                        {service.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {service.description}
                                    </p>
                                    <button className="w-full bg-[#003366] hover:bg-[#00509e] text-white font-semibold py-2 rounded-lg transition-colors">
                                        Agendar Cita
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-blue-50 rounded-lg p-12 text-center border-2 border-dashed border-blue-200">
                            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0A5 5 0 017 12z" />
                            </svg>
                            <p className="text-gray-600 text-lg">No hay servicios disponibles</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}