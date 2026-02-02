import Link from 'next/link';
import Image from 'next/image';

export default function NosotrosPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">
            <section className="relative bg-linear-to-br from-[#003366] to-[#00509e] pt-24 pb-16 md:pt-32 md:pb-20">
                <div className="absolute inset-0 opacity-25">
                    <Image
                        src="/images/about-me/Banner.avif"
                        alt="Decorative background"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Sobre Nosotros
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto">
                        Conectando pacientes con los mejores profesionales de la salud en Ecuador
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                        <div className="w-16 h-16 bg-[#003366] rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Facilitar el acceso a servicios médicos de calidad mediante una plataforma digital innovadora que conecta pacientes con clínicas y profesionales de la salud, mejorando la experiencia de atención médica en Ecuador.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                        <div className="w-16 h-16 bg-[#00509e] rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Ser la plataforma líder en gestión de citas médicas en Ecuador, reconocida por transformar la manera en que las personas acceden a servicios de salud, con tecnología de vanguardia y un enfoque centrado en el paciente.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Nuestros Valores
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Los principios que guían nuestro trabajo y compromiso con la excelencia
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-linear-to-br from-[#003366] to-[#00509e] rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Confianza</h3>
                            <p className="text-gray-600">
                                Construimos relaciones basadas en la transparencia y la seguridad de los datos de nuestros usuarios
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-linear-to-br from-[#003366] to-[#00509e] rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovación</h3>
                            <p className="text-gray-600">
                                Utilizamos tecnología de punta para simplificar y mejorar el acceso a servicios médicos
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-linear-to-br from-[#003366] to-[#00509e] rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Compromiso</h3>
                            <p className="text-gray-600">
                                Dedicados a mejorar la salud y bienestar de las personas en cada interacción
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-[#003366] mb-2">100+</div>
                        <div className="text-sm text-gray-600">Clínicas Asociadas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-[#003366] mb-2">500+</div>
                        <div className="text-sm text-gray-600">Profesionales</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-[#003366] mb-2">10K+</div>
                        <div className="text-sm text-gray-600">Pacientes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-[#003366] mb-2">50K+</div>
                        <div className="text-sm text-gray-600">Citas Agendadas</div>
                    </div>
                </div>
            </section>

            <section className="bg-linear-to-br from-[#003366] to-[#00509e] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Desarrollado por ACAR
                    </h2>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                        Un equipo apasionado por crear soluciones tecnológicas que mejoran la vida de las personas
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contacto"
                            className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#003366] font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg"
                        >
                            Contáctanos
                        </Link>
                        <Link
                            href="/clinicas"
                            className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#003366] transition-all"
                        >
                            Ver Clínicas
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
