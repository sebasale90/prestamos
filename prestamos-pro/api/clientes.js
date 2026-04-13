import { DB } from "./data";

export default function handler(req, res) {
  if (req.method === "GET") return res.json(DB.clientes);

  if (req.method === "POST") {
    const cliente = { id: Date.now(), ...req.body };
    DB.clientes.push(cliente);
    return res.json(cliente);
  }
}