'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Plan {
    id: number;
    name: string;
    slug: string;
    price: number;
    billing_cycle: string;
    features: string[];
    is_active: boolean;
}

export default function RegisterClinicPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        ruc: '',
        province: '',
        canton: '',
        parish: '',
        street: '',
        reference: '',
        city: '',
        country: 'Ecuador',
        plan_id: '' 
    });

    // Carga de planes usando 'auth_token' para coincidir con tu Login
    useEffect(() => {
        const fetchPlans = async () => {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                setError("No se detectó sesión activa. Por favor, inicia sesión.");
                setLoadingPlans(false);
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1.0/plans', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) throw new Error("Sesión expirada o inválida.");

                const data = await response.json();
                const plansData = data.data || data;
                
                if (Array.isArray(plansData)) {
                    setAvailablePlans(plansData.filter((p: Plan) => p.is_active));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar planes");
            } finally {
                setLoadingPlans(false);
            }
        };

        fetchPlans();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('auth_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1.0';

        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            // 1. Crear Dirección con todos los campos requeridos
            const addressRes = await fetch(`${apiUrl}/addresses`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    province: formData.province,
                    canton: formData.canton,
                    parish: formData.parish,
                    street: formData.street,
                    reference: formData.reference,
                    city: formData.city,
                    country: formData.country
                }),
            });

            const addressData = await addressRes.json();
            if (!addressRes.ok) throw new Error(addressData.message || 'Error al guardar la ubicación');
            const addressId = addressData.id || addressData.data?.id;

            // 2. Crear Clínica
            const clinicRes = await fetch(`${apiUrl}/clinics`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: formData.name,
                    ruc: formData.ruc,
                    status: 'inactive',
                    address_id: addressId,
                    plan_id: formData.plan_id
                }),
            });

            if (!clinicRes.ok) {
                const clinicError = await clinicRes.json();
                throw new Error(clinicError.message || 'Error al registrar la clínica');
            }

            router.push('/perfil?success=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a1929] pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Stepper */}
                <div className="flex justify-center mb-8 gap-4 items-center font-semibold">
                    <span className={step === 1 ? "text-blue-600" : "text-gray-400"}>1. Datos de Clínica</span>
                    <div className="w-10 h-px bg-gray-300"></div>
                    <span className={step === 2 ? "text-blue-600" : "text-gray-400"}>2. Selección de Plan</span>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <div className="bg-white dark:bg-[#1a2332] p-8 rounded-2xl shadow-xl space-y-6">
                        <h2 className="text-2xl font-bold dark:text-white border-b pb-4">Información General</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium dark:text-gray-300">Nombre de la Clínica</label>
                                <input required name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Clínica Central" className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium dark:text-gray-300">RUC</label>
                                <input required name="ruc" value={formData.ruc} onChange={handleChange} placeholder="17XXXXXXXX001" className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold dark:text-white border-b pb-4 pt-4">Ubicación Detallada</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input required name="province" placeholder="Provincia" value={formData.province} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" />
                            <input required name="canton" placeholder="Cantón" value={formData.canton} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" />
                            <input required name="parish" placeholder="Parroquia" value={formData.parish} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" />
                            <input required name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700" />
                            <input required name="street" placeholder="Calle Principal y Nro" value={formData.street} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700 md:col-span-2" />
                            <input name="reference" placeholder="Referencia (Ej: Junto al parque)" value={formData.reference} onChange={handleChange} className="p-3 border rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-700 md:col-span-3" />
                        </div>
                        
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
                        >
                            Siguiente: Elegir Plan
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {loadingPlans ? (
                            <div className="text-center py-10 dark:text-white animate-pulse">Cargando planes...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {availablePlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setFormData({ ...formData, plan_id: plan.id.toString() })}
                                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center ${formData.plan_id === plan.id.toString() ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500' : 'border-gray-200 bg-white dark:bg-[#1a2332] dark:border-gray-700'}`}
                                    >
                                        <h3 className="text-lg font-bold dark:text-white mb-2">{plan.name}</h3>
                                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">${plan.price}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4">{plan.billing_cycle}</p>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                            {plan.features.slice(0, 3).map((f, i) => <p key={i}>• {f}</p>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 dark:text-white font-bold rounded-xl transition-all">Volver</button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !formData.plan_id}
                                className={`flex-1 py-4 font-bold rounded-xl text-white shadow-lg transition-all ${loading || !formData.plan_id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {loading ? 'Registrando...' : 'Finalizar Registro'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}