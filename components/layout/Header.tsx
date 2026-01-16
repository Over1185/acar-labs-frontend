'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // No renderizar el header en rutas de clínica
    if (pathname.startsWith('/clinic/')) {
        return null;
    }

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

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                await fetchUser(token);
            } else {
                setLoading(false);
            }
        };

        checkAuth();

        // Listen for storage changes (logout in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_token') {
                if (e.newValue === null) {
                    setUser(null);
                } else {
                    fetchUser(e.newValue);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1.0';
            const response = await fetch(`${apiUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data || data);
            } else {
                // Token inválido, limpiar localStorage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('token_type');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_type');
        setUser(null);
        setIsProfileMenuOpen(false);
        router.push('/');
    };

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

                        {/* User Profile or Auth Buttons */}
                        {!loading && user ? (
                            // Logged in user
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isScrolled
                                        ? 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${isScrolled ? 'bg-[#003366]' : 'bg-white/30'}`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`text-sm font-medium ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <svg className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a2332] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                        <Link
                                            href="/perfil"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            Ver Perfil
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : !loading ? (
                            // Not logged in
                            <>
                                <Link
                                    href="/login"
                                    className={`hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium border rounded-full transition-all ${isScrolled
                                            ? 'text-[#003366] border-[#003366] hover:bg-[#003366] hover:text-white dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400 dark:hover:text-white'
                                            : 'text-white border-white hover:bg-white hover:text-[#003366]'
                                        }`}
                                >
                                    Iniciar Sesión
                                </Link>

                                <Link
                                    href="/registro"
                                    className={`hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all shadow-lg ${isScrolled
                                            ? 'text-white bg-[#003366] hover:bg-[#00509e] dark:bg-blue-600 dark:hover:bg-blue-700'
                                            : 'text-[#003366] bg-white hover:bg-gray-100'
                                        }`}
                                >
                                    Registrarse
                                </Link>
                            </>
                        ) : null}

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
                                {user ? (
                                    <>
                                        <Link
                                            href="/perfil"
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#003366] dark:text-blue-400 border border-[#003366] dark:border-blue-400 rounded-full hover:bg-[#003366] dark:hover:bg-blue-400 hover:text-white transition-all"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Mi Perfil
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
