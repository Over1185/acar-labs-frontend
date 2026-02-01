import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Términos de Uso | ACAR Labs',
    description: 'Términos y condiciones de uso de la plataforma ACAR Labs.',
};

export default function TerminosPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                        Términos de Uso
                    </h1>
                    <p className="text-gray-500 mb-8">Última actualización: 1 de Febrero, 2026</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceptación de los Términos</h2>
                            <p>
                                Al acceder y utilizar la plataforma ACAR Labs, usted acepta estar legalmente vinculado por estos Términos de Uso. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descripción del Servicio</h2>
                            <p>
                                ACAR Labs proporciona una plataforma en línea para conectar pacientes con clínicas, laboratorios y profesionales de la salud, facilitando la programación y gestión de citas médicas. Nosotros actuamos como intermediarios tecnológicos y no proporcionamos servicios médicos directos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cuentas de Usuario</h2>
                            <p>
                                Para acceder a ciertas funciones de la plataforma, es posible que deba crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y de restringir el acceso a su computadora o dispositivo.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Responsabilidades del Usuario</h2>
                            <p className="mb-3">
                                Usted acepta no utilizar la plataforma para:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Violar cualquier ley o regulación aplicable.</li>
                                <li>Transmitir cualquier material publicitario o promocional no solicitado.</li>
                                <li>Suplantar a otra persona o entidad.</li>
                                <li>Participar en cualquier conducta que restrinja o inhiba el uso o disfrute de la plataforma por parte de cualquier otra persona.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Propiedad Intelectual</h2>
                            <p>
                                La plataforma y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de ACAR Labs y sus licenciantes. La plataforma está protegida por derechos de autor, marcas registradas y otras leyes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Limitación de Responsabilidad</h2>
                            <p>
                                En ningún caso ACAR Labs, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cambios en los Términos</h2>
                            <p>
                                Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Es su responsabilidad revisar estos Términos periódicamente para ver si hay cambios.
                            </p>
                        </section>

                        <div className="pt-6 border-t border-gray-100 mt-8">
                            <p className="text-sm text-gray-500">
                                ¿Tiene dudas sobre nuestros términos? <Link href="/contacto" className="text-[#003366] font-medium hover:underline">Contáctenos</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
