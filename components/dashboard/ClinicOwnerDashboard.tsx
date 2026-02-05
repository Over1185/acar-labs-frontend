/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
    User,
    Settings,
    LogOut,
    Users,
    Activity,
    Plus,
    Trash2,
    Mail,
    Building,
    Stethoscope
} from 'lucide-react';
import { User as UserType, Clinic, Service } from './types'; // Removed Appointment if unused
import Popup from '../ui/Popup';

interface DashboardProps {
    user: UserType;
    onLogout: () => void;
}

type Tab = 'overview' | 'employees' | 'services' | 'settings' | 'profile';

export default function ClinicOwnerDashboard({ user, onLogout }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [popup, setPopup] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Data States
    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [employees, setEmployees] = useState<any[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal States
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', role: 'DOCTOR' });

    const [showServiceModal, setShowServiceModal] = useState(false);
    const [serviceData, setServiceData] = useState({
        name: '', description: '', price: '', estimated_time: '', is_active: true
    });
    const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    // Derived
    const myClinic = user.employees?.[0]?.clinic;
    const clinicId = myClinic?.id;

    useEffect(() => {
        if (myClinic) setClinic(myClinic);
    }, [myClinic]);

    useEffect(() => {
        if (clinicId) {
            if (activeTab === 'employees') {
                fetchEmployees();
                fetchPendingInvitations();
            } else if (activeTab === 'services') {
                fetchServices();
            }
        }
    }, [activeTab, clinicId]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const showPopup = (type: 'success' | 'error', message: string) => {
        setPopup({ type, message });
        setTimeout(() => setPopup(null), 3000);
    };

    // --- FETCHER FUNCTIONS ---
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/employees`, { headers: getAuthHeaders() });
            const data = await res.json();
            setEmployees(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingInvitations = async () => {
        try {
            const res = await fetch(`${apiUrl}/employees/pending`, { headers: getAuthHeaders() });
            const data = await res.json();
            setPendingInvitations(data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchServices = async () => {
        setLoading(true);
        try {
            // Usually /clinics/{id}/services or just /services if scoped to user's clinic context
            const res = await fetch(`${apiUrl}/services`, { headers: getAuthHeaders() });
            const data = await res.json();
            setServices(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- ACTIONS ---

    const handleInviteEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${apiUrl}/employees/invite`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(inviteData)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Error al invitar');
            }

            showPopup('success', 'Invitación enviada');
            setShowInviteModal(false);
            setInviteData({ email: '', role: 'DOCTOR' });
            fetchPendingInvitations();
        } catch (err: any) {
            showPopup('error', err.message);
        }
    };

    const handleCancelInvitation = async (id: number) => {
        if (!confirm('¿Estás seguro de cancelar esta invitación?')) return;
        try {
            const res = await fetch(`${apiUrl}/employees/${id}/cancel-invitation`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Error al cancelar');
            showPopup('success', 'Invitación cancelada');
            fetchPendingInvitations();
        } catch (err) {
            showPopup('error', 'No se pudo cancelar la invitación');
        }
    };

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingServiceId ? 'PUT' : 'POST';
            const url = editingServiceId
                ? `${apiUrl}/services/${editingServiceId}`
                : `${apiUrl}/services`;

            const body = {
                clinic_id: clinicId, // Ensure we send clinic_id if required
                ...serviceData,
                price: parseFloat(serviceData.price),
                estimated_time: parseInt(serviceData.estimated_time)
            };

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Error al guardar servicio');

            showPopup('success', editingServiceId ? 'Servicio actualizado' : 'Servicio creado');
            setShowServiceModal(false);
            setEditingServiceId(null);
            setServiceData({ name: '', description: '', price: '', estimated_time: '', is_active: true });
            fetchServices();
        } catch (err) {
            showPopup('error', 'Falló la operación');
        }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm('¿Eliminar este servicio?')) return;
        try {
            const res = await fetch(`${apiUrl}/services/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Error al eliminar');
            showPopup('success', 'Servicio eliminado');
            fetchServices();
        } catch (err) {
            showPopup('error', 'No se pudo eliminar');
        }
    };

    const handleOpenEditService = (svc: Service) => {
        setEditingServiceId(svc.id);
        setServiceData({
            name: svc.name,
            description: svc.description,
            price: svc.price.toString(),
            estimated_time: svc.estimated_time.toString(),
            is_active: svc.is_active
        });
        setShowServiceModal(true);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {popup && <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} isOpen={false} />}

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <Building className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <span className="font-bold text-gray-800 block text-sm">Portal Dueño</span>
                            <span className="text-xs text-indigo-600 font-medium truncate w-[140px] block" title={clinic?.name}>
                                {clinic?.name || 'Mi Clínica'}
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Activity className="h-5 w-5" /> Resumen
                    </button>
                    <button onClick={() => setActiveTab('employees')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'employees' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Users className="h-5 w-5" /> Personal
                    </button>
                    <button onClick={() => setActiveTab('services')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'services' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Stethoscope className="h-5 w-5" /> Servicios
                    </button>
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <User className="h-5 w-5" /> Mi Cuenta
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                        <LogOut className="h-4 w-4" /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeTab === 'overview' && 'Panel General'}
                            {activeTab === 'employees' && 'Gestión de Personal'}
                            {activeTab === 'services' && 'Catálogo de Servicios'}
                            {activeTab === 'profile' && 'Perfil de Usuario'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">{clinic?.name}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                </header>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Users className="h-6 w-6" /></div>
                                <div>
                                    <p className="text-gray-500 text-sm">Empleados</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{employees.length || '-'}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg text-green-600"><Stethoscope className="h-6 w-6" /></div>
                                <div>
                                    <p className="text-gray-500 text-sm">Servicios Activos</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{services.length || '-'}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Bienvenido al Panel</h3>
                            <p className="text-indigo-100 text-sm mb-4">Gestiona tu clínica, personal y servicios desde este panel de control centralizado.</p>
                        </div>
                    </div>
                )}

                {/* EMPLOYEES TAB */}
                {activeTab === 'employees' && (
                    <div className="space-y-8">
                        {/* Active Employees */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Personal Activo</h3>
                                <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                    <Mail className="h-4 w-4" /> Invitar Personal
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-700 font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Nombre</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Rol</th>
                                            <th className="px-6 py-3">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {employees.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{emp.user?.name}</td>
                                                <td className="px-6 py-4">{emp.user?.email}</td>
                                                <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">{emp.role?.name}</span></td>
                                                <td className="px-6 py-4"><span className="text-green-600 font-medium flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Activo</span></td>
                                            </tr>
                                        ))}
                                        {employees.length === 0 && !loading && (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No hay empleados activos aún.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pending Invitations */}
                        {pendingInvitations.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-900">Invitaciones Pendientes</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-600">
                                        <thead className="bg-orange-50 text-orange-800 font-medium">
                                            <tr>
                                                <th className="px-6 py-3">Email Invitado</th>
                                                <th className="px-6 py-3">Rol Asignado</th>
                                                <th className="px-6 py-3">Enviado</th>
                                                <th className="px-6 py-3">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {pendingInvitations.map((inv) => (
                                                <tr key={inv.id}>
                                                    <td className="px-6 py-4 font-medium">{inv.email}</td>
                                                    <td className="px-6 py-4">{inv.role}</td>
                                                    <td className="px-6 py-4">{new Date(inv.created_at).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <button onClick={() => handleCancelInvitation(inv.id)} className="text-red-600 hover:text-red-800 font-medium text-xs border border-red-200 px-3 py-1 rounded-md hover:bg-red-50">
                                                            Cancelar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* SERVICES TAB */}
                {activeTab === 'services' && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Catálogo de Servicios</h3>
                            <button onClick={() => {
                                setEditingServiceId(null);
                                setServiceData({ name: '', description: '', price: '', estimated_time: '', is_active: true });
                                setShowServiceModal(true);
                            }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                <Plus className="h-4 w-4" /> Nuevo Servicio
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {services.map(svc => (
                                <div key={svc.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow relative group">
                                    <button onClick={() => handleDeleteService(svc.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleOpenEditService(svc)} className="absolute top-4 right-12 text-gray-300 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Settings className="h-4 w-4" />
                                    </button>

                                    <div className="flex justify-between items-start mb-2 pr-12">
                                        <h4 className="font-bold text-gray-900">{svc.name}</h4>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{svc.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="font-bold text-indigo-600 text-lg">${svc.price}</span>
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{svc.estimated_time} min</span>
                                    </div>
                                    <div className={`mt-3 text-xs font-semibold text-center py-1 rounded ${svc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {svc.is_active ? 'Activo' : 'Inactivo'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
                        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="mt-8 p-4 bg-orange-50 text-orange-800 rounded-lg text-sm inline-block">
                            Para editar tu perfil personal, por favor contacta al administrador del sistema o usa la app móvil.
                        </div>
                    </div>
                )}
            </main>

            {/* MODALS */}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-4">Invitar Nuevo Personal</h3>
                        <form onSubmit={handleInviteEmployee} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                <input type="email" required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                    placeholder="doctor@ejemplo.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                                <select className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={inviteData.role} onChange={e => setInviteData({ ...inviteData, role: e.target.value })}>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="NURSE">Enfermero/a</option>
                                    <option value="STAFF">Staff Administrativo</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Enviar Invitación</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Service Modal */}
            {showServiceModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-4">{editingServiceId ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                        <form onSubmit={handleSaveService} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio</label>
                                <input type="text" required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={serviceData.name} onChange={e => setServiceData({ ...serviceData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" rows={3}
                                    value={serviceData.description} onChange={e => setServiceData({ ...serviceData, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                                    <input type="number" step="0.01" required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={serviceData.price} onChange={e => setServiceData({ ...serviceData, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo Est. (min)</label>
                                    <input type="number" required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={serviceData.estimated_time} onChange={e => setServiceData({ ...serviceData, estimated_time: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="isActive" className="rounded text-indigo-600 focus:ring-indigo-500"
                                    checked={serviceData.is_active} onChange={e => setServiceData({ ...serviceData, is_active: e.target.checked })} />
                                <label htmlFor="isActive" className="text-sm text-gray-700">Servicio Activo (Visible para pacientes)</label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowServiceModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar Servicio</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
