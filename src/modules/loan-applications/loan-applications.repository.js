const pool = require('../../config/db');

const createApplication = async ({
  application_id, borrower_id, product_id, requested_amount, requested_term,
}) => {
  const result = await pool.query(
    `INSERT INTO loan_applications (application_id, borrower_id, product_id, requested_amount, requested_term)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [application_id, borrower_id, product_id, requested_amount, requested_term]
  );
  return result.rows[0];
};

const getAllApplications = async () => {
  const result = await pool.query(
    `SELECT la.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            lp.product_name, lp.interest_rate,
            l.name AS lender_name
     FROM loan_applications la
     JOIN borrowers b ON la.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN loan_products lp ON la.product_id = lp.product_id
     JOIN lenders l ON lp.lender_id = l.lender_id
     ORDER BY la.submitted_at DESC`
  );
  return result.rows;
};

const getApplicationById = async (application_id) => {
  const result = await pool.query(
    `SELECT la.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            lp.product_name, lp.interest_rate, lp.repayment_frequency,
            l.name AS lender_name
     FROM loan_applications la
     JOIN borrowers b ON la.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN loan_products lp ON la.product_id = lp.product_id
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE la.application_id = $1`,
    [application_id]
  );
  return result.rows[0];
};

const getApplicationsByBorrowerId = async (borrower_id) => {
  const result = await pool.query(
    `SELECT la.*,
            lp.product_name, lp.interest_rate,
            l.name AS lender_name
     FROM loan_applications la
     JOIN loan_products lp ON la.product_id = lp.product_id
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE la.borrower_id = $1
     ORDER BY la.submitted_at DESC`,
    [borrower_id]
  );
  return result.rows;
};

const getApplicationsByStatus = async (application_status) => {
  const result = await pool.query(
    `SELECT la.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            lp.product_name,
            l.name AS lender_name
     FROM loan_applications la
     JOIN borrowers b ON la.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN loan_products lp ON la.product_id = lp.product_id
     JOIN lenders l ON lp.lender_id = l.lender_id
     WHERE la.application_status = $1
     ORDER BY la.submitted_at DESC`,
    [application_status]
  );
  return result.rows;
};

const updateApplicationStatus = async (application_id, application_status) => {
  const result = await pool.query(
    `UPDATE loan_applications
     SET application_status = $1
     WHERE application_id = $2
     RETURNING *`,
    [application_status, application_id]
  );
  return result.rows[0];
};

const deleteApplication = async (application_id) => {
  await pool.query('DELETE FROM loan_applications WHERE application_id = $1', [application_id]);
};

module.exports = {
  createApplication, getAllApplications, getApplicationById,
  getApplicationsByBorrowerId, getApplicationsByStatus,
  updateApplicationStatus, deleteApplication,
};