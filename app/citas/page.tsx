'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CrearCitaPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Datos recuperados de la URL (enviados desde el ServiceCard)
    const serviceName = searchParams.get('serviceName');
    const clinicName = searchParams.get('clinicName');
    const clinicId = searchParams.get('clinicId');

    // Estados del formulario
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Validación de seguridad: Si no hay ID de clínica, volvemos a servicios
    useEffect(() => {
        if (!clinicId) {
            router.push('/servicios');
        }
    }, [clinicId, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Usamos el nombre de token que detectamos en tu localStorage
        const token = localStorage.getItem('auth_token');

        // Formato para tu API: "YYYY-MM-DD HH:mm:ss"
        const scheduledDate = `${fecha} ${hora}:00`;

        try {
            const response = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    scheduled_date: scheduledDate,
                    status: 'pending', // Estado inicial según tu API
                    clinic_id: parseInt(clinicId || '0')
                }),
            });

            const res = await response.json();

            if (response.ok) {
                alert("¡Cita agendada con éxito!");
                router.push('/servicios'); 
            } else {
                // Manejo de errores específicos de validación de Laravel
                setError(res.message || "Error al procesar la cita");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* Tarjeta de diseño centralizado */}
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                
                {/* Header con identidad visual ACAR Labs */}
                <div className="bg-[#003366] p-8 text-center text-white">
                    <div className="inline-block bg-white/10 p-3 rounded-2xl mb-3">
                        <svg className="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Reservar Cita</h1>
                    <p className="text-blue-200 text-sm mt-1 opacity-90">{clinicName}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-medium border border-red-100 animate-pulse">
                            {error}
                        </div>
                    )}

                    {/* Resumen del servicio seleccionado */}
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Clinica</span>
                        <p className="text-[#003366] font-bold text-lg leading-tight mt-1">{clinicName}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        {/* Selector de Fecha */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Fecha de la cita</label>
                            <input 
                                required
                                type="date" 
                                value={fecha}
                                min={new Date().toISOString().split('T')[0]} // Evita fechas pasadas
                                onChange={(e) => setFecha(e.target.value)}
                                className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700 font-medium"
                            />
                        </div>

                        {/* Selector de Hora */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Hora disponible</label>
                            <input 
                                required
                                type="time" 
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                                className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700 font-medium"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#003366] text-white font-extrabold py-4 rounded-2xl hover:bg-blue-900 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/30 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Procesando...
                                </>
                            ) : 'Confirmar Reservación'}
                        </button>

                        <button 
                            type="button"
                            onClick={() => router.back()}
                            className="w-full text-gray-400 text-sm font-bold py-2 hover:text-gray-600 transition-colors"
                        >
                            Cancelar solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}