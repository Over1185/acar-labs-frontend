import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Cookies | ACAR Labs',
    description: 'Información sobre el uso de cookies en la plataforma ACAR Labs.',
};

export default function CookiesPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                        Política de Cookies
                    </h1>
                    <p className="text-gray-500 mb-8">Última actualización: 1 de Febrero, 2026</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. ¿Qué son las cookies?</h2>
                            <p>
                                Las cookies son pequeños archivos de texto que los sitios web que visita colocan en su ordenador o dispositivo móvil. Se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. ¿Cómo utilizamos las cookies?</h2>
                            <p className="mb-3">
                                ACAR Labs utiliza cookies para mejorar su experiencia en nuestra plataforma, incluyendo:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Mantener su sesión iniciada mientras navega.</li>
                                <li>Entender cómo utiliza nuestro sitio web.</li>
                                <li>Recordar sus preferencias y configuraciones.</li>
                                <li>Mejorar la velocidad y seguridad del sitio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Tipos de cookies que utilizamos</h2>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-[#003366] mb-1">Cookies Estrictamente Necesarias</h3>
                                    <p className="text-sm">Estas cookies son esenciales para que pueda navegar por el sitio web y utilizar sus funciones, como acceder a áreas seguras del sitio.</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-[#003366] mb-1">Cookies de Rendimiento y Análisis</h3>
                                    <p className="text-sm">Estas cookies recopilan información sobre cómo los visitantes utilizan un sitio web, por ejemplo, qué páginas visitan con más frecuencia y si reciben mensajes de error.</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-[#003366] mb-1">Cookies de Funcionalidad</h3>
                                    <p className="text-sm">Estas cookies permiten al sitio web recordar las elecciones que realiza (como su nombre de usuario, idioma o la región en la que se encuentra) y proporcionar funciones mejoradas y más personales.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cómo gestionar las cookies</h2>
                            <p>
                                La mayoría de los navegadores web permiten cierto control de la mayoría de las cookies a través de la configuración del navegador. Para obtener más información sobre las cookies, incluyendo cómo ver qué cookies se han establecido, visite <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:underline">www.aboutcookies.org</a> o <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#003366] hover:underline">www.allaboutcookies.org</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cambios en esta Política de Cookies</h2>
                            <p>
                                Podemos actualizar esta Política de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
