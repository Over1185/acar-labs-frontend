'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#003366] border-t border-[#00509e]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/Letras.svg"
                                alt="ACAR Labs"
                                width={120}
                                height={35}
                                className="h-8 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="mt-4 text-sm text-white/80">
                            Tu plataforma de confianza para gestionar citas médicas en Ecuador.
                            Conectamos pacientes con los mejores profesionales de la salud.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4 mt-6">
                            <a
                                href="https://www.facebook.com/profile.php?id=61586904871611&rdid=lHRBrGW9xJH7wYf6#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-white transition-all"
                                aria-label="Facebook"
                            >
                                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073" /></svg>
                            </a>
                            <a
                                href="https://www.instagram.com/acarlabs.ec"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-white transition-all"
                                aria-label="Instagram"
                            >
                                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881" /></svg>
                            </a>
                            <a
                                href="https://x.com/ACAR_Labs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-white transition-all"
                                aria-label="Twitter/X"
                            >
                                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/acar-labs-32a43b3aa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-white transition-all"
                                aria-label="LinkedIn"
                            >
                                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Enlaces Rápidos
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link
                                    href="/clinicas"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Buscar Clínicas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/servicios"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Servicios Médicos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/nosotros"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Nosotros
                                </Link>
                            </li>

                        </ul>
                    </div>

                    {/* For Patients */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Para Pacientes
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link
                                    href="/registro"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Registrarse
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Iniciar Sesión
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contacto"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link
                                    href="/privacidad"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Política de Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terminos"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Términos de Uso
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/cookies"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Política de Cookies
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/seguridad"
                                    className="text-sm text-white/80 hover:text-white transition-all"
                                >
                                    Seguridad
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-white/70">
                            © {currentYear} ACAR Labs. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-6">
                            <Link
                                href="/privacidad"
                                className="text-sm text-white/70 hover:text-white transition-all"
                            >
                                Privacidad
                            </Link>
                            <Link
                                href="/terminos"
                                className="text-sm text-white/70 hover:text-white transition-all"
                            >
                                Términos
                            </Link>
                            <Link
                                href="/cookies"
                                className="text-sm text-white/70 hover:text-white transition-all"
                            >
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

