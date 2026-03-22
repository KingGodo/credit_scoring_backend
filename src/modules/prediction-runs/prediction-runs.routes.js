const express = require('express');
const router = express.Router();
const {
  createPrediction, getAllPredictions, getPredictionById,
  getPredictionsByBorrower, getPredictionsByApplication,
  getPredictionsByLoan, getPredictionsByType,
  getPredictionsByRiskLevel, deletePrediction,
} = require('./prediction-runs.controller');
const { validateCreatePrediction } = require('./prediction-runs.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/prediction-runs  — all predictions
router.get('/', authenticate, authorize('admin', 'loan_officer'), getAllPredictions);

// GET /api/prediction-runs/type/:type  — filter by prediction type
// e.g. /api/prediction-runs/type/application_risk
router.get('/type/:type', authenticate, authorize('admin', 'loan_officer'), getPredictionsByType);

// GET /api/prediction-runs/risk/:level  — filter by risk level
// e.g. /api/prediction-runs/risk/high
router.get('/risk/:level', authenticate, authorize('admin', 'loan_officer'), getPredictionsByRiskLevel);

// GET /api/prediction-runs/borrower/:borrowerId  — all predictions for a borrower
router.get('/borrower/:borrowerId', authenticate, authorize('admin', 'loan_officer'), getPredictionsByBorrower);

// GET /api/prediction-runs/application/:applicationId  — predictions for an application
router.get('/application/:applicationId', authenticate, authorize('admin', 'loan_officer'), getPredictionsByApplication);

// GET /api/prediction-runs/loan/:loanId  — predictions for a loan
router.get('/loan/:loanId', authenticate, authorize('admin', 'loan_officer'), getPredictionsByLoan);

// GET /api/prediction-runs/:id  — single prediction detail
router.get('/:id', authenticate, authorize('admin', 'loan_officer'), getPredictionById);

// POST /api/prediction-runs  — admin records a prediction result from the ML model
router.post('/', authenticate, authorize('admin'), validateCreatePrediction, createPrediction);

// DELETE /api/prediction-runs/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deletePrediction);

module.exports = router;