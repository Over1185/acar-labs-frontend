import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contacto | ACAR Labs',
    description: 'Ponte en contacto con ACAR Labs. Estamos aquí para ayudarte con tus citas médicas y dudas sobre nuestra plataforma.',
};

export default function ContactoPage() {
    return (
        <div className="bg-gray-50 pb-20 pt-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
                        Contáctanos
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para escucharte y brindarte el mejor servicio.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Office Info */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                            <h3 className="text-xl font-bold text-[#003366] mb-6">Información de Contacto</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#003366]/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Oficina Principal</h4>
                                        <p className="text-gray-600 mt-1">Eugenio Espejo y Colon<br />Esmeraldas, Ecuador</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#003366]/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Email</h4>
                                        <p className="text-gray-600 mt-1">info@acarlabs.com</p>
                                        <p className="text-gray-600">soporte@acarlabs.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#003366]/10 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Teléfono</h4>
                                        <p className="text-gray-600 mt-1">+593 95 985 9969</p>
                                        <p className="text-gray-600">+593 98 863 3917</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-bold text-[#003366] mb-6">Envíanos un mensaje</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all"
                                            placeholder="juan@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono (opcional)</label>
                                        <input
                                            type="tel"
                                            id="telefono"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all"
                                            placeholder="099 123 4567"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                                        <select
                                            id="asunto"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all bg-white"
                                        >
                                            <option value="">Selecciona un asunto</option>
                                            <option value="citas">Problema con citas</option>
                                            <option value="clinica">Soy una clínica/doctor</option>
                                            <option value="soporte">Soporte técnico</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                                    <textarea
                                        id="mensaje"
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all resize-none"
                                        placeholder="¿En qué podemos ayudarte?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3 bg-[#003366] text-white font-medium rounded-full hover:bg-[#002244] transition-colors shadow-lg shadow-[#003366]/20"
                                >
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
