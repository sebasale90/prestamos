import { db } from "../lib/mongo";

function generarCuotas(monto, interes, meses) {
  let r = interes / 100 / 12;
  let cuota =
    monto *
    (r * Math.pow(1 + r, meses)) /
    (Math.pow(1 + r, meses) - 1);

  let fecha = new Date();

  return Array.from({ length: meses }).map((_, i) => {
    fecha.setMonth(fecha.getMonth() + 1);

    return {
      numero: i + 1,
      monto: Number(cuota.toFixed(2)),
      fecha,
      estado: "pendiente"
    };
  });
}

export default async function handler(req, res) {
  const database = await db();
  const col = database.collection("prestamos");

  if (req.method === "GET") {
    return res.json(await col.find().toArray());
  }

  if (req.method === "POST") {
    const p = {
      ...req.body,
      cuotas: generarCuotas(
        req.body.monto,
        req.body.interes,
        req.body.meses
      ),
      createdAt: new Date()
    };

    const result = await col.insertOne(p);
    return res.json(result);
  }
}