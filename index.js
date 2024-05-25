const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Create

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Get All

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// Get Single

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [id]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Update

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description=$1 WHERE todo_id=$2 RETURNING *",
      [description, id]
    );
    res.json("Todo is updated");
  } catch (error) {
    console.error(error.message);
  }
});

// Delete

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id=$1", [
      id,
    ]);
    res.json("Todo was deleted");
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
