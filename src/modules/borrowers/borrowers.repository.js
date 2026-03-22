const pool = require('../../config/db');

const createBorrower = async ({ borrower_id, user_id, phone, national_id }) => {
  const result = await pool.query(
    `INSERT INTO borrowers (borrower_id, user_id, phone, national_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [borrower_id, user_id, phone, national_id]
  );
  return result.rows[0];
};

const getAllBorrowers = async () => {
  const result = await pool.query(
    `SELECT b.*, u.email, u.role, u.is_active
     FROM borrowers b
     JOIN users u ON b.user_id = u.user_id
     ORDER BY b.created_at DESC`
  );
  return result.rows;
};

const getBorrowerById = async (borrower_id) => {
  const result = await pool.query(
    `SELECT b.*, u.email, u.role, u.is_active
     FROM borrowers b
     JOIN users u ON b.user_id = u.user_id
     WHERE b.borrower_id = $1`,
    [borrower_id]
  );
  return result.rows[0];
};

const getBorrowerByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT b.*, u.email, u.role, u.is_active
     FROM borrowers b
     JOIN users u ON b.user_id = u.user_id
     WHERE b.user_id = $1`,
    [user_id]
  );
  return result.rows[0];
};

const getBorrowerByNationalId = async (national_id) => {
  const result = await pool.query(
    `SELECT * FROM borrowers WHERE national_id = $1`,
    [national_id]
  );
  return result.rows[0];
};

const updateBorrower = async (borrower_id, { phone, national_id }) => {
  const result = await pool.query(
    `UPDATE borrowers SET phone = $1, national_id = $2
     WHERE borrower_id = $3
     RETURNING *`,
    [phone, national_id, borrower_id]
  );
  return result.rows[0];
};

const deleteBorrower = async (borrower_id) => {
  await pool.query('DELETE FROM borrowers WHERE borrower_id = $1', [borrower_id]);
};

module.exports = {
  createBorrower, getAllBorrowers, getBorrowerById,
  getBorrowerByUserId, getBorrowerByNationalId,
  updateBorrower, deleteBorrower,
};