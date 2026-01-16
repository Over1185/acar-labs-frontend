'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Clinic {
    id: number;
    name: string;
    status: string;
    address?: {
        province: string;
        country: string;
        city: string;
        canton: string;
    };
    employees?: {
        id: number;
        role: string;
    }
}

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface Appointment {
    id: number;
    patient_name: string;
    date: string;
    time: string;
    service: string;
    status: string;
    [key: string]: any;
}

interface LabResult {
    id: number;
    name: string;
    date: string;
    status: string;
    [key: string]: any;
}

interface Invoice {
    id: number;
    number: string;
    date: string;
    total: number;
    status: string;
    [key: string]: any;
}

type Tab = 'citas' | 'servicios' | 'laboratorio' | 'facturas';

export default function ClinicDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const clinicId = params.id;

    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [labResults, setLabResults] = useState<LabResult[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('citas');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchClinicData = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const clinicIdNumber = Number(clinicId);

                // Step 1: Select clinic (this generates a new token with clinic_id)
                const selectRes = await fetch(`${apiUrl}/select-clinic`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clinic_id: clinicIdNumber,
                    }),
                });

                if (!selectRes.ok) {
                    const errorData = await selectRes.json();
                    throw new Error(errorData.message || 'Error al seleccionar la clínica');
                }

                const selectData = await selectRes.json();
                
                // Update token and store clinic info
                if (selectData.access_token) {
                    localStorage.setItem('auth_token', selectData.access_token);
                    localStorage.setItem('clinic_id', selectData.clinic_id?.toString() || clinicIdNumber.toString());
                    localStorage.setItem('clinic_role', selectData.role || '');
                }

                const newToken = selectData.access_token || token;

                // Step 2: Get user data with new token to get clinic info with services
                const userRes = await fetch(`${apiUrl}/me`, {
                    headers: {
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (userRes.ok) {
                    const userData = await userRes.json();
                    const user = userData.data || userData;
                    
                    // Find the clinic from user's employees
                    if (user.employees && Array.isArray(user.employees)) {
                        const clinicEmployee = user.employees.find(
                            (emp: any) => emp.clinic_id === clinicIdNumber
                        );
                        
                        if (clinicEmployee && clinicEmployee.clinic) {
                            setClinic(clinicEmployee.clinic);
                            
                            // Set user role from clinicEmployee
                            if (clinicEmployee.role) {
                                setUserRole(clinicEmployee.role.name || '');
                            }

                            // Extract services
                            if (clinicEmployee.clinic.services) {
                                setServices(clinicEmployee.clinic.services.map((s: any) => ({
                                    ...s,
                                    price: typeof s.price === 'string' ? parseFloat(s.price) : s.price
                                })));
                            }
                        } else {
                            throw new Error('Clínica no encontrada');
                        }
                    }
                } else {
                    throw new Error('Error al cargar los datos del perfil');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        if (clinicId) {
            fetchClinicData();
        }
    }, [clinicId, router]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a1929] flex">
            {/* Sidebar - Full Height */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-24'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col`}>
                <div className="p-4 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center p-3 rounded-lg bg-[#003366] hover:bg-[#00509e] dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
                    >
                        <svg className={`w-6 h-6 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('citas')}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${
                            activeTab === 'citas'
                                ? 'bg-[#003366] text-white dark:bg-blue-600'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={!sidebarOpen ? 'Citas' : ''}
                    >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {sidebarOpen && <span>Citas</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('servicios')}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${
                            activeTab === 'servicios'
                                ? 'bg-[#003366] text-white dark:bg-blue-600'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={!sidebarOpen ? 'Servicios' : ''}
                    >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0A5 5 0 017 12z" />
                        </svg>
                        {sidebarOpen && <span>Servicios</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('laboratorio')}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${
                            activeTab === 'laboratorio'
                                ? 'bg-[#003366] text-white dark:bg-blue-600'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={!sidebarOpen ? 'Laboratorio' : ''}
                    >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.452a6 6 0 00-3.86.454l-.312.049a6 6 0 00-3.86-.454l-2.387.452a2 2 0 00-1.022.547m19.5-3.757l-23.5 3.757" />
                        </svg>
                        {sidebarOpen && <span>Laboratorio</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('facturas')}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${
                            activeTab === 'facturas'
                                ? 'bg-[#003366] text-white dark:bg-blue-600'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        title={!sidebarOpen ? 'Facturas' : ''}
                    >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {sidebarOpen && <span>Facturas</span>}
                    </button>
                </nav>

                {/* Close Button at Bottom */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <button
                        onClick={() => window.close()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
                        title={!sidebarOpen ? 'Cerrar' : ''}
                    >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {sidebarOpen && <span>Cerrar</span>}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Professional Clinic Header */}
                <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#00509e] dark:from-slate-900 dark:via-blue-900 dark:to-slate-800 text-white flex-shrink-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">{clinic?.name}</h1>
                                <p className="text-blue-100 text-lg">Laboratorio de Análisis Clínicos</p>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-bold text-blue-200 opacity-20">
                                    {clinic?.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                        
                        {/* Clinic Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-blue-100 text-sm">ROL</p>
                                </div>
                                <p className="text-white text-xl font-semibold">{userRole || 'Sin asignar'}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-blue-100 text-sm">Estado</p>
                                </div>
                                <p className="text-white text-xl font-semibold">
                                    {clinic?.status === 'active' ? 'Activa' : 'Pendiente'}
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-blue-100 text-sm">Atención</p>
                                </div>
                                <p className="text-white text-xl font-semibold">24/7</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {/* Tab Content */}
                        <div className="mt-8">
                            {/* Citas Tab */}
                            {activeTab === 'citas' && (
                        <div>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Citas Agendadas</h2>
                                <p className="text-gray-600 dark:text-gray-400">Gestiona todas tus citas y appointments</p>
                            </div>

                            {appointments.length > 0 ? (
                                <div className="grid gap-6">
                                    {appointments.map((appointment) => (
                                        <div
                                            key={appointment.id}
                                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {appointment.patient_name}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                        {appointment.service}
                                                    </p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                    appointment.status === 'confirmed'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                        : appointment.status === 'pending'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                                }`}>
                                                    {appointment.status === 'confirmed' ? 'Confirmada' : appointment.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                                                </span>
                                            </div>
                                            <div className="flex gap-6 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {appointment.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {appointment.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-12 text-center border-2 border-dashed border-blue-200 dark:border-blue-800">
                                    <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">No hay citas agendadas</p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Agenda tu primera cita ahora</p>
                                </div>
                            )}
                            </div>
                        )}

                        {/* Servicios Tab */}
                        {activeTab === 'servicios' && (
                            <div>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Servicios Disponibles</h2>
                                <p className="text-gray-600 dark:text-gray-400">Todos los análisis y servicios que ofrecemos</p>
                            </div>

                            {services.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg hover:border-[#003366] dark:hover:border-blue-500 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <svg className="w-6 h-6 text-[#003366] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </div>
                                                <span className="text-2xl font-bold text-[#003366] dark:text-blue-400">
                                                    ${service.price.toFixed(2)}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                                                {service.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                                {service.description}
                                            </p>
                                            <button className="w-full bg-[#003366] hover:bg-[#00509e] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                                                Agendar Cita
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-12 text-center border-2 border-dashed border-blue-200 dark:border-blue-800">
                                    <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0A5 5 0 017 12z" />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">No hay servicios disponibles</p>
                                </div>
                            )}
                            </div>
                        )}

                        {/* Laboratorio Tab */}
                        {activeTab === 'laboratorio' && (
                            <div>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Resultados de Laboratorio</h2>
                                <p className="text-gray-600 dark:text-gray-400">Consulta los resultados de tus análisis</p>
                            </div>

                            {labResults.length > 0 ? (
                                <div className="grid gap-6">
                                    {labResults.map((result) => (
                                        <div
                                            key={result.id}
                                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                        {result.name}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        Fecha: {result.date}
                                                    </p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                    result.status === 'ready'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                                }`}>
                                                    {result.status === 'ready' ? 'Disponible' : 'En Proceso'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-12 text-center border-2 border-dashed border-blue-200 dark:border-blue-800">
                                    <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.452a6 6 0 00-3.86.454l-.312.049a6 6 0 00-3.86-.454l-2.387.452a2 2 0 00-1.022.547m19.5-3.757l-23.5 3.757" />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">No hay resultados disponibles</p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Los resultados aparecerán aquí cuando estén listos</p>
                                </div>
                            )}
                            </div>
                        )}

                        {/* Facturas Tab */}
                        {activeTab === 'facturas' && (
                            <div>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Facturas</h2>
                                <p className="text-gray-600 dark:text-gray-400">Descarga tus recibos y facturas</p>
                            </div>

                            {invoices.length > 0 ? (
                                <div className="grid gap-6">
                                    {invoices.map((invoice) => (
                                        <div
                                            key={invoice.id}
                                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Factura #{invoice.number}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                        Fecha: {invoice.date}
                                                    </p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                                    invoice.status === 'paid'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                                }`}>
                                                    {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    ${invoice.total.toFixed(2)}
                                                </span>
                                                <button className="flex items-center gap-2 bg-[#003366] hover:bg-[#00509e] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Descargar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-12 text-center border-2 border-dashed border-blue-200 dark:border-blue-800">
                                    <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">No hay facturas disponibles</p>
                                </div>
                            )}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
