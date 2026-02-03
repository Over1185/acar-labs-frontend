/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CitasTab, { Appointment } from '@/components/ui/CitasTab';
import ServiciosTab from '@/components/ui/ServiciosTab';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    employees?: Array<{
        id: number;
        user_id: number;
        clinic_id: number;
        role_id: number;
        status: string;
        clinic: Clinic;
        role: {
            id: number;
            name: string;
        };
    }>;
}

interface Clinic {
    id: number;
    name: string;
    status: string;
    ruc?: string;
    address?: {
        province: string;
        country: string;
        city: string;
        canton: string;
    };
    services?: any[];
    employees?: any[]; // Full employee list for clinic view
}

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
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

type DashboardView = 'profile' | 'personal-appointments' | 'results' | 'invoices' | 'clinic-dashboard';
type ClinicTab = 'home' | 'citas' | 'servicios' | 'laboratorio' | 'facturas' | 'empleados';

export default function UnifiedDashboardPage() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // --- Global State ---
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // --- Navigation State ---
    const [currentView, setCurrentView] = useState<DashboardView>('profile');
    const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);

    // --- Clinic Specific State (Loaded when a clinic is selected) ---
    const [clinicData, setClinicData] = useState<Clinic | null>(null);
    const [clinicRole, setClinicRole] = useState<string | null>(null);
    const [activeClinicTab, setActiveClinicTab] = useState<ClinicTab>('home');

    const [clinicServices, setClinicServices] = useState<Service[]>([]);
    const [clinicAppointments, setClinicAppointments] = useState<Appointment[]>([]);
    const [clinicResults, setClinicResults] = useState<LabResult[]>([]);
    const [clinicInvoices, setClinicInvoices] = useState<Invoice[]>([]);

    // Search State for Employees
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Initial User Fetch
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${apiUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('auth_token');
                    router.push('/login');
                }
                throw new Error('Error al cargar el perfil');
            }

            const data = await response.json();
            setUser(data.data || data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Triggered when a clinic is selected from sidebar
    const handleSelectClinic = async (clinicId: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            // 1. Select Clinic / Get Token
            const selectRes = await fetch(`${apiUrl}/select-clinic`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clinic_id: clinicId }),
            });

            if (!selectRes.ok) throw new Error('Error al seleccionar clínica');

            const selectData = await selectRes.json();
            const newToken = selectData.access_token || token;

            // Store specific clinic context if needed, though we try to stay stateless if possible.
            // But for detailed calls we might need this scoped token.

            // 2. Fetch Clinic Details with new token (if needed) or just reuse user data if enough
            // Re-fetching "me" with new token often gives more clinic-specific details in "employees" or relationships
            const userRes = await fetch(`${apiUrl}/me`, {
                headers: { 'Authorization': `Bearer ${newToken}` }
            });

            if (userRes.ok) {
                const userData = await userRes.json();
                const freshUser = userData.data || userData;
                // Find the specific clinic data in the fresh user object
                const employeeRecord = freshUser.employees?.find((e: any) => e.clinic_id === clinicId);

                if (employeeRecord) {
                    setClinicData(employeeRecord.clinic);
                    setClinicRole(employeeRecord.role?.name || '');

                    if (employeeRecord.clinic.services) {
                        setClinicServices(employeeRecord.clinic.services.map((s: any) => ({
                            ...s,
                            price: typeof s.price === 'string' ? parseFloat(s.price) : s.price
                        })));
                    }

                    // 3. Fetch specific lists (Employees, etc) that might require the scoped token
                    // Fetch Employees
                    try {
                        const empRes = await fetch(`${apiUrl}/employees`, {
                            headers: { 'Authorization': `Bearer ${newToken}` }
                        });
                        if (empRes.ok) {
                            const empData = await empRes.json();
                            const emps = empData.data || empData;
                            setClinicData(prev => prev ? { ...prev, employees: Array.isArray(emps) ? emps : [] } : null);
                        }
                    } catch (e) { console.error("Error fetching employees", e); }

                    // Fetch Appointments (Mock for now, or real endpoint if exists)
                    // const apptRes = await fetch(`${apiUrl}/appointments`, ...)
                }
            }

            setSelectedClinicId(clinicId);
            setCurrentView('clinic-dashboard');
            setActiveClinicTab('home');

        } catch (err) {
            console.error(err);
            alert("No se pudo cargar la información de la clínica");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchUser = async () => {
        if (!searchEmail) return;
        setSearchLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${apiUrl}/employees/search?email=${searchEmail}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setSearchResults(data.data || []);
        } catch (e) {
            console.error('Error buscando usuarios');
        } finally {
            setSearchLoading(false);
        }
    };

    // --- Render Helpers ---

    if (loading && !user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#003366]/20 border-t-[#003366] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* --- SIDEBAR --- */}
            <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-20 pt-16 md:pt-20`}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between h-16">
                    {sidebarOpen && <span className="text-xl font-bold text-[#003366]">ACAR Labs</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                    {/* 1. Personal Menu */}
                    <div>
                        {sidebarOpen && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Personal</p>}
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => { setCurrentView('profile'); setSelectedClinicId(null); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'profile' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    {sidebarOpen && <span>Mi Perfil</span>}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => { setCurrentView('personal-appointments'); setSelectedClinicId(null); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'personal-appointments' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {sidebarOpen && <span>Mis Citas</span>}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => { setCurrentView('results'); setSelectedClinicId(null); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${currentView === 'results' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    {sidebarOpen && <span>Resultados</span>}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* 2. Clinics Menu (If Employee) */}
                    {user?.employees && user.employees.length > 0 && (
                        <div>
                            {sidebarOpen && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Mis Clínicas</p>}
                            <ul className="space-y-1">
                                {user.employees.map((emp) => (
                                    <li key={emp.clinic.id}>
                                        <button
                                            onClick={() => handleSelectClinic(emp.clinic.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${selectedClinicId === emp.clinic.id ? 'bg-[#003366] text-white font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center shrink-0 border border-current">
                                                <span className="text-[10px] font-bold uppercase">{emp.clinic.name.charAt(0)}</span>
                                            </div>
                                            {sidebarOpen && <span className="truncate">{emp.clinic.name}</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer User Info */}
                <div className="p-4 border-t border-gray-200">
                    <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-[#003366] text-white flex items-center justify-center font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        {sidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'} p-8 pt-24 md:pt-28`}>

                {/* VIEW: PROFILE */}
                {currentView === 'profile' && (
                    <div className="max-w-3xl mx-auto animate-fade-in">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                                    {user?.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                                    <p className="text-gray-500">{user?.email}</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user?.is_active ? 'Cuenta Activa' : 'Inactiva'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Miembro desde</label>
                                    <p className="text-gray-900 font-medium mt-1">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                {/* Additional fields can go here */}
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW: PERSONAL APPOINTMENTS */}
                {currentView === 'personal-appointments' && (
                    <div className="max-w-5xl mx-auto animate-fade-in">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
                            <Link href="/clinicas" className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors text-sm font-medium">
                                Buscar Clínica
                            </Link>
                        </div>
                        {/* Placeholder for Appointments List */}
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No tienes citas próximas</h3>
                            <p className="text-gray-500 mt-2 max-w-sm mx-auto">Explora nuestras clínicas y agenda tu próxima cita médica de forma rápida y segura.</p>
                        </div>
                    </div>
                )}

                {/* VIEW: CLINIC MANAGEMENT DASHBOARD */}
                {currentView === 'clinic-dashboard' && clinicData && (
                    <div className="animate-fade-in">
                        {/* Clinic Header */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{clinicData.name}</h2>
                                <p className="text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">{clinicRole}</span>
                                    {clinicData.address?.city}, {clinicData.address?.province}
                                </p>
                            </div>

                            {/* Dashboard Navigation Tabs */}
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                {['home', 'citas', 'servicios', 'empleados', 'facturas'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveClinicTab(tab as ClinicTab)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeClinicTab === tab
                                            ? 'bg-white text-[#003366] shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clinic Tab Content */}
                        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 min-h-[500px] p-6">
                            {activeClinicTab === 'home' && (
                                <div className="text-center py-20">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Panel General</h3>
                                    <p className="text-gray-500">Bienvenido al panel de gestión de {clinicData.name}. Selecciona una pestaña para comenzar.</p>
                                </div>
                            )}

                            {activeClinicTab === 'citas' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">Agenda de Citas</h3>
                                        <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">Actualizar</button>
                                    </div>
                                    <CitasTab appointments={clinicAppointments} />
                                </div>
                            )}

                            {activeClinicTab === 'servicios' && (
                                <ServiciosTab services={clinicServices} />
                            )}

                            {/* Implement other tabs as needed (Empleados, Facturas) reuse logic from copy if needed */}
                            {activeClinicTab === 'empleados' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Equipo de Trabajo</h3>
                                        {clinicRole === 'OWNER' && (
                                            <button className="px-4 py-2 bg-[#003366] text-white rounded-lg text-sm">Agregar Empleado</button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {clinicData.employees?.map((emp: any) => (
                                            <div key={emp.id} className="p-4 border border-gray-200 rounded-xl flex gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                                    {emp.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{emp.name || emp.user?.name}</p>
                                                    <p className="text-xs text-gray-500">{emp.role?.name || 'Empleado'}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(!clinicData.employees || clinicData.employees.length === 0) && (
                                            <p className="text-gray-500 col-span-full text-center py-8">No hay empleados registrados visiblemente.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}