const pool = require('../../config/db');

const createProduct = async ({
  product_id, lender_id, product_name, description,
  min_amount, max_amount, interest_rate, term_months,
  repayment_frequency,
}) => {
  const result = await pool.query(
    `INSERT INTO loan_products (
       product_id, lender_id, product_name, description,
       min_amount, max_amount, interest_rate, term_months,
       repayment_frequency
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      product_id, lender_id, product_name, description,
      min_amount, max_amount, interest_rate, term_months,
      repayment_frequency,
    ]
  );
  return result.rows[0];
};

const getAllProducts = async () => {
  const result = await pool.query(
    `SELECT lp.*, l.name AS lender_name, l.contact_email AS lender_email
     FROM loan_products lp
     JOIN lenders l ON lp.lender_id = l.lender_id
     ORDER BY lp.created_at DESC`
  );
  return result.rows;
};

const getActiveProducts = async () => {
  const result = await pool.query(
    `SELECT lp.*, l.name AS lender_name, l.contact_email AS lender_email
     FROM loan_products lp
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE lp.is_active = TRUE
     ORDER BY lp.created_at DESC`
  );
  return result.rows;
};

const getProductById = async (product_id) => {
  const result = await pool.query(
    `SELECT lp.*, l.name AS lender_name, l.contact_email AS lender_email
     FROM loan_products lp
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE lp.product_id = $1`,
    [product_id]
  );
  return result.rows[0];
};

const getProductsByLenderId = async (lender_id) => {
  const result = await pool.query(
    `SELECT lp.*, l.name AS lender_name
     FROM loan_products lp
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE lp.lender_id = $1
     ORDER BY lp.created_at DESC`,
    [lender_id]
  );
  return result.rows;
};

const updateProduct = async (product_id, {
  product_name, description, min_amount, max_amount,
  interest_rate, term_months, repayment_frequency,
}) => {
  const result = await pool.query(
    `UPDATE loan_products SET
       product_name = $1, description = $2, min_amount = $3,
       max_amount = $4, interest_rate = $5, term_months = $6,
       repayment_frequency = $7
     WHERE product_id = $8
     RETURNING *`,
    [
      product_name, description, min_amount, max_amount,
      interest_rate, term_months, repayment_frequency, product_id,
    ]
  );
  return result.rows[0];
};

const toggleProductActive = async (product_id, is_active) => {
  const result = await pool.query(
    `UPDATE loan_products SET is_active = $1
     WHERE product_id = $2
     RETURNING *`,
    [is_active, product_id]
  );
  return result.rows[0];
};

const deleteProduct = async (product_id) => {
  await pool.query('DELETE FROM loan_products WHERE product_id = $1', [product_id]);
};

module.exports = {
  createProduct, getAllProducts, getActiveProducts,
  getProductById, getProductsByLenderId,
  updateProduct, toggleProductActive, deleteProduct,
};