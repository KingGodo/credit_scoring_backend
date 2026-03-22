const pool = require('../../config/db');

const createLoan = async ({
  loan_id, application_id, borrower_id, principal_amount,
  interest_rate, start_date, end_date, loan_status,
}) => {
  const result = await pool.query(
    `INSERT INTO loans (
       loan_id, application_id, borrower_id, principal_amount,
       interest_rate, start_date, end_date, loan_status
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [loan_id, application_id, borrower_id, principal_amount,
     interest_rate, start_date, end_date, loan_status]
  );
  return result.rows[0];
};

const getAllLoans = async () => {
  const result = await pool.query(
    `SELECT lo.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            lp.product_name,
            l.name AS lender_name
     FROM loans lo
     JOIN borrowers b ON lo.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN loan_applications la ON lo.application_id = la.application_id
     JOIN loan_products lp ON la.product_id = lp.product_id
     JOIN lenders l ON lp.lender_id = l.lender_id
     ORDER BY lo.created_at DESC`
  );
  return result.rows;
};

const getLoanById = async (loan_id) => {
  const result = await pool.query(
    `SELECT lo.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            lp.product_name, lp.repayment_frequency,
            l.name AS lender_name
     FROM loans lo
     JOIN borrowers b ON lo.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN loan_applications la ON lo.application_id = la.application_id
     JOIN loan_products lp ON la.product_id = lp.product_id
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE lo.loan_id = $1`,
    [loan_id]
  );
  return result.rows[0];
};

const getLoansByBorrowerId = async (borrower_id) => {
  const result = await pool.query(
    `SELECT lo.*,
            lp.product_name, lp.repayment_frequency,
            l.name AS lender_name
     FROM loans lo
     JOIN loan_applications la ON lo.application_id = la.application_id
     JOIN loan_products lp ON la.product_id = lp.product_id
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE lo.borrower_id = $1
     ORDER BY lo.created_at DESC`,
    [borrower_id]
  );
  return result.rows;
};

const getLoansByStatus = async (loan_status) => {
  const result = await pool.query(
    `SELECT lo.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            lp.product_name,
            l.name AS lender_name
     FROM loans lo
     JOIN borrowers b ON lo.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN loan_applications la ON lo.application_id = la.application_id
     JOIN loan_products lp ON la.product_id = lp.product_id
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE lo.loan_status = $1
     ORDER BY lo.created_at DESC`,
    [loan_status]
  );
  return result.rows;
};

const getLoanByApplicationId = async (application_id) => {
  const result = await pool.query(
    `SELECT * FROM loans WHERE application_id = $1`,
    [application_id]
  );
  return result.rows[0];
};

const updateLoanStatus = async (loan_id, loan_status) => {
  const result = await pool.query(
    `UPDATE loans SET loan_status = $1
     WHERE loan_id = $2
     RETURNING *`,
    [loan_status, loan_id]
  );
  return result.rows[0];
};

const deleteLoan = async (loan_id) => {
  await pool.query('DELETE FROM loans WHERE loan_id = $1', [loan_id]);
};

module.exports = {
  createLoan, getAllLoans, getLoanById,
  getLoansByBorrowerId, getLoansByStatus,
  getLoanByApplicationId, updateLoanStatus, deleteLoan,
};