const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const {
  getEventos,
  deleteEvento,
  verificarCredenciales,
  registrarUsuario,
  pool,
} = require("./consultas.js");

app.listen(3000, console.log("SERVER ON"));

app.use(cors());
app.use(express.json());

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
  try {
    const Authorization = req.header("Authorization");
    if (!Authorization) throw { code: 401, message: "Token requerido" };

    const token = Authorization.split("Bearer ")[1];
    const { email } = jwt.verify(token, "az_AZ");
    req.email = email; // Guardamos el email en el request
    next();
  } catch (error) {
    res.status(error.code || 401).send(error.message || "Token inválido");
  }
};

// Middleware para registrar las peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Ruta para obtener los datos del usuario autenticado
app.get("/usuarios", verificarToken, async (req, res) => {
  try {
    const { email } = req;
    const consulta =
      "SELECT email, rol, lenguage FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query(consulta, values);
    res.json(rows[0]);
  } catch (error) {
    res.status(error.code || 500).send(error.message);
  }
});

// Ruta para registrar un nuevo usuario
app.post("/usuarios", async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    await registrarUsuario(email, password, rol, lenguage);
    res.status(201).send("Usuario registrado con éxito");
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send(error.message || "Error en el servidor");
  }
});

// Ruta para iniciar sesión y generar un token
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, "az_AZ");
    res.send({ token });
  } catch (error) {
    console.error(error);
    res
      .status(error.code || 500)
      .send(error.message || "Error al iniciar sesión");
  }
});

// Ruta para eliminar un evento
app.delete("/eventos/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteEvento(id);
    res.send("Evento eliminado con éxito");
  } catch (error) {
    res.status(error.code || 500).send(error.message);
  }
});

// Ruta para actualizar un evento
app.put("/eventos/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const Authorization = req.header("Authorization");
  if (Authorization) {
    const token = Authorization.split("Bearer ")[1];
    // Puedes agregar más lógica de validación aquí
    res.send("Evento actualizado con éxito");
  } else {
    res.status(400).send("Debe enviar el token");
  }
});
