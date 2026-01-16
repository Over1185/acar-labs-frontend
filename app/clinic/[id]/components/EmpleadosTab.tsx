export default function EmpleadosTab({ clinic }: { clinic: any }) {
  if (!clinic?.employees?.length) {
    return <p>No hay empleados</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Empleados</h2>

      {clinic.employees.map((e: any) => (
        <div key={e.id} className="border p-4 rounded mb-4">
          <p>{e.name}</p>
          <p>{e.email}</p>
          <p>{e.role?.name}</p>
        </div>
      ))}
    </div>
  );
}
