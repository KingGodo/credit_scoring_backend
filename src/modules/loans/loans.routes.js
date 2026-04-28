const express = require('express');
const router = express.Router();
const {
  createLoan, getAllLoans, getLoanById,
  getLoansByBorrower, getLoansByStatus,
  changeLoanStatus, deleteLoan,
} = require('./loans.controller');
const { validateCreateLoan, validateStatusUpdate } = require('./loans.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/loans  — admin & loan_officer see all
router.get('/', authenticate, authorize('admin', 'loan_officer'), getAllLoans);

// GET /api/loans/status/:status  — filter by status
// e.g. /api/loans/status/active
router.get('/status/:status', authenticate, authorize('admin', 'loan_officer'), getLoansByStatus);

// GET /api/loans/borrower/:borrowerId  — all loans for a borrower
router.get('/borrower/:borrowerId', authenticate, authorize('admin', 'loan_officer', 'borrower'), getLoansByBorrower);

// GET /api/loans/:id  — single loan detail
router.get('/:id', authenticate, authorize('admin', 'loan_officer', 'borrower'), getLoanById);

// POST /api/loans  — admin, loan_officer, and borrower (for auto-creation after application)
router.post('/', authenticate, authorize('admin', 'loan_officer', 'borrower'), validateCreateLoan, createLoan);

// PATCH /api/loans/:id/status  — update loan status
router.patch('/:id/status', authenticate, authorize('admin', 'loan_officer'), validateStatusUpdate, changeLoanStatus);

// DELETE /api/loans/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteLoan);

module.exports = router;