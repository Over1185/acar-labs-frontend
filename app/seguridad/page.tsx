import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Seguridad | ACAR Labs',
    description: 'Información sobre las prácticas de seguridad y protección de datos en ACAR Labs.',
};

export default function SeguridadPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#003366]">
                            Seguridad
                        </h1>
                    </div>

                    <p className="text-gray-500 mb-8">Última actualización: 1 de Febrero, 2026</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Nuestro compromiso con la seguridad</h2>
                            <p>
                                En ACAR Labs, la seguridad de la información de nuestros usuarios es nuestra máxima prioridad. Implementamos estándares de seguridad de la industria y tecnologías avanzadas para proteger sus datos personales y médicos contra el acceso no autorizado, la divulgación, la alteración y la destrucción.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Protección de Datos y Encriptación</h2>
                            <p className="mb-3">
                                Utilizamos tecnologías de encriptación robustas para asegurar que sus datos estén protegidos tanto en tránsito como en reposo:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>SSL/TLS:</strong> Todas las comunicaciones entre su navegador y nuestros servidores están encriptadas utilizando protocolos SSL/TLS (Secure Sockets Layer/Transport Layer Security).</li>
                                <li><strong>Encriptación de Base de Datos:</strong> Los datos sensibles almacenados en nuestras bases de datos están encriptados utilizando algoritmos de encriptación estándar de la industria (AES-256).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Control de Acceso</h2>
                            <p>
                                El acceso a sus datos personales está estrictamente limitado a aquellos empleados y contratistas que necesitan conocer dicha información para procesarla en nuestro nombre. Estas personas están sujetas a estrictas obligaciones contractuales de confidencialidad y pueden ser sancionadas o despedidas si no cumplen con estas obligaciones.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cumplimiento Normativo</h2>
                            <p>
                                Nos esforzamos por cumplir con todas las leyes y regulaciones aplicables en materia de protección de datos y privacidad en Ecuador, así como con los estándares internacionales cuando sea aplicable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Reporte de Vulnerabilidades</h2>
                            <p>
                                Si usted es un investigador de seguridad o un usuario y cree que ha encontrado una vulnerabilidad de seguridad en nuestra plataforma, le agradecemos que nos lo notifique de inmediato. Por favor, envíe un correo electrónico a seguridad@acarlabs.com con los detalles del problema. Revisaremos su informe y tomaremos las medidas necesarias para abordar cualquier problema legítimo.
                            </p>
                        </section>

                        <div className="bg-blue-50 border-l-4 border-[#003366] p-4 mt-6">
                            <h3 className="font-bold text-[#003366] mb-2">Consejos de seguridad para usuarios</h3>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                <li>Utilice una contraseña fuerte y única para su cuenta de ACAR Labs.</li>
                                <li>No comparta su contraseña con nadie.</li>
                                <li>Asegúrese de cerrar sesión cuando utilice un ordenador compartido.</li>
                                <li>Mantenga su navegador y sistema operativo actualizados.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
