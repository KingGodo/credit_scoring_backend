const pool = require('../../config/db');

const createStaff = async ({ staff_id, user_id, lender_id, full_name, position }) => {
  const result = await pool.query(
    `INSERT INTO lender_staff (staff_id, user_id, lender_id, full_name, position)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [staff_id, user_id, lender_id, full_name, position]
  );
  return result.rows[0];
};

const getAllStaff = async () => {
  const result = await pool.query(
    `SELECT ls.*, u.email, u.role, l.name AS lender_name
     FROM lender_staff ls
     JOIN users u ON ls.user_id = u.user_id
     JOIN lenders l ON ls.lender_id = l.lender_id
     ORDER BY ls.created_at DESC`
  );
  return result.rows;
};

const getStaffById = async (staff_id) => {
  const result = await pool.query(
    `SELECT ls.*, u.email, u.role, l.name AS lender_name
     FROM lender_staff ls
     JOIN users u ON ls.user_id = u.user_id
     JOIN lenders l ON ls.lender_id = l.lender_id
     WHERE ls.staff_id = $1`,
    [staff_id]
  );
  return result.rows[0];
};

const getStaffByLenderId = async (lender_id) => {
  const result = await pool.query(
    `SELECT ls.*, u.email, l.name AS lender_name
     FROM lender_staff ls
     JOIN users u ON ls.user_id = u.user_id
     JOIN lenders l ON ls.lender_id = l.lender_id
     WHERE ls.lender_id = $1
     ORDER BY ls.created_at DESC`,
    [lender_id]
  );
  return result.rows;
};

const getStaffByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM lender_staff WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0];
};

const updateStaff = async (staff_id, { full_name, position }) => {
  const result = await pool.query(
    `UPDATE lender_staff SET full_name = $1, position = $2
     WHERE staff_id = $3 RETURNING *`,
    [full_name, position, staff_id]
  );
  return result.rows[0];
};

const deleteStaff = async (staff_id) => {
  await pool.query('DELETE FROM lender_staff WHERE staff_id = $1', [staff_id]);
};

module.exports = {
  createStaff, getAllStaff, getStaffById,
  getStaffByLenderId, getStaffByUserId,
  updateStaff, deleteStaff,
};