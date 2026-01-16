interface Appointment {
    id: number;
    patient_name: string;
    date: string;
    time: string;
    service: string;
    status: string;
    [key: string]: any;
}

interface Props {
  appointments: Appointment[];
}

export default function CitasTab({ appointments }: Props) {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Gestión de Citas</h2>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {appointments.map((cita) => (
              <tr key={cita.id}>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{cita.patient_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cita.date} - {cita.time}</td>
                <td className="px-6 py-4 text-sm">
                   <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">{cita.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}