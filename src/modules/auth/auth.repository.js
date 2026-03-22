const pool = require('../../config/db');

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async ({ user_id, email, password_hash, role }) => {
  const result = await pool.query(
    `INSERT INTO users (user_id, email, password_hash, role)
     VALUES ($1, $2, $3, $4) RETURNING user_id, email, role, created_at`,
    [user_id, email, password_hash, role]
  );
  return result.rows[0];
};

module.exports = { findUserByEmail, createUser };