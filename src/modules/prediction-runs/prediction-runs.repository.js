const pool = require('../../config/db');

const createPrediction = async ({
  prediction_id, borrower_id, loan_id, application_id,
  model_id, default_probability, credit_score, risk_level, prediction_type,
}) => {
  const result = await pool.query(
    `INSERT INTO prediction_runs (
       prediction_id, borrower_id, loan_id, application_id,
       model_id, default_probability, credit_score, risk_level, prediction_type
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      prediction_id, borrower_id, loan_id, application_id,
      model_id, default_probability, credit_score, risk_level, prediction_type,
    ]
  );
  return result.rows[0];
};

const getAllPredictions = async () => {
  const result = await pool.query(
    `SELECT pr.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            mv.model_name, mv.model_version
     FROM prediction_runs pr
     JOIN borrowers b ON pr.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN model_versions mv ON pr.model_id = mv.model_id
     ORDER BY pr.created_at DESC`
  );
  return result.rows;
};

const getPredictionById = async (prediction_id) => {
  const result = await pool.query(
    `SELECT pr.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            mv.model_name, mv.model_version, mv.training_dataset
     FROM prediction_runs pr
     JOIN borrowers b ON pr.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN model_versions mv ON pr.model_id = mv.model_id
     WHERE pr.prediction_id = $1`,
    [prediction_id]
  );
  return result.rows[0];
};

const getPredictionsByBorrowerId = async (borrower_id) => {
  const result = await pool.query(
    `SELECT pr.*,
            mv.model_name, mv.model_version
     FROM prediction_runs pr
     JOIN model_versions mv ON pr.model_id = mv.model_id
     WHERE pr.borrower_id = $1
     ORDER BY pr.created_at DESC`,
    [borrower_id]
  );
  return result.rows;
};

const getPredictionsByApplicationId = async (application_id) => {
  const result = await pool.query(
    `SELECT pr.*,
            mv.model_name, mv.model_version
     FROM prediction_runs pr
     JOIN model_versions mv ON pr.model_id = mv.model_id
     WHERE pr.application_id = $1
     ORDER BY pr.created_at DESC`,
    [application_id]
  );
  return result.rows;
};

const getPredictionsByLoanId = async (loan_id) => {
  const result = await pool.query(
    `SELECT pr.*,
            mv.model_name, mv.model_version
     FROM prediction_runs pr
     JOIN model_versions mv ON pr.model_id = mv.model_id
     WHERE pr.loan_id = $1
     ORDER BY pr.created_at DESC`,
    [loan_id]
  );
  return result.rows;
};

const getPredictionsByType = async (prediction_type) => {
  const result = await pool.query(
    `SELECT pr.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            mv.model_name, mv.model_version
     FROM prediction_runs pr
     JOIN borrowers b ON pr.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN model_versions mv ON pr.model_id = mv.model_id
     WHERE pr.prediction_type = $1
     ORDER BY pr.created_at DESC`,
    [prediction_type]
  );
  return result.rows;
};

const getPredictionsByRiskLevel = async (risk_level) => {
  const result = await pool.query(
    `SELECT pr.*,
            bp.first_name, bp.last_name,
            u.email AS borrower_email,
            mv.model_name, mv.model_version
     FROM prediction_runs pr
     JOIN borrowers b ON pr.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     LEFT JOIN borrower_profiles bp ON b.borrower_id = bp.borrower_id
     JOIN model_versions mv ON pr.model_id = mv.model_id
     WHERE pr.risk_level = $1
     ORDER BY pr.created_at DESC`,
    [risk_level]
  );
  return result.rows;
};

const deletePrediction = async (prediction_id) => {
  await pool.query('DELETE FROM prediction_runs WHERE prediction_id = $1', [prediction_id]);
};

module.exports = {
  createPrediction, getAllPredictions, getPredictionById,
  getPredictionsByBorrowerId, getPredictionsByApplicationId,
  getPredictionsByLoanId, getPredictionsByType,
  getPredictionsByRiskLevel, deletePrediction,
};