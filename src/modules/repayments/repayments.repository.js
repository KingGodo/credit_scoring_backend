const pool = require('../../config/db');

const createRepayment = async ({
  repayment_id, loan_id, amount_paid, payment_date, payment_method, recorded_by,
}) => {
  const result = await pool.query(
    `INSERT INTO repayments (repayment_id, loan_id, amount_paid, payment_date, payment_method, recorded_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [repayment_id, loan_id, amount_paid, payment_date, payment_method, recorded_by]
  );
  return result.rows[0];
};

const getAllRepayments = async () => {
  const result = await pool.query(
    `SELECT r.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            ls.full_name AS recorded_by_name,
            ls.position AS recorded_by_position
     FROM repayments r
     JOIN loans lo ON r.loan_id = lo.loan_id
     JOIN borrowers b ON lo.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     LEFT JOIN lender_staff ls ON r.recorded_by = ls.staff_id
     ORDER BY r.created_at DESC`
  );
  return result.rows;
};

const getRepaymentById = async (repayment_id) => {
  const result = await pool.query(
    `SELECT r.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            ls.full_name AS recorded_by_name,
            ls.position AS recorded_by_position
     FROM repayments r
     JOIN loans lo ON r.loan_id = lo.loan_id
     JOIN borrowers b ON lo.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     LEFT JOIN lender_staff ls ON r.recorded_by = ls.staff_id
     WHERE r.repayment_id = $1`,
    [repayment_id]
  );
  return result.rows[0];
};

const getRepaymentsByLoanId = async (loan_id) => {
  const result = await pool.query(
    `SELECT r.*,
            ls.full_name AS recorded_by_name
     FROM repayments r
     LEFT JOIN lender_staff ls ON r.recorded_by = ls.staff_id
     WHERE r.loan_id = $1
     ORDER BY r.payment_date DESC`,
    [loan_id]
  );
  return result.rows;
};

const getRepaymentsByBorrowerId = async (borrower_id) => {
  const result = await pool.query(
    `SELECT r.*,
            lo.principal_amount, lo.interest_rate,
            ls.full_name AS recorded_by_name
     FROM repayments r
     JOIN loans lo ON r.loan_id = lo.loan_id
     LEFT JOIN lender_staff ls ON r.recorded_by = ls.staff_id
     WHERE lo.borrower_id = $1
     ORDER BY r.payment_date DESC`,
    [borrower_id]
  );
  return result.rows;
};

const getTotalPaidByLoanId = async (loan_id) => {
  const result = await pool.query(
    `SELECT COALESCE(SUM(amount_paid), 0) AS total_paid
     FROM repayments WHERE loan_id = $1`,
    [loan_id]
  );
  return parseFloat(result.rows[0].total_paid);
};

const getRepaymentsByPaymentMethod = async (payment_method) => {
  const result = await pool.query(
    `SELECT r.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email
     FROM repayments r
     JOIN loans lo ON r.loan_id = lo.loan_id
     JOIN borrowers b ON lo.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     WHERE r.payment_method = $1
     ORDER BY r.created_at DESC`,
    [payment_method]
  );
  return result.rows;
};

const deleteRepayment = async (repayment_id) => {
  await pool.query('DELETE FROM repayments WHERE repayment_id = $1', [repayment_id]);
};

module.exports = {
  createRepayment, getAllRepayments, getRepaymentById,
  getRepaymentsByLoanId, getRepaymentsByBorrowerId,
  getTotalPaidByLoanId, getRepaymentsByPaymentMethod,
  deleteRepayment,
};