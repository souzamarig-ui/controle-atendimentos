const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connect() {
  await client.connect();
  db = client.db("atendimentos");
  console.log("MongoDB conectado!");
}

app.get("/api/data", async (req, res) => {
  try {
    const doc = await db.collection("dados").findOne({ _id: "mari" });
    if (!doc) return res.json({ patients: [], records: {} });
    const { _id, ...data } = doc;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/data", async (req, res) => {
  try {
    await db.collection("dados").updateOne(
      { _id: "mari" },
      { $set: req.body },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
connect().then(() => app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`)));
