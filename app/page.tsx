/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import FeatureCard from "@/components/ui/FeatureCard";

// Helper helper to fetch clinics
async function getFeaturedClinics() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // Fetch data with revalidation to keep it somewhat fresh but performant
    const res = await fetch(`${apiUrl}/public/clinics`, { next: { revalidate: 60 } });

    if (!res.ok) {
      // Si falla, retornamos arreglos vacíos o mock data de contingencia si prefieres
      console.error(`Error fetching clinics: ${res.status}`);
      return [];
    }

    const data = await res.json();
    let clinicsData: any[] = [];

    // Normalización de la respuesta según lo visto en clinicas/page.tsx
    if (Array.isArray(data?.data)) clinicsData = data.data;
    else if (Array.isArray(data)) clinicsData = data;
    else if (Array.isArray(data?.clinics)) clinicsData = data.clinics;

    // Tomamos las primeras 4 para mostrarlas como destacadas
    return clinicsData.slice(0, 4).map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address || { city: "Ubicación", province: "General" }
    }));

  } catch (error) {
    console.error("Failed to fetch featured clinics:", error);
    return [];
  }
}

// Helper to fetch popular services from clinics data
async function getPopularServices() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/public/clinics`, { next: { revalidate: 60 } });

    if (!res.ok) return [];

    const data = await res.json();
    let clinics: any[] = [];

    if (Array.isArray(data?.data)) clinics = data.data;
    else if (Array.isArray(data)) clinics = data;
    else if (Array.isArray(data?.clinics)) clinics = data.clinics;

    // Aggregate services
    const serviceCounts: Record<string, number> = {};

    clinics.forEach(clinic => {
      if (Array.isArray(clinic.services)) {
        clinic.services.forEach((s: any) => {
          if (s.name) {
            const name = s.name.trim();
            serviceCounts[name] = (serviceCounts[name] || 0) + 1;
          }
        });
      }
    });

    // Helper for icons
    function getServiceIcon(name: string) {
      const n = name.toLowerCase();
      if (n.includes('sangre') || n.includes('hemograma') || n.includes('hemat')) return "🩸";
      if (n.includes('rayos') || n.includes('radi')) return "🦴";
      if (n.includes('cardio') || n.includes('coraz')) return "❤️";
      if (n.includes('eco') || n.includes('sonogra')) return "📊";
      if (n.includes('medicina') || n.includes('consulta') || n.includes('general')) return "🩺";
      if (n.includes('laboratorio')) return "🔬";
      if (n.includes('dental') || n.includes('odonto')) return "🦷";
      if (n.includes('ojo') || n.includes('oftalmo')) return "👁️";
      if (n.includes('ginec')) return "👩‍⚕️";
      if (n.includes('pedia')) return "👶";
      if (n.includes('resona')) return "🧠";
      if (n.includes('tomo')) return "💻";
      return "🏥";
    }

    return Object.entries(serviceCounts)
      .map(([name, count]) => ({
        id: name,
        name,
        count,
        icon: getServiceIcon(name)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

  } catch (error) {
    console.error("Failed to fetch popular services:", error);
    return [];
  }
}

// Stats data

// Stats data
const stats = [
  { value: "500+", label: "Clínicas registradas" },
  { value: "10,000+", label: "Citas agendadas" },
  { value: "50+", label: "Ciudades" },
  { value: "98%", label: "Satisfacción" },
];

export default async function Home() {
  const featuredClinics = await getFeaturedClinics();
  const popularServicesData = await getPopularServices();

  // Use fetched services for pills if available, otherwise fallback (or empty)
  const searchTerms = popularServicesData.length > 0
    ? popularServicesData.slice(0, 4).map(s => s.name)
    : ["Análisis de sangre", "Rayos X", "Medicina general", "Ecografía"];

  return (
    <div className="bg-(--bg-page)">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-[#003366] via-[#004C7F] to-[#4A708B]">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.5]">
          <Image
            src="/images/main/Banner.avif"
            alt="Decorative pattern"
            fill
            className="object-cover"
          />
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {/* Logo Icon */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <Image
                src="/Icon.svg"
                alt="ACAR Labs"
                width={64}
                height={64}
                className="w-12 h-12"
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Tu salud, <span className="text-white/90">nuestra prioridad</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-12">
            Encuentra y agenda citas en las mejores clínicas, hospitales y laboratorios de Ecuador.
            Fácil, rápido y seguro.
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar redirectPath="/servicios" />
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="text-white/60">Búsquedas populares:</span>
            {searchTerms.map((term) => (
              <Link
                key={term}
                href={`/clinicas?q=${encodeURIComponent(term)}`}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg fill="none" stroke="currentColor" className="w-6 h-6 text-white/60" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m19 14-7 7m0 0-7-7m7 7V3" strokeWidth={2} /></svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-(--bg-surface) border-y border-(--border-color)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-(--btn-primary-bg)">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-(--text-secondary)">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-(--text-heading)">
              Servicios Populares
            </h2>
            <p className="mt-3 text-(--text-secondary) max-w-2xl mx-auto">
              Explora los servicios más buscados por nuestros usuarios
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularServicesData.length > 0 ? (
              popularServicesData.map((service) => (
                <Link
                  key={service.id}
                  href={`/servicios?q=${encodeURIComponent(service.name)}`}
                  className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-(--border-color) hover:border-(--btn-primary-bg) transition-all hover:shadow-lg"
                >
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </span>
                  <span className="text-sm font-medium text-(--text-heading) text-center line-clamp-2 min-h-[40px] flex items-center">
                    {service.name}
                  </span>
                  <span className="text-xs text-(--text-secondary) mt-1">
                    {service.count} clínicas
                  </span>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10 opacity-50">
                <p>No se encontraron servicios populares</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Clinics Section */}
      <section className="py-20 bg-(--bg-surface)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-(--text-heading)">
                Clínicas Destacadas
              </h2>
              <p className="mt-2 text-(--text-secondary)">
                Las mejores opciones verificadas por ACAR Labs
              </p>
            </div>
            <Link
              href="/clinicas"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-(--link-color) border border-(--link-color) rounded-full hover:bg-(--btn-primary-bg) hover:text-(--btn-text) hover:border-(--btn-primary-bg) transition-all"
            >
              Ver todas
              <svg fill="none" stroke="currentColor" className="w-4 h-4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" strokeWidth={2} /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredClinics.length > 0 ? (
              featuredClinics.map((clinic, index) => (
                <Link
                  key={clinic.id}
                  href={`/clinicas/${clinic.id}`} // Updated path to match file structure [id]
                  className="group block bg-white rounded-2xl overflow-hidden border border-(--border-color) hover:border-(--btn-primary-bg) transition-all duration-300 hover:shadow-xl"
                >
                  {/* Image Placeholder */}
                  <div className="relative h-40 bg-linear-to-br from-[#003366] to-[#4A708B]">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-[0.08]">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100"><path d="M0 0h100v100H0z" fill={`url(#grid-${clinic.id})`} /></svg>
                    </div>

                    {/* Medical Cross Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Featured Badge for first item */}
                    {index === 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-(--status-success) text-white text-xs font-semibold rounded-full">
                          <svg fill="currentColor" className="w-3 h-3" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" /></svg>
                          Destacado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-(--text-heading) group-hover:text-(--link-hover) transition-colors line-clamp-1">
                      {clinic.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 mt-2 text-sm text-(--text-secondary)">
                      <svg fill="none" stroke="currentColor" className="w-4 h-4 shrink-0 text-(--btn-secondary-bg)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0" strokeWidth={2} /></svg>
                      <span className="line-clamp-1">
                        {clinic.address.city}, {clinic.address.province}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-(--border-color)">
                      <span className="text-sm font-medium text-(--link-color)">
                        Ver servicios
                      </span>
                      <div className="w-8 h-8 rounded-full bg-(--bg-surface) flex items-center justify-center group-hover:bg-(--btn-primary-bg) transition-colors">
                        <svg fill="none" stroke="currentColor" className="w-4 h-4 text-(--link-color) group-hover:text-white transition-colors" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" strokeWidth={2} /></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">No hay clínicas destacadas por el momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-(--text-heading)">
              ¿Por qué elegir ACAR Labs?
            </h2>
            <p className="mt-3 text-(--text-main) opacity-70 max-w-2xl mx-auto">
              La plataforma más completa para gestionar tu salud en Ecuador
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" className="w-7 h-7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" strokeWidth={2} /></svg>
              }
              title="Búsqueda Inteligente"
              description="Encuentra clínicas, hospitales y laboratorios cerca de ti con filtros avanzados por especialidad, ubicación y disponibilidad."
            />
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" className="w-7 h-7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2" strokeWidth={2} /></svg>
              }
              title="Agenda en Segundos"
              description="Reserva tu cita en pocos clics. Visualiza horarios disponibles en tiempo real y recibe confirmación instantánea."
            />
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" className="w-7 h-7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4m5.618-4.016A11.96 11.96 0 0 1 12 2.944a11.96 11.96 0 0 1-8.618 3.04A12 12 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016" strokeWidth={2} /></svg>
              }
              title="100% Seguro"
              description="Tu información personal y médica está protegida con los más altos estándares de seguridad y encriptación."
            />
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" className="w-7 h-7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.03 2.03 0 0 1 18 14.158V11a6 6 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" strokeWidth={2} /></svg>
              }
              title="Recordatorios"
              description="Recibe notificaciones automáticas para no olvidar tus citas. Te avisamos con anticipación por email y SMS."
            />
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" className="w-7 h-7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" strokeWidth={2} /></svg>
              }
              title="Historial Digital"
              description="Accede a tu historial de citas y resultados de laboratorio desde cualquier dispositivo, en cualquier momento."
            />
            <FeatureCard
              icon={
                <svg fill="none" stroke="currentColor" className="w-7 h-7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-1.414-.586m0 0L11 14h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4z" strokeWidth={2} /></svg>
              }
              title="Soporte 24/7"
              description="Nuestro equipo está disponible las 24 horas para ayudarte con cualquier duda o inconveniente que tengas."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-[#003366] via-[#004C7F] to-[#4A708B] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Listo para cuidar tu salud?
          </h2>
          <p className="text-lg text-white/75 mb-8 max-w-2xl mx-auto">
            Únete a miles de ecuatorianos que ya confían en ACAR Labs para gestionar sus citas médicas.
            Es gratis y solo toma un minuto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/registro"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#003366] font-semibold rounded-full hover:bg-white/95 transition-all shadow-lg hover:shadow-xl"
            >
              Crear cuenta gratis
              <svg fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m13 7 5 5m0 0-5 5m5-5H6" strokeWidth={2} /></svg>
            </Link>
            <Link
              href="/clinicas"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/60 transition-all"
            >
              Explorar clínicas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
