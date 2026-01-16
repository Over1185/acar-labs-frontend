export default function LaboratorioTab({ labResults }: { labResults: any[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Laboratorio</h2>

      {labResults.map(r => (
        <div key={r.id} className="border p-4 rounded mb-4">
          <p>{r.name}</p>
          <p>{r.date}</p>
          <p>{r.status}</p>
        </div>
      ))}
    </div>
  );
}
