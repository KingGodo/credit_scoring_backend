const pool = require('../../config/db');

const getAllLenders = async () => {
  const result = await pool.query('SELECT * FROM lenders ORDER BY created_at DESC');
  return result.rows;
};

const getLenderById = async (lender_id) => {
  const result = await pool.query('SELECT * FROM lenders WHERE lender_id = $1', [lender_id]);
  return result.rows[0];
};

const createLender = async ({ lender_id, name, registration_number, contact_email, contact_phone, address }) => {
  const result = await pool.query(
    `INSERT INTO lenders (lender_id, name, registration_number, contact_email, contact_phone, address)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [lender_id, name, registration_number, contact_email, contact_phone, address]
  );
  return result.rows[0];
};

const updateLender = async (lender_id, fields) => {
  const { name, contact_email, contact_phone, address } = fields;
  const result = await pool.query(
    `UPDATE lenders SET name=$1, contact_email=$2, contact_phone=$3, address=$4
     WHERE lender_id=$5 RETURNING *`,
    [name, contact_email, contact_phone, address, lender_id]
  );
  return result.rows[0];
};

const deleteLender = async (lender_id) => {
  await pool.query('DELETE FROM lenders WHERE lender_id = $1', [lender_id]);
};

module.exports = { getAllLenders, getLenderById, createLender, updateLender, deleteLender };