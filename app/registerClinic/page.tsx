'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterClinicPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estado del formulario
    const [formData, setFormData] = useState({
        // Datos de Clínica
        name: '',
        ruc: '',
        // Datos de Dirección
        province: '',
        canton: '',
        parish: '',
        street: '',
        reference: '',
        city: '',
        country: 'Ecuador', // Valor por defecto
        // Plan seleccionado
        plan: 'principal'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            // 1. Crear la Dirección primero para obtener el address_id
            const addressRes = await fetch(`${apiUrl}/addresses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            if (!addressRes.ok) throw new Error(addressData.message || 'Error al registrar la dirección');

            const addressId = addressData.id || addressData.data.id;

            // 2. Crear la Clínica vinculada al address_id
            const clinicRes = await fetch(`${apiUrl}/clinics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    ruc: formData.ruc,
                    status: 'inactive', // Por defecto según tu requerimiento
                    address_id: addressId,
                    plan: formData.plan // Enviamos el plan elegido
                }),
            });

            if (!clinicRes.ok) throw new Error('Error al registrar la clínica');

            // Éxito: Redirigir al perfil o página de confirmación
            router.push('/perfil?success=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        { id: 'principal', name: 'Principal', price: '$29', features: ['Gestión básica', 'Hasta 3 doctores', 'Soporte vía email'] },
        { id: 'pro', name: 'Pro', price: '$59', features: ['Gestión completa', 'Doctores ilimitados', 'Reportes avanzados', 'Soporte 24/7'] },
        { id: 'empresa', name: 'Empresa', price: '$99', features: ['Múltiples sucursales', 'API personalizada', 'App móvil blanca', 'Capacitación presencial'] },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a1929] pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Stepper Indicador */}
                <div className="flex items-center justify-center mb-12">
                    <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <span className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-blue-600 font-bold' : 'border-gray-300'}`}>1</span>
                        <span className="ml-2 font-medium">Información</span>
                    </div>
                    <div className={`w-20 h-0.5 mx-4 ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center ${step === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <span className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step === 2 ? 'border-blue-600 font-bold' : 'border-gray-300'}`}>2</span>
                        <span className="ml-2 font-medium">Elige tu Plan</span>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleNext} className="bg-white dark:bg-[#1a2332] p-8 rounded-2xl shadow-xl space-y-6">
                        <h2 className="text-2xl font-bold dark:text-white border-b pb-4">Datos de la Clínica</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de la Clínica</label>
                                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="Ej: Clínica Salud Total" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RUC</label>
                                <input required name="ruc" value={formData.ruc} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" placeholder="17xxxxxxxx001" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold dark:text-white border-b pb-4 pt-4">Dirección</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Provincia</label>
                                <input required name="province" value={formData.province} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cantón</label>
                                <input required name="canton" value={formData.canton} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parroquia</label>
                                <input required name="parish" value={formData.parish} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calle Principal</label>
                                <input required name="street" value={formData.street} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ciudad</label>
                                <input required name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Referencia</label>
                                <input name="reference" value={formData.reference} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-800" />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
                            Siguiente Paso
                        </button>
                    </form>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map((plan) => (
                                <div 
                                    key={plan.id}
                                    onClick={() => setFormData({...formData, plan: plan.id})}
                                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${formData.plan === plan.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 bg-white dark:bg-[#1a2332] dark:border-gray-700'}`}
                                >
                                    {formData.plan === plan.id && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">Seleccionado</div>
                                    )}
                                    <h3 className="text-xl font-bold mb-2 dark:text-white text-center">{plan.name}</h3>
                                    <p className="text-3xl font-black text-center mb-6 dark:text-blue-400">{plan.price}<span className="text-sm font-normal text-gray-500">/mes</span></p>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl">Volver</button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={loading}
                                className={`flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creando Clínica...' : 'Crear Clínica Ahora'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}