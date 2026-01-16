export default function FacturasTab({ invoices }: { invoices: any[] }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Facturas</h2>

      {invoices.map(i => (
        <div key={i.id} className="border p-4 rounded mb-4">
          <p>{i.number}</p>
          <p>{i.date}</p>
          <p>${i.total}</p>
        </div>
      ))}
    </div>
  );
}
