'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        // Check for dark mode preference
        const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(darkModePreference);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md shadow-md'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src={isDarkMode ? '/ACAR Labs-Black.svg' : '/ACAR Labs-White.svg'}
                            alt="ACAR Labs"
                            width={140}
                            height={40}
                            priority
                            className="h-8 md:h-10 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-[var(--text-main)] hover:text-[var(--brand-deep-blue)] dark:hover:text-[var(--link-color)] font-medium transition-colors"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/clinicas"
                            className="text-[var(--text-main)] hover:text-[var(--brand-deep-blue)] dark:hover:text-[var(--link-color)] font-medium transition-colors"
                        >
                            Clínicas
                        </Link>
                        <Link
                            href="/servicios"
                            className="text-[var(--text-main)] hover:text-[var(--brand-deep-blue)] dark:hover:text-[var(--link-color)] font-medium transition-colors"
                        >
                            Servicios
                        </Link>
                        <Link
                            href="/nosotros"
                            className="text-[var(--text-main)] hover:text-[var(--brand-deep-blue)] dark:hover:text-[var(--link-color)] font-medium transition-colors"
                        >
                            Nosotros
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-[var(--bg-surface)] transition-colors"
                            aria-label="Cambiar tema"
                        >
                            {isDarkMode ? (
                                <svg
                                    className="w-5 h-5 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5 text-[var(--brand-deep-blue)]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {/* Login Button */}
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-[var(--link-color)] border border-[var(--link-color)] rounded-full hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-text)] hover:border-[var(--btn-primary-bg)] transition-all"
                        >
                            Iniciar Sesión
                        </Link>

                        {/* Register Button */}
                        <Link
                            href="/registro"
                            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-[var(--btn-text)] bg-[var(--btn-primary-bg)] rounded-full hover:bg-[var(--btn-primary-hover)] transition-all shadow-lg shadow-[var(--shadow-lg)]"
                        >
                            Registrarse
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-surface)] transition-colors"
                            aria-label="Menú"
                        >
                            {isMobileMenuOpen ? (
                                <svg
                                    className="w-6 h-6 text-[var(--text-main)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6 text-[var(--text-main)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-[var(--border-color)]">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-[var(--text-main)] hover:text-[var(--brand-deep-blue)] font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/clinicas"
                                className="text-[var(--text-main)] hover:text-[var(--brand-deep-blue)] font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Clínicas
                            </Link>
                            <Link
                                href="/servicios"
                                className="text-[var(--text-main)] hover:text-[var(--brand-deep-blue)] font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Servicios
                            </Link>
                            <Link
                                href="/nosotros"
                                className="text-[var(--text-main)] hover:text-[var(--brand-deep-blue)] font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Nosotros
                            </Link>
                            <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border-color)]">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[var(--brand-deep-blue)] border border-[var(--brand-deep-blue)] rounded-full hover:bg-[var(--brand-deep-blue)] hover:text-white transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/registro"
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[var(--brand-deep-blue)] rounded-full hover:bg-[var(--btn-primary-hover)] transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Registrarse
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
