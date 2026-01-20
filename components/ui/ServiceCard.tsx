import Link from 'next/link';

interface Service {
    id: number | string;
    name: string;
    description?: string;
    estimated_time?: string;
    price: number;
}


interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Link
            href={`/servicios/${service.id}`}
            className="group block bg-white dark:bg-[var(--bg-surface)] rounded-xl p-5 border border-[var(--border-color)] hover:border-[var(--brand-deep-blue)] dark:hover:border-[var(--brand-slate-blue)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--brand-deep-blue)]/5"
        >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-deep-blue)] to-[var(--brand-slate-blue)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                </svg>
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-[var(--text-heading)] group-hover:text-[var(--brand-deep-blue)] dark:group-hover:text-[var(--link-color)] transition-colors">
                {service.name}
            </h3>

            {service.description && (
                <p className="mt-2 text-sm text-[var(--text-main)] opacity-70 line-clamp-2">
                    {service.description}
                </p>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-1 text-sm text-[var(--text-main)] opacity-60">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{service.estimated_time || 'No especificado'}</span>
                </div>

                <span className="text-lg font-bold text-[var(--brand-deep-blue)] dark:text-[var(--link-color)]">
                    ${service.price.toFixed(2)}
                </span>
            </div>
        </Link>
    );
}
