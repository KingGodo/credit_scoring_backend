const pool = require('../../config/db');

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT user_id, email, role, is_active, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
};

const getUserById = async (user_id) => {
  const result = await pool.query(
    `SELECT user_id, email, role, is_active, created_at
     FROM users WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

const updateUser = async (user_id, { email, role }) => {
  const result = await pool.query(
    `UPDATE users SET email = $1, role = $2
     WHERE user_id = $3
     RETURNING user_id, email, role, is_active, created_at`,
    [email, role, user_id]
  );
  return result.rows[0];
};

const toggleUserActive = async (user_id, is_active) => {
  const result = await pool.query(
    `UPDATE users SET is_active = $1
     WHERE user_id = $2
     RETURNING user_id, email, role, is_active`,
    [is_active, user_id]
  );
  return result.rows[0];
};

const updatePassword = async (user_id, password_hash) => {
  const result = await pool.query(
    `UPDATE users SET password_hash = $1
     WHERE user_id = $2
     RETURNING user_id, email`,
    [password_hash, user_id]
  );
  return result.rows[0];
};

const deleteUser = async (user_id) => {
  await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
};

module.exports = {
  getAllUsers, getUserById, getUserByEmail,
  updateUser, toggleUserActive, updatePassword, deleteUser,
};