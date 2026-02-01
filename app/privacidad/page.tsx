import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad | ACAR Labs',
    description: 'Política de privacidad y protección de datos de ACAR Labs.',
};

export default function PrivacidadPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                        Política de Privacidad
                    </h1>
                    <p className="text-gray-500 mb-8">Última actualización: 1 de Febrero, 2026</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introducción</h2>
                            <p>
                                En ACAR Labs (&quot;nosotros&quot;, &quot;nuestro&quot;), respetamos su privacidad y estamos comprometidos con la protección de sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web o utiliza nuestros servicios de gestión de citas médicas.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Información que recopilamos</h2>
                            <p className="mb-3">
                                Podemos recopilar, utilizar, almacenar y transferir diferentes tipos de datos personales sobre usted, que hemos agrupado de la siguiente manera:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Datos de Identidad:</strong> incluye nombre, apellidos, nombre de usuario o identificador similar.</li>
                                <li><strong>Datos de Contacto:</strong> incluye dirección de correo electrónico, dirección física y números de teléfono.</li>
                                <li><strong>Datos Técnicos:</strong> incluye dirección IP, datos de inicio de sesión, tipo y versión del navegador, y sistema operativo.</li>
                                <li><strong>Datos de Uso:</strong> incluye información sobre cómo utiliza nuestro sitio web y servicios.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cómo utilizamos sus datos</h2>
                            <p className="mb-3">
                                Solo utilizaremos sus datos personales cuando la ley nos lo permita. Frecuentemente, utilizaremos sus datos personales en las siguientes circunstancias:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Para registrarlo como nuevo cliente/paciente.</li>
                                <li>Para gestionar y agendar sus citas médicas.</li>
                                <li>Para administrar nuestra relación con usted.</li>
                                <li>Para mejorar nuestro sitio web, productos/servicios, marketing y experiencias de los clientes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Seguridad de los datos</h2>
                            <p>
                                Hemos implementado medidas de seguridad adecuadas para evitar que sus datos personales se pierdan accidentalmente, se utilicen o se acceda a ellos de forma no autorizada, se alteren o se divulguen. Además, limitamos el acceso a sus datos personales a aquellos empleados, agentes, contratistas y otros terceros que tengan una necesidad comercial de conocerlos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Sus derechos legales</h2>
                            <p>
                                Bajo ciertas circunstancias, usted tiene derechos bajo las leyes de protección de datos en relación con sus datos personales, incluyendo el derecho a solicitar acceso, corrección, cancelación, oposición, restricción del procesamiento y portabilidad de datos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contacto</h2>
                            <p>
                                Si tiene alguna pregunta sobre esta política de privacidad o nuestras prácticas de privacidad, por favor contáctenos a través de nuestro formulario de contacto o enviando un correo a info@acarlabs.com.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
