interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="group bg-white rounded-2xl p-6 border border-[var(--border-color)] hover:border-[var(--brand-deep-blue)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--brand-deep-blue)]/5">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-deep-blue)]/10 to-[var(--brand-slate-blue)]/10 flex items-center justify-center mb-5 group-hover:from-[var(--brand-deep-blue)] group-hover:to-[var(--brand-slate-blue)] transition-all duration-300">
                <div className="text-[var(--brand-deep-blue)] group-hover:text-white transition-colors">
                    {icon}
                </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-[var(--text-heading)]">
                {title}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-main)] opacity-70 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
