'use client';

interface Appointment {
  id: number;
  patient_name?: string;
  scheduled_date: string;
  status: string;
  service?: string;
  user_id?: number;
  user?: {
    name: string;
    email: string;
  };
}

interface Props {
  appointments: Appointment[];
}

export default function CitasTab({ appointments }: Props) {
  const formatDateTime = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) throw new Error();
      return {
        fecha: dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        hora: dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
    } catch (e) {
      return { fecha: 'Fecha inválida', hora: '--:--' };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha / Hora</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {appointments && appointments.length > 0 ? (
              appointments.map((cita) => {
                const { fecha, hora } = formatDateTime(cita.scheduled_date);
                return (
                  <tr key={cita.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {cita.patient_name || cita.user?.name || `ID: ${cita.user_id}`}
                      </div>
                      <div className="text-xs text-gray-500">{cita.service || 'Consulta General'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="block font-medium">{fecha}</span>
                      <span className="text-xs text-gray-400">{hora} hs</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(cita.status)}`}>
                        {cita.status === 'pending' ? 'Pendiente' : 
                         cita.status === 'completed' ? 'Completada' : cita.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No se encontraron citas en la base de datos.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}