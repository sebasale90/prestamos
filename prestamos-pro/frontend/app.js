import { useEffect, useState } from "react";

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    fetch("/api/clientes").then(r => r.json()).then(setClientes);
    fetch("/api/prestamos").then(r => r.json()).then(setPrestamos);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>💰 Préstamos PRO</h1>

      <h2>Clientes</h2>
      {clientes.map(c => <p key={c.id}>{c.nombre}</p>)}

      <h2>Préstamos</h2>
      {prestamos.map(p => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <strong>${p.monto}</strong>

          {p.cuotas.map(c => (
            <div key={c.numero}>
              Cuota {c.numero}: ${c.monto} - {c.estado}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}