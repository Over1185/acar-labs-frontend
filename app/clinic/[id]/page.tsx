'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ServiciosTab from './components/ServiciosTab';
import CitasTab from './components/CitasTab';

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
    employees?: Array<{
        id: number;
        user_id?: number;
        role_id?: number;
        status?: string;
        user?: {
            id: number;
            name: string;
            email: string;
        };
        role?: {
            id: number;
            name: string;
        };
        name?: string;
        email?: string;
        specialty?: string;
        phone?: string;
    }>;
    services?: any[];
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

interface UserSearchResult {
    id: number;
    name: string;
    email: string;
}

type Tab = 'home' | 'citas' | 'servicios' | 'laboratorio' | 'facturas' | 'empleados';

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
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

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

                            // Set initial clinic data
                            setClinic(clinicEmployee.clinic);

                            // Fetch employees from /employees endpoint
                            try {
                                const employeesRes = await fetch(`${apiUrl}/employees`, {
                                    headers: {
                                        'Authorization': `Bearer ${newToken}`,
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (employeesRes.ok) {
                                    const employeesData = await employeesRes.json();
                                    const employees = employeesData.data || employeesData;

                                    // Update clinic with employees
                                    setClinic((prev) => {
                                        const updated = prev ? { ...prev, employees: Array.isArray(employees) ? employees : [employees] } : null;
                                        return updated;
                                    });
                                } else {
                                    console.log('Error fetching employees');
                                }
                            } catch (err) {
                                console.log('Error in employees fetch:', err);
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

    const handleSearchUser = async () => {
        if (!searchEmail) return;

        setSearchLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(`${apiUrl}/employees/search?email=${searchEmail}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setSearchResults(data.data || []);
        } catch (e) {
            console.log('Error buscando usuarios');
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar - Full Height */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-24'} transition-all duration-300 bg-white border-r border-gray-200 overflow-y-auto flex flex-col`}>
                <div className="p-4 sticky top-0 bg-white z-10 border-b border-gray-200">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center p-3 rounded-lg bg-[#003366] hover:bg-[#00509e] text-white transition-colors"
                    >
                        <svg className={`w-6 h-6 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${activeTab === 'home'
                            ? 'bg-[#003366] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        title={!sidebarOpen ? 'Home' : ''}
                    >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 9l9-18" />
                        </svg>
                        {sidebarOpen && <span>Home</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('citas')}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${activeTab === 'citas'
                            ? 'bg-[#003366] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
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
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${activeTab === 'servicios'
                            ? 'bg-[#003366] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
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
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${activeTab === 'laboratorio'
                            ? 'bg-[#003366] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
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
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${activeTab === 'facturas'
                            ? 'bg-[#003366] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        title={!sidebarOpen ? 'Facturas' : ''}
                    >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {sidebarOpen && <span>Facturas</span>}
                    </button>

                    {userRole === 'OWNER' && (
                        <button
                            onClick={() => setActiveTab('empleados')}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all font-medium ${activeTab === 'empleados'
                                ? 'bg-[#003366] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            title={!sidebarOpen ? 'Empleados' : ''}
                        >
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM18.5 20H20v-2a3 3 0 00-.5-1.5M5 20v-2a3 3 0 015.856-1.487M7 10a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {sidebarOpen && <span>Empleados</span>}
                        </button>
                    )}

                </nav>

                {/* Close Button at Bottom */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={() => window.close()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
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
                <div className="bg-gradient-to-r from-[#003366] via-[#004080] to-[#00509e] text-white flex-shrink-0">
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
                            {/* Home Tab */}
                            {activeTab === 'home' && (
                                <div>
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                                        <p className="text-gray-600">Estadísticas y resumen de tu laboratorio</p>
                                    </div>

                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-blue-600">Total de Citas</p>
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
                                            <p className="text-xs text-gray-600 mt-2">Este mes</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-green-600">Servicios Activos</p>
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 12a5 5 0 1110 0A5 5 0 017 12z" />
                                                </svg>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{services.length}</p>
                                            <p className="text-xs text-gray-600 mt-2">Disponibles</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-purple-600">Resultados Procesados</p>
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.452a6 6 0 00-3.86.454l-.312.049a6 6 0 00-3.86-.454l-2.387.452a2 2 0 00-1.022.547m19.5-3.757l-23.5 3.757" />
                                                </svg>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{labResults.length}</p>
                                            <p className="text-xs text-gray-600 mt-2">Pendientes</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-orange-600">Facturas Pendientes</p>
                                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-3xl font-bold text-gray-900">{invoices.filter(inv => inv.status !== 'paid').length}</p>
                                            <p className="text-xs text-gray-600 mt-2">Por pagar</p>
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Clínica</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Nombre:</span>
                                                    <span className="font-semibold text-gray-900">{clinic?.name}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Estado:</span>
                                                    <span className={`inline-flex items-center gap-2 font-semibold ${clinic?.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        <span className={`w-2 h-2 rounded-full ${clinic?.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}`}></span>
                                                        {clinic?.status === 'active' ? 'Activa' : 'Pendiente'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Tu Rol:</span>
                                                    <span className="font-semibold text-gray-900">{userRole || 'Sin asignar'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasa de Finalización</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-gray-600">Citas Completadas</span>
                                                        <span className="font-semibold text-gray-900">92%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-gray-600">Resultados Procesados</span>
                                                        <span className="font-semibold text-gray-900">78%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-gray-600">Facturas Pagadas</span>
                                                        <span className="font-semibold text-gray-900">85%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Citas Tab */}
                            {activeTab === 'citas' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                                Gestión de Citas
                                            </h2>
                                            
                                            <p className="text-gray-600">
                                                Administra las solicitudes y agenda de {clinic?.name}
                                            </p>
                                        </div>

                                        {/* Botón opcional por si quieres agregar funcionalidad de crear cita luego */}
                                        <button className="inline-flex items-center justify-center px-5 py-2.5 bg-[#003366] text-white font-medium rounded-lg hover:bg-[#00509e] transition-colors shadow-sm">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Nueva Cita
                                        </button>
                                    </div>

                                    <CitasTab appointments={appointments} />
                                </div>
                            )}

                            {/* Servicios Tab */}
                            {activeTab === 'servicios' && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                            Nuestros Servicios
                                        </h2>
                                        <p className="text-gray-600">
                                            Gestión de exámenes y análisis disponibles en {clinic?.name}
                                        </p>
                                    </div>
                                    <ServiciosTab services={services} />
                                </div>
                            )}

                            {/* Laboratorio Tab */}
                            {activeTab === 'laboratorio' && (
                                <div>
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Resultados de Laboratorio</h2>
                                        <p className="text-gray-600">Consulta los resultados de tus análisis</p>
                                    </div>

                                    {labResults.length > 0 ? (
                                        <div className="grid gap-6">
                                            {labResults.map((result) => (
                                                <div
                                                    key={result.id}
                                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                {result.name}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm">
                                                                Fecha: {result.date}
                                                            </p>
                                                        </div>
                                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${result.status === 'ready'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {result.status === 'ready' ? 'Disponible' : 'En Proceso'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 rounded-lg p-12 text-center border-2 border-dashed border-blue-200">
                                            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.452a6 6 0 00-3.86.454l-.312.049a6 6 0 00-3.86-.454l-2.387.452a2 2 0 00-1.022.547m19.5-3.757l-23.5 3.757" />
                                            </svg>
                                            <p className="text-gray-600 text-lg">No hay resultados disponibles</p>
                                            <p className="text-gray-500 text-sm mt-2">Los resultados aparecerán aquí cuando estén listos</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Empleados Tab */}

                            {activeTab === 'empleados' && userRole === 'OWNER' && (
                                <div>
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Empleados</h2>
                                        <p className="text-gray-600">Administra los empleados de tu clínica</p>
                                    </div>

                                    {clinic?.employees && clinic.employees.length > 0 ? (
                                        <div className="grid gap-6">
                                            {clinic.employees.map((employee: any) => (
                                                <div
                                                    key={employee.id}
                                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900">
                                                                    {employee.user?.name || 'Empleado'}
                                                                </h3>
                                                                <p className="text-gray-600 text-sm">
                                                                    {employee.user?.email || 'Sin email'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                                            {employee.role?.name || 'Sin rol'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                                                        <div>
                                                            <p className="text-xs text-gray-600 mb-1">Estado</p>
                                                            <p className="font-semibold text-gray-900 text-sm">
                                                                {employee.status === 'active' ? '✓ Activo' : employee.status === 'rejected' ? '✕ rechazada' : employee.status === 'pending' ? '⏳ Pendiente' : 'Sin estado'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600 mb-1">Especialidad</p>
                                                            <p className="font-semibold text-gray-900 text-sm">{employee.specialty || 'General'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600 mb-1">Teléfono</p>
                                                            <p className="font-semibold text-gray-900 text-sm">{employee.phone || '-'}</p>
                                                        </div>
                                                        <div className="flex items-end gap-2">
                                                            <button className="flex-1 bg-[#003366] hover:bg-[#00509e] text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm">
                                                                Editar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 rounded-lg p-12 text-center border-2 border-dashed border-blue-200">
                                            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM18.5 20H20v-2a3 3 0 00-.5-1.5M5 20v-2a3 3 0 015.856-1.487M7 10a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-gray-600 text-lg">No hay empleados registrados</p>
                                            <button className="mt-4 bg-[#003366] hover:bg-[#00509e] text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                                                Agregar Empleado
                                            </button>
                                        </div>
                                    )}
                                    {/* Agregar Empleado */}
                                    <div className="mb-10 bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                                            Agregar empleado
                                        </h3>

                                        <div className="flex gap-4">
                                            <input
                                                type="email"
                                                placeholder="Correo del usuario"
                                                value={searchEmail}
                                                onChange={(e) => setSearchEmail(e.target.value)}
                                                className="flex-1 px-4 py-2 border rounded-lg"
                                            />
                                            <button
                                                onClick={handleSearchUser}
                                                className="bg-[#003366] hover:bg-[#00509e] text-white px-6 rounded-lg"
                                            >
                                                Buscar
                                            </button>
                                        </div>

                                        {/* Resultados */}
                                        <div className="mt-6 space-y-4">
                                            {searchLoading && <p>Buscando...</p>}

                                            {searchResults.map(user => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center justify-between border p-4 rounded-lg"
                                                >
                                                    <div>
                                                        <p className="font-semibold">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                    <button
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Invitar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            )}

                            {/* Facturas Tab */}
                            {activeTab === 'facturas' && (
                                <div>
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Facturas</h2>
                                        <p className="text-gray-600">Descarga tus recibos y facturas</p>
                                    </div>

                                    {invoices.length > 0 ? (
                                        <div className="grid gap-6">
                                            {invoices.map((invoice) => (
                                                <div
                                                    key={invoice.id}
                                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                Factura #{invoice.number}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm mt-1">
                                                                Fecha: {invoice.date}
                                                            </p>
                                                        </div>
                                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${invoice.status === 'paid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-2xl font-bold text-gray-900">
                                                            ${invoice.total.toFixed(2)}
                                                        </span>
                                                        <button className="flex items-center gap-2 bg-[#003366] hover:bg-[#00509e] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
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
                                        <div className="bg-blue-50 rounded-lg p-12 text-center border-2 border-dashed border-blue-200">
                                            <svg className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-600 text-lg">No hay facturas disponibles</p>
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