interface Props {
  clinic: any;
  userRole: string | null;
  appointments: any[];
  services: any[];
  labResults: any[];
  invoices: any[];
}

export default function HomeTab({
  clinic,
  userRole,
  appointments,
  services,
  labResults,
  invoices,
}: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-4 gap-6">
        <div>Total Citas: {appointments.length}</div>
        <div>Servicios: {services.length}</div>
        <div>Resultados: {labResults.length}</div>
        <div>
          Facturas pendientes:{' '}
          {invoices.filter(i => i.status !== 'paid').length}
        </div>
      </div>
    </div>
  );
}
