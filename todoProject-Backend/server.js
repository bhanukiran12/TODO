import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// point to read-only db file bundled in the repo
const dbPath = path.join(__dirname, "todo.db");

let db;

// open DB once at startup
async function initDb() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  console.log("SQLite database connected");
}

// GET all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await db.all("SELECT * FROM todo");
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// POST bulk insert
app.post("/todos/save", async (req, res) => {
  try {
    const { data } = req.body;
    const stmt = await db.prepare(
      "INSERT INTO todo (id, name, status) VALUES (?, ?, ?)"
    );
    for (const { id, name, status } of data) {
      await stmt.run(id, name, status);
    }
    await stmt.finalize();
    res.json({ message: "All todos saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save todos" });
  }
});

// DELETE all todos
app.delete("/todos/delete", async (req, res) => {
  try {
    await db.run("DELETE FROM todo");
    res.json({ message: "All todos deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todos" });
  }
});

// initialize DB then start server (local dev only)
const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
});

export default app; // required for Vercel’s serverless detection
