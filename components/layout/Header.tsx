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
                    ? 'bg-white/98 dark:bg-[#0a1929]/98 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50'
                    : 'bg-gradient-to-b from-[#003366]/95 to-[#003366]/80 dark:from-[#0a1929]/95 dark:to-[#0a1929]/80 backdrop-blur-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                        <Image
                            src={isScrolled && !isDarkMode ? '/ACAR Labs-Black.svg' : '/ACAR Labs-White.svg'}
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
                            className={`text-sm font-medium transition-colors ${isScrolled
                                    ? 'text-gray-700 hover:text-[#003366] dark:text-gray-300 dark:hover:text-white'
                                    : 'text-white/90 hover:text-white'
                                }`}
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/clinicas"
                            className={`text-sm font-medium transition-colors ${isScrolled
                                    ? 'text-gray-700 hover:text-[#003366] dark:text-gray-300 dark:hover:text-white'
                                    : 'text-white/90 hover:text-white'
                                }`}
                        >
                            Clínicas
                        </Link>
                        <Link
                            href="/servicios"
                            className={`text-sm font-medium transition-colors ${isScrolled
                                    ? 'text-gray-700 hover:text-[#003366] dark:text-gray-300 dark:hover:text-white'
                                    : 'text-white/90 hover:text-white'
                                }`}
                        >
                            Servicios
                        </Link>
                        <Link
                            href="/nosotros"
                            className={`text-sm font-medium transition-colors ${isScrolled
                                    ? 'text-gray-700 hover:text-[#003366] dark:text-gray-300 dark:hover:text-white'
                                    : 'text-white/90 hover:text-white'
                                }`}
                        >
                            Nosotros
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-full transition-colors ${isScrolled
                                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    : 'hover:bg-white/10'
                                }`}
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
                                    className={isScrolled ? 'w-5 h-5 text-gray-700' : 'w-5 h-5 text-white/90'}
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
                            className={`hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium border rounded-full transition-all ${isScrolled
                                    ? 'text-[#003366] border-[#003366] hover:bg-[#003366] hover:text-white dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white'
                                    : 'text-white border-white hover:bg-white hover:text-[#003366]'
                                }`}
                        >
                            Iniciar Sesión
                        </Link>

                        {/* Register Button */}
                        <Link
                            href="/registro"
                            className={`hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all shadow-lg ${isScrolled
                                    ? 'text-white bg-[#003366] hover:bg-[#00509e] dark:bg-blue-600 dark:hover:bg-blue-700'
                                    : 'text-[#003366] bg-white hover:bg-gray-100'
                                }`}
                        >
                            Registrarse
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled
                                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    : 'hover:bg-white/10'
                                }`}
                            aria-label="Menú"
                        >
                            {isMobileMenuOpen ? (
                                <svg
                                    className={isScrolled ? 'w-6 h-6 text-gray-700 dark:text-gray-300' : 'w-6 h-6 text-white'}
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
                                    className={isScrolled ? 'w-6 h-6 text-gray-700 dark:text-gray-300' : 'w-6 h-6 text-white'}
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
                    <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-[#0a1929]">
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/clinicas"
                                className="text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Clínicas
                            </Link>
                            <Link
                                href="/servicios"
                                className="text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Servicios
                            </Link>
                            <Link
                                href="/nosotros"
                                className="text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Nosotros
                            </Link>
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#003366] dark:text-blue-400 border border-[#003366] dark:border-blue-400 rounded-full hover:bg-[#003366] dark:hover:bg-blue-400 hover:text-white transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/registro"
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#003366] dark:bg-blue-600 rounded-full hover:bg-[#00509e] dark:hover:bg-blue-700 transition-all"
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
