import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ACAR Labs | Gestión de Citas Médicas",
  description: "Encuentra y agenda citas en las mejores clínicas, hospitales y laboratorios de Ecuador. Tu salud, nuestra prioridad.",
  keywords: "citas médicas, clínicas Ecuador, hospitales, laboratorios, salud, ACAR Labs",
  authors: [{ name: "ACAR Studio" }],
  icons: {
    icon: [
      { url: '/Icon-Black.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/Icon-White.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    ],
  },
  openGraph: {
    title: "ACAR Labs | Gestión de Citas Médicas",
    description: "Encuentra y agenda citas en las mejores clínicas, hospitales y laboratorios de Ecuador.",
    type: "website",
    locale: "es_EC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
