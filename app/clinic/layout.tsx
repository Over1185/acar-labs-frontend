import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Clínica",
  description: "Dashboard de la clínica",
};

export default function ClinicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
