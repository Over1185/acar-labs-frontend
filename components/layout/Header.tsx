/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
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

        // Listen for user profile updates from Dashboard
        const handleUserUpdate = () => {
             const token = localStorage.getItem('auth_token');
             if (token) fetchUser(token);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('user-updated', handleUserUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('user-updated', handleUserUpdate);
        };
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

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-gray-200/50'
                : 'bg-linear-to-b from-[#003366]/95 to-[#003366]/80 backdrop-blur-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                        <Image
                            src="/Letras.svg"
                            alt="ACAR Labs"
                            width={140}
                            height={40}
                            priority
                            className={`h-8 md:h-10 w-auto ${!isScrolled ? 'brightness-0 invert' : ''}`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors ${isScrolled
                                ? 'text-gray-700 hover:text-[#003366]'
                                : 'text-white/90 hover:text-white'
                                }`}
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/clinicas"
                            className={`text-sm font-medium transition-colors ${isScrolled
                                ? 'text-gray-700 hover:text-[#003366]'
                                : 'text-white/90 hover:text-white'
                                }`}
                        >
                            Clínicas
                        </Link>
                        <Link
                            href="/servicios"
                            className={`text-sm font-medium transition-colors ${isScrolled
                                ? 'text-gray-700 hover:text-[#003366]'
                                : 'text-white/90 hover:text-white'
                                }`}
                        >
                            Servicios
                        </Link>
                        <Link
                            href="/nosotros"
                            className={`text-sm font-medium transition-colors ${isScrolled
                                ? 'text-gray-700 hover:text-[#003366]'
                                : 'text-white/90 hover:text-white'
                                }`}
                        >
                            Nosotros
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* User Profile or Auth Buttons */}
                        {!loading && user ? (
                            // Logged in user
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isScrolled
                                        ? 'hover:bg-gray-100'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${isScrolled ? 'bg-[#003366]' : 'bg-white/30'}`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`text-sm font-medium ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                                        {user.name.split(' ')[0]}
                                    </span>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <Link
                                            href="/perfil"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                        >
                                            Ver Perfil
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                                        ? 'text-[#003366] border-[#003366] hover:bg-[#003366] hover:text-white'
                                        : 'text-white border-white hover:bg-white hover:text-[#003366]'
                                        }`}
                                >
                                    Iniciar Sesión
                                </Link>

                                <Link
                                    href="/registro"
                                    className={`hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all shadow-lg ${isScrolled
                                        ? 'text-white bg-[#003366] hover:bg-[#00509e]'
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
                                ? 'hover:bg-gray-100'
                                : 'hover:bg-white/10'
                                }`}
                            aria-label="Menú"
                        >
                            {isMobileMenuOpen ? (
                                <svg
                                    className={isScrolled ? 'w-6 h-6 text-gray-700' : 'w-6 h-6 text-white'}
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
                                    className={isScrolled ? 'w-6 h-6 text-gray-700' : 'w-6 h-6 text-white'}
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
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col p-4 space-y-4">
                            {/* Navigation Links */}
                            <nav className="flex flex-col space-y-2">
                                {[
                                    { name: 'Inicio', href: '/' },
                                    { name: 'Clínicas', href: '/clinicas' },
                                    { name: 'Servicios', href: '/servicios' },
                                    { name: 'Nosotros', href: '/nosotros' },
                                ].map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="px-4 py-3 text-lg font-medium text-gray-700 hover:text-[#003366] hover:bg-blue-50/50 rounded-xl transition-colors flex items-center justify-between group"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#003366] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ))}
                            </nav>

                            {/* Auth Actions Separator */}
                            <div className="h-px bg-gray-100 my-2"></div>

                            {/* Auth Actions */}
                            <div className="flex flex-col gap-3 px-2 pb-2">
                                {user ? (
                                    <>
                                        <Link
                                            href="/perfil"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-gray-100"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center font-semibold text-lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900">{user.name}</span>
                                                <span className="text-xs text-blue-600 font-medium">Ver mi perfil</span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full mt-2 py-3 px-4 text-center text-red-600 font-medium bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-[#003366] border-2 border-[#003366] rounded-xl hover:bg-blue-50 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            href="/registro"
                                            className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-[#003366] rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#00254D] transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Registrarse
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
