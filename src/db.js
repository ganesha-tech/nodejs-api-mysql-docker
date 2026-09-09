const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'appuser',
  password: process.env.MYSQL_PASSWORD || 'apppassword',
  database:
  process.env.NODE_ENV === 'test'
    ? process.env.MYSQL_TEST_DATABASE || 'appdb_test'
    : process.env.MYSQL_DATABASE || 'appdb',

  waitForConnections: true,
  connectionLimit: 10,
});

async function checkDatabaseConnection() {
  const connection = await pool.getConnection();

  try {
    await connection.query('SELECT 1');
    return true;
  } finally {
    connection.release();
  }
}

async function getUsers() {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users ORDER BY id'
  );

  return rows;
}

async function createUser(name, email) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );

  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
}

async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );

  return rows[0];
}

async function updateUser(id, name, email) {
  const [result] = await pool.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getUserById(id);
}

async function deleteUser(id) {
  const [result] = await pool.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}

async function closeDatabaseConnection() {
  await pool.end();
}

module.exports = {
  pool,
  checkDatabaseConnection,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  closeDatabaseConnection,
};