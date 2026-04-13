import { DB } from "../api/data";

function send(msg) {
  console.log("📲", msg);
}

function run() {
  const hoy = new Date();

  DB.prestamos.forEach(p => {
    const cliente = DB.clientes.find(c => c.id === p.clienteId);

    if (!cliente) return;

    p.cuotas.forEach(c => {
      const diff = (new Date(c.fecha) - hoy) / 86400000;

      if (c.estado === "pendiente" && diff <= 1 && diff > 0) {
        send(`Recordatorio: mañana pagas $${c.monto} (${cliente.nombre})`);
      }

      if (c.estado === "vencido") {
        send(`⚠️ Vencido: $${c.monto} (${cliente.nombre})`);
      }
    });
  });
}

run();