const express = require('express');
const router = express.Router();
const {
  createApplication, getAllApplications, getApplicationById,
  getApplicationsByBorrower, getApplicationsByStatus,
  changeApplicationStatus, deleteApplication,
} = require('./loan-applications.controller');
const { validateCreateApplication, validateStatusUpdate } = require('./loan-applications.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/loan-applications  — admin & loan_officer see all
router.get('/', authenticate, authorize('admin', 'loan_officer'), getAllApplications);

// GET /api/loan-applications/status/:status  — filter by status
// e.g. /api/loan-applications/status/pending
router.get('/status/:status', authenticate, authorize('admin', 'loan_officer'), getApplicationsByStatus);

// GET /api/loan-applications/borrower/:borrowerId  — all apps for one borrower
router.get('/borrower/:borrowerId', authenticate, authorize('admin', 'loan_officer', 'borrower'), getApplicationsByBorrower);

// GET /api/loan-applications/:id  — single application
router.get('/:id', authenticate, authorize('admin', 'loan_officer', 'borrower'), getApplicationById);

// POST /api/loan-applications  — borrower submits an application
router.post('/', authenticate, authorize('admin', 'loan_officer', 'borrower'), validateCreateApplication, createApplication);

// PATCH /api/loan-applications/:id/status  — loan_officer or admin updates status
router.patch('/:id/status', authenticate, authorize('admin', 'loan_officer'), validateStatusUpdate, changeApplicationStatus);

// DELETE /api/loan-applications/:id  — only pending apps, admin only
router.delete('/:id', authenticate, authorize('admin'), deleteApplication);

module.exports = router;