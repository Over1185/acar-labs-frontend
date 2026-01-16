import Link from 'next/link';
import type { Clinic } from '@/lib/api';

interface ClinicCardProps {
    clinic: Clinic;
    featured?: boolean;
}

export default function ClinicCard({ clinic, featured = false }: ClinicCardProps) {
    return (
        <Link
            href={`/clinicas/${clinic.id}`}
            className={`group block bg-white dark:bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-color)] hover:border-[var(--brand-deep-blue)] dark:hover:border-[var(--brand-slate-blue)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand-deep-blue)]/10 ${featured ? 'md:col-span-2 md:row-span-2' : ''
                }`}
        >
            {/* Image Placeholder */}
            <div
                className={`relative bg-gradient-to-br from-[var(--brand-deep-blue)] to-[var(--brand-slate-blue)] ${featured ? 'h-48 md:h-64' : 'h-40'
                    }`}
            >
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Medical Cross Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg
                            className="w-8 h-8 md:w-10 md:h-10 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                        </svg>
                    </div>
                </div>

                {/* Featured Badge */}
                {featured && (
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--status-success)] text-white text-xs font-semibold rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Destacado
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-[var(--text-heading)] group-hover:text-[var(--brand-deep-blue)] dark:group-hover:text-[var(--link-color)] transition-colors line-clamp-1">
                    {clinic.name}
                </h3>

                {/* Location */}
                {clinic.address && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-[var(--text-main)] opacity-70">
                        <svg
                            className="w-4 h-4 flex-shrink-0 text-[var(--brand-slate-blue)]"
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
                        <span className="line-clamp-2">
                            {[clinic.address.province, clinic.address.country || 'Ecuador', clinic.address.city, clinic.address.canton]
                                .filter(Boolean)
                                .join(', ')}
                        </span>
                    </div>
                )}

                {/* CTA */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]">
                    <span className="text-sm font-medium text-[var(--brand-deep-blue)] dark:text-[var(--link-color)]">
                        Ver servicios
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] dark:bg-[#2a2a3e] flex items-center justify-center group-hover:bg-[var(--brand-deep-blue)] dark:group-hover:bg-[var(--brand-slate-blue)] transition-colors">
                        <svg
                            className="w-4 h-4 text-[var(--brand-deep-blue)] dark:text-[var(--link-color)] group-hover:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
