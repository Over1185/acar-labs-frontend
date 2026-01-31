'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    variant?: 'hero' | 'compact';
    onSearch?: (query: string, location: string) => void;
}

export default function SearchBar({ variant = 'hero', onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (onSearch) {
            onSearch(query, location);
        } else {
            const params = new URLSearchParams();
            if (query) params.set('q', query);
            if (location) params.set('location', location);
            router.push(`/clinicas?${params.toString()}`);
        }
    };

    if (variant === 'compact') {
        return (
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar clínica, servicio..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-white text-[var(--text-main)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--btn-primary-bg)] transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] font-medium rounded-lg hover:bg-[var(--btn-primary-hover)] transition-colors shadow-md"
                >
                    Buscar
                </button>
            </form>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/10 p-2"
        >
            <div className="flex flex-col md:flex-row gap-2">
                {/* Search Query */}
                <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg
                            className="w-5 h-5 text-[var(--brand-deep-blue)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="¿Qué servicio necesitas?"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-0 bg-[var(--bg-surface)] text-[var(--text-main)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--btn-primary-bg)] transition-all text-lg"
                    />
                </div>

                {/* Location */}
                <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg
                            className="w-5 h-5 text-[var(--btn-primary-bg)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="¿Dónde? (Ciudad o provincia)"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-0 bg-[var(--bg-surface)] text-[var(--text-main)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--btn-primary-bg)] transition-all text-lg"
                    />
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] font-semibold rounded-xl hover:bg-[var(--btn-primary-hover)] transition-all shadow-lg active:scale-[0.98]"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <span className="hidden sm:inline">Buscar</span>
                </button>
            </div>
        </form>
    );
}
