const pool = require('../../config/db');

const createLog = async ({ log_id, user_id, action, entity, entity_id }) => {
  const result = await pool.query(
    `INSERT INTO audit_logs (log_id, user_id, action, entity, entity_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [log_id, user_id, action, entity, entity_id]
  );
  return result.rows[0];
};

const getAllLogs = async () => {
  const result = await pool.query(
    `SELECT al.*,
            u.email AS user_email,
            u.role AS user_role
     FROM audit_logs al
     JOIN users u ON al.user_id = u.user_id
     ORDER BY al.created_at DESC`
  );
  return result.rows;
};

const getLogById = async (log_id) => {
  const result = await pool.query(
    `SELECT al.*,
            u.email AS user_email,
            u.role AS user_role
     FROM audit_logs al
     JOIN users u ON al.user_id = u.user_id
     WHERE al.log_id = $1`,
    [log_id]
  );
  return result.rows[0];
};

const getLogsByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT al.*,
            u.email AS user_email,
            u.role AS user_role
     FROM audit_logs al
     JOIN users u ON al.user_id = u.user_id
     WHERE al.user_id = $1
     ORDER BY al.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

const getLogsByAction = async (action) => {
  const result = await pool.query(
    `SELECT al.*,
            u.email AS user_email,
            u.role AS user_role
     FROM audit_logs al
     JOIN users u ON al.user_id = u.user_id
     WHERE al.action = $1
     ORDER BY al.created_at DESC`,
    [action]
  );
  return result.rows;
};

const getLogsByEntity = async (entity) => {
  const result = await pool.query(
    `SELECT al.*,
            u.email AS user_email,
            u.role AS user_role
     FROM audit_logs al
     JOIN users u ON al.user_id = u.user_id
     WHERE al.entity = $1
     ORDER BY al.created_at DESC`,
    [entity]
  );
  return result.rows;
};

const getLogsByEntityId = async (entity_id) => {
  const result = await pool.query(
    `SELECT al.*,
            u.email AS user_email,
            u.role AS user_role
     FROM audit_logs al
     JOIN users u ON al.user_id = u.user_id
     WHERE al.entity_id = $1
     ORDER BY al.created_at DESC`,
    [entity_id]
  );
  return result.rows;
};

const deleteLog = async (log_id) => {
  await pool.query('DELETE FROM audit_logs WHERE log_id = $1', [log_id]);
};

const clearLogsByUserId = async (user_id) => {
  await pool.query('DELETE FROM audit_logs WHERE user_id = $1', [user_id]);
};

module.exports = {
  createLog, getAllLogs, getLogById,
  getLogsByUserId, getLogsByAction, getLogsByEntity,
  getLogsByEntityId, deleteLog, clearLogsByUserId,
};