const express = require('express');
const router = express.Router();
const {
  recordRepayment, getAllRepayments, getRepaymentById,
  getRepaymentsByLoan, getRepaymentsByBorrower,
  getTotalPaidByLoan, getRepaymentsByMethod, deleteRepayment,
} = require('./repayments.controller');
const { validateRecordRepayment } = require('./repayments.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/repayments  — admin & loan_officer see all
router.get('/', authenticate, authorize('admin', 'loan_officer'), getAllRepayments);

// GET /api/repayments/method/:method  — filter by payment method
// e.g. /api/repayments/method/mobile_money
router.get('/method/:method', authenticate, authorize('admin', 'loan_officer'), getRepaymentsByMethod);

// GET /api/repayments/loan/:loanId  — all repayments for a loan
router.get('/loan/:loanId', authenticate, authorize('admin', 'loan_officer', 'borrower'), getRepaymentsByLoan);

// GET /api/repayments/loan/:loanId/total  — total amount paid for a loan
router.get('/loan/:loanId/total', authenticate, authorize('admin', 'loan_officer', 'borrower'), getTotalPaidByLoan);

// GET /api/repayments/borrower/:borrowerId  — all repayments for a borrower
router.get('/borrower/:borrowerId', authenticate, authorize('admin', 'loan_officer', 'borrower'), getRepaymentsByBorrower);

// GET /api/repayments/:id  — single repayment
router.get('/:id', authenticate, authorize('admin', 'loan_officer', 'borrower'), getRepaymentById);

// POST /api/repayments  — loan_officer records a payment
router.post('/', authenticate, authorize('admin', 'loan_officer'), validateRecordRepayment, recordRepayment);

// DELETE /api/repayments/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteRepayment);

module.exports = router;