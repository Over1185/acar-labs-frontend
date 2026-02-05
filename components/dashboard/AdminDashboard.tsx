'use client';

import React, { useState, useEffect } from 'react';
import {
    LogOut,
    Layout,
    Plus,
    CreditCard,
    Shield,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { User as UserType } from './types';
import { Plan } from './types_plans'; // Assuming this type exists or I need to create it locally
import Popup from '../ui/Popup';

interface DashboardProps {
    user: UserType;
    onLogout: () => void;
}

type Tab = 'overview' | 'plans' | 'users';

export default function AdminDashboard({ user, onLogout }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [popup, setPopup] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Data State
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [planData, setPlanData] = useState({
        name: '',
        slug: '',
        price: '',
        billing_cycle: 'monthly',
        features: [] as string[]
    });
    const [currentFeature, setCurrentFeature] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        if (activeTab === 'plans') {
            fetchPlans();
        }
    }, [activeTab]);

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

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/plans`, { headers: getAuthHeaders() });
            const data = await res.json();
            setPlans(data.data || []);
        } catch (err) {
            console.error(err);
            showPopup('error', 'Error al cargar planes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const body = {
                ...planData,
                price: parseFloat(planData.price)
            };

            const res = await fetch(`${apiUrl}/plans`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Error al crear plan');

            showPopup('success', 'Plan creado exitosamente');
            setShowPlanModal(false);
            setPlanData({ name: '', slug: '', price: '', billing_cycle: 'monthly', features: [] });
            fetchPlans();
        } catch (err) {
            showPopup('error', 'No se pudo crear el plan');
        }
    };

    const addFeature = () => {
        if (currentFeature.trim()) {
            setPlanData(prev => ({
                ...prev,
                features: [...prev.features, currentFeature.trim()]
            }));
            setCurrentFeature('');
        }
    };

    const removeFeature = (index: number) => {
        setPlanData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {popup && <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} isOpen={false} />}

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col fixed h-full z-10 text-white">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="font-bold block text-sm">Super Admin</span>
                            <span className="text-xs text-gray-400 font-medium tracking-wider">ACAR LABS</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <Layout className="h-5 w-5" /> Resumen Global
                    </button>
                    <button onClick={() => setActiveTab('plans')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'plans' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <CreditCard className="h-5 w-5" /> Planes y Facturación
                    </button>
                    {/* Add Users Management here if found in backend */}
                </nav>

                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium">
                        <LogOut className="h-4 w-4" /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen p-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeTab === 'overview' && 'Visión General del Sistema'}
                            {activeTab === 'plans' && 'Gestión de Planes de Suscripción'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs">
                            {user.name?.charAt(0) || 'A'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{user.name || 'Admin'}</span>
                    </div>
                </header>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Estado del Sistema</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-bold text-gray-900 text-lg">Operativo</span>
                            </div>
                        </div>
                        {/* Placeholders for future stats */}
                    </div>
                )}

                {/* PLANS TAB */}
                {activeTab === 'plans' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-500">Administra los niveles de suscripción disponibles para las clínicas.</p>
                            <button onClick={() => setShowPlanModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                                <Plus className="h-4 w-4" /> Crear Nuevo Plan
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {plans.map(plan => (
                                <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Edit/Delete icons could go here */}
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                        <p className="text-sm text-gray-500">Slug: {plan.slug}</p>
                                    </div>
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                                        <span className="text-gray-500 ml-1">/{plan.billing_cycle === 'monthly' ? 'mes' : 'año'}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {plan.features?.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {plan.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE PLAN MODAL */}
            {showPlanModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Nuevo Plan de Suscripción</h3>
                            <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePlan} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Plan</label>
                                    <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={planData.name} onChange={e => setPlanData({ ...planData, name: e.target.value })} placeholder="Ej: Premium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (Identificador)</label>
                                    <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={planData.slug} onChange={e => setPlanData({ ...planData, slug: e.target.value })} placeholder="Ej: premium-plan" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Precio ($)</label>
                                    <input type="number" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={planData.price} onChange={e => setPlanData({ ...planData, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ciclo de Facturación</label>
                                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={planData.billing_cycle} onChange={e => setPlanData({ ...planData, billing_cycle: e.target.value })}>
                                        <option value="monthly">Mensual</option>
                                        <option value="yearly">Anual</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Características (Features)</label>
                                <div className="flex gap-2 mb-3">
                                    <input type="text" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={currentFeature} onChange={e => setCurrentFeature(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        placeholder="Ej: Soporte 24/7" />
                                    <button type="button" onClick={addFeature} className="bg-gray-100 text-gray-700 px-4 rounded-lg font-medium hover:bg-gray-200">
                                        Agregar
                                    </button>
                                </div>
                                <ul className="space-y-2 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {planData.features.map((feat, idx) => (
                                        <li key={idx} className="flex justify-between items-center bg-white px-3 py-1.5 rounded border border-gray-200 text-sm">
                                            <span>{feat}</span>
                                            <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700">
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                        </li>
                                    ))}
                                    {planData.features.length === 0 && <li className="text-gray-400 text-sm Italic">No hay características añadidas</li>}
                                </ul>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowPlanModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200">Crear Plan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
