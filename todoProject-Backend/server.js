const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

// Enable CORS for all origins (you can restrict later if needed)
app.use(cors());

const dbPath = path.join(__dirname, "todo.db");
let db;

// Initialize the database
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

const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
});

module.exports = app;
