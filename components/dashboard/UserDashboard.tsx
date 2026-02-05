/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Appointment } from './types';
import { Plan } from './types_plans';
import Popup from '@/components/ui/Popup';

interface UserDashboardProps {
    user: User;
    onLogout: () => void;
}

type Tab = 'profile' | 'appointments' | 'plans' | 'results';

export default function UserDashboard({ user, onLogout }: UserDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [appointmentsError, setAppointmentsError] = useState('');
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // --- Popup State ---
    const [popup, setPopup] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'info'; message: string }>({
        isOpen: false,
        type: 'success',
        message: ''
    });

    const showPopup = (type: 'success' | 'error' | 'info', message: string) => {
        setPopup({ isOpen: true, type, message });
    };

    const closePopup = () => {
        setPopup({ ...popup, isOpen: false });
    };

    // --- Profile Form State ---
    const [profileForm, setProfileForm] = useState({
        name: user.name || '',
        email: user.email || '',
        password: '',
        newPassword: ''
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    // Sincronizar profileForm cuando el prop user cambia (ej: tras actualizar en el backend)
    useEffect(() => {
        setProfileForm(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || ''
        }));
    }, [user.name, user.email]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) throw new Error('No se encontró sesión activa.');

            const payload: { name: string; password?: string } = {
                name: profileForm.name,
            };

            // Solo enviar contraseña si el campo "Nueva Contraseña" tiene valor
            if (profileForm.newPassword) {
                // Nota: El backend actualmente documenta solo 'password' para la nueva contraseña.
                // Si se requiere validación de contraseña actual, se deberá ajustar.
                payload.password = profileForm.newPassword;
            }

            // Asumiendo ruta PUT /me/{user_id} según documentación BACKEND.md
            const response = await fetch(`${apiUrl}/me/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar el perfil');
            }

            // Actualización exitosa
            showPopup('success', 'Tu perfil ha sido actualizado correctamente.');
            // Limpiar campos de contraseña
            setProfileForm(prev => ({ ...prev, password: '', newPassword: '' }));

            // Notificar a otros componentes (Header) que el usuario se actualizó
            window.dispatchEvent(new Event('user-updated'));

        } catch (err: any) {
            showPopup('error', err.message || 'No se pudo actualizar el perfil.');
        }
    };

    const handleSelectPlan = (plan: Plan) => {
        showPopup('info', `Has seleccionado el plan "${plan.name}". Esta es una maqueta: el proceso de pago y registro de clínica no está activo en esta demo.`);
    };

    // --- Appointments Fetching ---
    useEffect(() => {
        if (activeTab === 'appointments') {
            fetchAppointments();
        } else if (activeTab === 'plans') {
            fetchPlans();
        }
    }, [activeTab]);

    const fetchPlans = async () => {
        setLoadingPlans(true);
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) throw new Error('No se encontró sesión activa.');

            const response = await fetch(`${apiUrl}/plans`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al cargar los planes');
            }

            const data = await response.json();
            setPlans(data.data || []);
        } catch (err: any) {
            showPopup('error', err.message || 'No se pudieron cargar los planes.');
        } finally {
            setLoadingPlans(false);
        }
    };

    const fetchAppointments = async () => {
        setLoadingAppointments(true);
        setAppointmentsError('');
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) throw new Error('No se encontró sesión activa.');

            const response = await fetch(`${apiUrl}/appointments/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Si el backend retorna 404 cuando no hay citas, lo tratamos como lista vacía (sin error)
                if (response.status === 404) {
                    setAppointments([]);
                    return;
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al cargar citas');
            }

            const data = await response.json();
            // Data structure from backend: { data: [...] }
            setAppointments(data.data || []);
        } catch (err: any) {
            setAppointments([]);
            showPopup('error', err.message || 'No se pudieron cargar tus citas.');
        } finally {
            setLoadingAppointments(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 pt-20 md:pt-24">
            {/* --- Sidebar Navigation --- */}
            <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-sm font-bold text-gray-900 truncate">{user.name}</h2>
                            <p className="text-xs text-gray-500 truncate">Paciente</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Mi Perfil
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Mis Citas
                    </button>
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'results' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Resultados
                    </button>
                    <button
                        onClick={() => setActiveTab('plans')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'plans' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        Planes / Clínicas
                    </button>
                </nav>

                <div className="p-4 mt-auto border-t border-gray-200">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main className="flex-1 p-4 md:p-8">

                {/* A. PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="max-w-2xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                            <p className="text-gray-500">Administra tu información personal y seguridad.</p>
                        </header>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileForm.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileForm.email}
                                                onChange={handleProfileChange}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                            <button type="button" className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors whitespace-nowrap">
                                                Verificar Correo
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 my-2 pt-4">
                                        <h3 className="text-sm font-medium text-gray-900 mb-4">Cambiar Contraseña</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={profileForm.password}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={profileForm.newPassword}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* B. APPOINTMENTS TAB */}
                {activeTab === 'appointments' && (
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
                                <p className="text-gray-500">Historial y próximas consultas médicas.</p>
                            </div>
                            <Link href="/servicios" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                                + Nueva Cita
                            </Link>
                        </header>

                        {loadingAppointments && (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {!loadingAppointments && appointments.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No tienes citas programadas</h3>
                                <p className="text-gray-500 mt-1 mb-6">Agenda tu primera cita con nuestros profesionales.</p>
                                <Link href="/clinicas" className="text-blue-600 font-medium hover:underline">Explorar clínicas &rarr;</Link>
                            </div>
                        )}

                        {!loadingAppointments && appointments.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                                            <th className="px-6 py-4">Fecha</th>
                                            <th className="px-6 py-4">Servicio</th>
                                            <th className="px-6 py-4">Clínica</th>
                                            <th className="px-6 py-4">Profesional</th>
                                            <th className="px-6 py-4">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {appointments.map((apt) => (
                                            <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {new Date(apt.scheduled_date).toLocaleDateString()}
                                                    <span className="block text-xs text-gray-500 font-normal mt-0.5">
                                                        {new Date(apt.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {apt.service?.name || 'Servicio General'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {apt.clinic?.name || 'Clínica Principal'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {apt.employee?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                        ${apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                                                        ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                                        ${apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                                    `}>
                                                        {apt.status === 'scheduled' ? 'Agendada' : apt.status === 'completed' ? 'Completada' : 'Cancelada'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* C. PLANS / REGISTER TAB */}
                {activeTab === 'plans' && (
                    <div className="max-w-4xl mx-auto animate-fade-in">
                        <header className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-900">Planes para Profesionales</h1>
                            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">¿Eres profesional de la salud? Crea tu propia clínica digital y gestiona tus pacientes con nosotros.</p>
                        </header>

                        {loadingPlans ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {plans.map((plan) => (
                                    <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow flex flex-col relative overflow-hidden">
                                        {plan.name.toLowerCase().includes('enterprise') && (
                                            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                                                Recomendado
                                            </div>
                                        )}
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                            <div className="mt-2 flex items-baseline gap-1">
                                                <span className="text-3xl font-extrabold text-gray-900">${plan.price}</span>
                                                <span className="text-gray-500">/{plan.billing_cycle === 'yearly' ? 'año' : 'mes'}</span>
                                            </div>
                                        </div>

                                        <ul className="space-y-3 mb-8 flex-grow">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => handleSelectPlan(plan)}
                                            className="w-full py-3 bg-[#003366] text-white rounded-xl font-semibold hover:bg-[#004080] transition-colors shadow-md"
                                        >
                                            Contratar Plan
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* D. RESULTS TAB */}
                {activeTab === 'results' && (
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Mis Resultados</h1>
                            <p className="text-gray-500">Resultados de laboratorio y exámenes médicos.</p>
                        </header>
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No hay resultados disponibles</h3>
                            <p className="text-gray-500 mt-2">Tus resultados de laboratorio aparecerán aquí una vez que estén listos.</p>
                        </div>
                    </div>
                )}
            </main>

            <Popup
                isOpen={popup.isOpen}
                type={popup.type}
                message={popup.message}
                onClose={closePopup}
            />
        </div>
    );
}
