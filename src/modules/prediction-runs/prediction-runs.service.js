const { v4: uuidv4 } = require('uuid');
const {
  createPrediction, getAllPredictions, getPredictionById,
  getPredictionsByBorrowerId, getPredictionsByApplicationId,
  getPredictionsByLoanId, getPredictionsByType,
  getPredictionsByRiskLevel, deletePrediction,
} = require('./prediction-runs.repository');

const VALID_PREDICTION_TYPES = ['application_risk', 'borrower_monitoring', 'portfolio_analysis'];
const VALID_RISK_LEVELS = ['low', 'medium', 'high', 'very_high'];

const create = async ({
  borrower_id, loan_id, application_id, model_id,
  default_probability, credit_score, risk_level, prediction_type,
}) => {
  if (!VALID_PREDICTION_TYPES.includes(prediction_type)) {
    throw {
      statusCode: 400,
      message: `Invalid prediction_type. Must be one of: ${VALID_PREDICTION_TYPES.join(', ')}.`,
    };
  }

  if (!VALID_RISK_LEVELS.includes(risk_level)) {
    throw {
      statusCode: 400,
      message: `Invalid risk_level. Must be one of: ${VALID_RISK_LEVELS.join(', ')}.`,
    };
  }

  if (default_probability < 0 || default_probability > 1) {
    throw { statusCode: 400, message: 'default_probability must be between 0 and 1.' };
  }

  if (credit_score < 0 || credit_score > 1000) {
    throw { statusCode: 400, message: 'credit_score must be between 0 and 1000.' };
  }

  const prediction_id = uuidv4();
  return createPrediction({
    prediction_id, borrower_id, loan_id, application_id,
    model_id, default_probability, credit_score, risk_level, prediction_type,
  });
};

const fetchAll = async () => getAllPredictions();

const fetchById = async (prediction_id) => {
  const prediction = await getPredictionById(prediction_id);
  if (!prediction) throw { statusCode: 404, message: 'Prediction run not found.' };
  return prediction;
};

const fetchByBorrower = async (borrower_id) => getPredictionsByBorrowerId(borrower_id);

const fetchByApplication = async (application_id) => getPredictionsByApplicationId(application_id);

const fetchByLoan = async (loan_id) => getPredictionsByLoanId(loan_id);

const fetchByType = async (prediction_type) => {
  if (!VALID_PREDICTION_TYPES.includes(prediction_type)) {
    throw {
      statusCode: 400,
      message: `Invalid prediction_type. Must be one of: ${VALID_PREDICTION_TYPES.join(', ')}.`,
    };
  }
  return getPredictionsByType(prediction_type);
};

const fetchByRiskLevel = async (risk_level) => {
  if (!VALID_RISK_LEVELS.includes(risk_level)) {
    throw {
      statusCode: 400,
      message: `Invalid risk_level. Must be one of: ${VALID_RISK_LEVELS.join(', ')}.`,
    };
  }
  return getPredictionsByRiskLevel(risk_level);
};

const remove = async (prediction_id) => {
  const existing = await getPredictionById(prediction_id);
  if (!existing) throw { statusCode: 404, message: 'Prediction run not found.' };
  await deletePrediction(prediction_id);
};

module.exports = {
  create, fetchAll, fetchById, fetchByBorrower,
  fetchByApplication, fetchByLoan, fetchByType,
  fetchByRiskLevel, remove,
};