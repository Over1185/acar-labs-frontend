/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Popup from '@/components/ui/Popup';

function CreateAppointmentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Datos recuperados de la URL (enviados desde el ServiceCard)
    const clinicName = searchParams.get('clinicName');
    const clinicId = searchParams.get('clinicId');
    const serviceId = searchParams.get('serviceId');
    const serviceName = searchParams.get('serviceName');

    // Estados del formulario
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    // Estado del Popup
    const [popup, setPopup] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        message: string;
    }>({
        isOpen: false,
        type: 'success',
        message: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Obtener ID del usuario al cargar
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.data?.id) {
                        setUserId(Number(data.data.id));
                    }
                }
            } catch (error) {
            }
        };
        fetchUser();
    }, [API_URL]);

    // Validación de seguridad: Si no hay ID de clínica o servicio, volvemos a servicios
    useEffect(() => {
        if (!clinicId || !serviceId) {
            router.push('/servicios');
        }
    }, [clinicId, serviceId, router]);

    const handleClosePopup = () => {
        setPopup(prev => ({ ...prev, isOpen: false }));
        if (popup.type === 'success') {
            router.push('/servicios');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Usamos el nombre de token que detectamos en tu localStorage
        const token = localStorage.getItem('auth_token');

        // Formato para tu API: "YYYY-MM-DD HH:mm:ss"
        const scheduledDate = `${fecha} ${hora}:00`;

        try {
            const body: any = {
                scheduled_date: scheduledDate,
                status: 'pending', // Dejamos el estado correcto para cuando el backend corrija sus reglas de validación
                clinic_id: Number(clinicId),
                service_id: Number(serviceId)
            };

            if (userId) {
                body.user_id = userId;
            }

            const response = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body),
            });

            const res = await response.json();

            if (response.ok) {
                setPopup({
                    isOpen: true,
                    type: 'success',
                    message: '¡Cita creada exitosamente! Pronto recibirás los detalles en tu correo.'
                });
            } else {
                // Mensajes de error en Español
                let errorMessage = "No se pudo agendar la cita.";

                if (res.errors) {
                    errorMessage = "Por favor verifica los datos enviados (fecha, hora o servicio).";
                } else if (res.message === 'Unauthenticated.') {
                    errorMessage = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
                } else {
                    errorMessage = "Ocurrió un error en el servidor. Intenta más tarde.";
                }

                setPopup({
                    isOpen: true,
                    type: 'error',
                    message: errorMessage
                });
            }
        } catch (err) {

            setPopup({
                isOpen: true,
                type: 'error',
                message: "Problema de conexión con el servidor. Verifica tu internet."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <Popup
                isOpen={popup.isOpen}
                type={popup.type}
                message={popup.message}
                onClose={handleClosePopup}
            />

            {/* Header con identidad visual ACAR Labs */}
            <div className="bg-[#003366] p-8 text-center text-white">
                <div className="inline-block bg-white/10 p-3 rounded-2xl mb-3">
                    <svg fill="none" stroke="currentColor" className="w-8 h-8 text-blue-200" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2" strokeWidth={2} /></svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Reservar Cita</h1>
                <p className="text-blue-200 text-sm mt-1 opacity-90">{clinicName}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Resumen del servicio seleccionado */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                    <div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Clinica</span>
                        <p className="text-[#003366] font-bold text-lg leading-tight mt-1">{clinicName}</p>
                    </div>
                    {serviceName && (
                        <div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Servicio</span>
                            <p className="text-[#003366] font-bold text-lg leading-tight mt-1">{serviceName}</p>
                        </div>
                    )}
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
    );
}

export default function CrearCitaPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 pt-20 md:pt-28">
            <Suspense fallback={
                <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Cargando formulario...</p>
                </div>
            }>
                <CreateAppointmentContent />
            </Suspense>
        </div>
    );
}