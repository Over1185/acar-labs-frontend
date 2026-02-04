'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    variant?: 'hero' | 'compact';
    onSearch?: (query: string) => void;
    redirectPath?: string;
}

const SUGGESTIONS = [
    "Exámenes de sangre",
    "Rayos X",
    "Resonancia magnética",
    "Ecografía abdominal",
    "Hemograma completo",
    "Consulta General",
    "Prueba de embarazo",
    "Examen de orina",
    "Cardiología",
    "Dermatología",
    "Pediatría",
    "Ginecología",
    "Oftalmología",
    "Odontología",
    "Tomografía computarizada",
    "Perfil lipídico"
];

export default function SearchBar({ variant = 'hero', onSearch, redirectPath = '/clinicas' }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (query.trim().length > 1) {
            const filtered = SUGGESTIONS.filter(item =>
                item.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 6); // Limit to 6 suggestions
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSearch = (searchQuery: string) => {
        if (onSearch) {
            onSearch(searchQuery);
        } else {
            const params = new URLSearchParams();
            if (searchQuery) params.set('q', searchQuery);
            router.push(`${redirectPath}?${params.toString()}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        handleSearch(query);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        handleSearch(suggestion);
    };

    if (variant === 'compact') {
        return (
            <form onSubmit={handleSubmit} className="flex gap-2 relative" ref={wrapperRef}>
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-(--border-color) bg-white text-(--text-main) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--btn-primary-bg) transition-all"
                        autoComplete="off"
                    />

                    {/* Suggestions Dropdown Compact */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                            {filteredSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-(--btn-primary-bg) text-(--btn-text) font-medium rounded-lg hover:bg-(--btn-primary-hover) transition-colors shadow-md"
                >
                    Buscar
                </button>
            </form>
        );
    }

    return (
        <form
            ref={wrapperRef}
            onSubmit={handleSubmit}
            className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/10 p-2 relative"
        >
            <div className="flex flex-col md:flex-row gap-2">
                {/* Search Query */}
                <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg
                            className="w-5 h-5 text-(--brand-deep-blue)"
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
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-0 bg-(--bg-surface) text-(--text-main) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--btn-primary-bg) transition-all text-lg"
                        autoComplete="off"
                    />

                    {/* Suggestions Dropdown Hero */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sugerencias</div>
                            {filteredSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <span className="font-medium">{suggestion}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="md:w-48 bg-linear-to-r from-(--btn-primary-bg) to-(--btn-primary-hover) text-(--btn-text) font-bold text-lg rounded-xl hover:shadow-lg hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 py-4"
                >
                    Buscar Citas
                </button>
            </div>
        </form>
    );
}
