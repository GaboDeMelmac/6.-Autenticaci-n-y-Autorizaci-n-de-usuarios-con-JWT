const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "274",
  database: "softjobs",
  allowExitOnIdle: true,
});

// Obtener todos los eventos
const getEventos = async () => {
  const { rows: eventos } = await pool.query("SELECT * FROM usuarios");
  return eventos;
};

// Registrar un nuevo usuario
const registrarUsuario = async (email, password, rol, lenguage) => {
  const passwordEncriptada = await bcrypt.hash(password, 10);
  const consulta = `INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)`;
  const values = [email, passwordEncriptada, rol, lenguage];
  await pool.query(consulta, values);
};

// Verificar las credenciales del usuario (login)
const verificarCredenciales = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  const { rows, rowCount } = await pool.query(consulta, values);

  if (!rowCount) throw { code: 401, message: "Credenciales incorrectas" };

  const passwordValida = await bcrypt.compare(password, rows[0].password);
  if (!passwordValida) throw { code: 401, message: "Credenciales incorrectas" };
};

// Eliminar un evento
const deleteEvento = async (id) => {
  const consulta = "DELETE FROM eventos WHERE id = $1";
  const values = [id];
  const { rowCount } = await pool.query(consulta, values);
  if (!rowCount)
    throw { code: 404, message: "No se encontró ningún evento con este ID" };
};

module.exports = {
  getEventos,
  deleteEvento,
  verificarCredenciales,
  registrarUsuario,
  pool, // Exporta pool para usarlo en index.js
};
