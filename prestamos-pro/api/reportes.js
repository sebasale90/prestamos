import { db } from "../lib/mongo";

export default async function handler(req, res) {
  const database = await db();
  const prestamos = await database.collection("prestamos").find().toArray();

  let prestado = 0;
  let cobrado = 0;

  prestamos.forEach(p => {
    prestado += p.monto;

    p.cuotas.forEach(c => {
      if (c.estado === "pagado") cobrado += c.monto;
    });
  });

  res.json({
    prestado,
    cobrado,
    ganancia: cobrado - prestado
  });
}