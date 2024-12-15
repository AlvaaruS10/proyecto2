import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./conexion.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/posts", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM posts");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    res.status(500).send("Error al obtener los posts");
  }
});

app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;

  if (!titulo || !url || !descripcion) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const query =
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *";
    const values = [titulo, url, descripcion];
    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar el post:", error);
    res.status(500).send("Error al agregar el post");
  }
});

app.put("/posts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const query = "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al registrar el like:", error);
    res.status(500).send("Error al registrar el like");
  }
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = "DELETE FROM posts WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    res.status(500).send("Error al eliminar el post");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


