const {
  create, fetchAll, fetchById, fetchByBorrower,
  fetchByApplication, fetchByLoan, fetchByType,
  fetchByRiskLevel, remove,
} = require('./prediction-runs.service');
const { sendSuccess } = require('../../utils/response');

// POST /api/prediction-runs
const createPrediction = async (req, res, next) => {
  try {
    const prediction = await create(req.body);
    return sendSuccess(res, prediction, 'Prediction run recorded successfully.', 201);
  } catch (err) { next(err); }
};

// GET /api/prediction-runs
const getAllPredictions = async (req, res, next) => {
  try {
    const predictions = await fetchAll();
    return sendSuccess(res, predictions);
  } catch (err) { next(err); }
};

// GET /api/prediction-runs/:id
const getPredictionById = async (req, res, next) => {
  try {
    const prediction = await fetchById(req.params.id);
    return sendSuccess(res, prediction);
  } catch (err) { next(err); }
};

// GET /api/prediction-runs/borrower/:borrowerId
const getPredictionsByBorrower = async (req, res, next) => {
  try {
    const predictions = await fetchByBorrower(req.params.borrowerId);
    return sendSuccess(res, predictions);
  } catch (err) { next(err); }
};

// GET /api/prediction-runs/application/:applicationId
const getPredictionsByApplication = async (req, res, next) => {
  try {
    const predictions = await fetchByApplication(req.params.applicationId);
    return sendSuccess(res, predictions);
  } catch (err) { next(err); }
};

// GET /api/prediction-runs/loan/:loanId
const getPredictionsByLoan = async (req, res, next) => {
  try {
    const predictions = await fetchByLoan(req.params.loanId);
    return sendSuccess(res, predictions);
  } catch (err) { next(err); }
};

// GET /api/prediction-runs/type/:type
const getPredictionsByType = async (req, res, next) => {
  try {
    const predictions = await fetchByType(req.params.type);
    return sendSuccess(res, predictions);
  } catch (err) { next(err); }
};

// GET /api/prediction-runs/risk/:level
const getPredictionsByRiskLevel = async (req, res, next) => {
  try {
    const predictions = await fetchByRiskLevel(req.params.level);
    return sendSuccess(res, predictions);
  } catch (err) { next(err); }
};

// DELETE /api/prediction-runs/:id
const deletePrediction = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Prediction run deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  createPrediction, getAllPredictions, getPredictionById,
  getPredictionsByBorrower, getPredictionsByApplication,
  getPredictionsByLoan, getPredictionsByType,
  getPredictionsByRiskLevel, deletePrediction,
};