const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { MongoClient } = require("mongodb");

const client = new Client();

client.on("qr", qr => qrcode.generate(qr, { small: true }));

client.on("ready", async () => {
  console.log("WhatsApp listo");

  const mongo = new MongoClient(process.env.MONGO_URL);
  await mongo.connect();

  const db = mongo.db("prestamos");

  const prestamos = await db.collection("prestamos").find().toArray();
  const clientes = await db.collection("clientes").find().toArray();

  const hoy = new Date();

  prestamos.forEach(p => {
    const cliente = clientes.find(c => c._id.toString() === p.clienteId);

    if (!cliente?.telefono) return;

    p.cuotas.forEach(c => {
      const diff = (new Date(c.fecha) - hoy) / 86400000;

      if (c.estado === "pendiente" && diff <= 1 && diff > 0) {
        client.sendMessage(
          cliente.telefono + "@c.us",
          `⚠️ Recordatorio: mañana pagas $${c.monto}`
        );
      }

      if (c.estado === "vencido") {
        client.sendMessage(
          cliente.telefono + "@c.us",
          `🚨 Pago vencido de $${c.monto}`
        );
      }
    });
  });

  process.exit();
});

client.initialize();