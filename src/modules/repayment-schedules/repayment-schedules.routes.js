const express = require('express');
const router = express.Router();
const {
  generateSchedule, getScheduleByLoan, getScheduleById,
  getPendingByLoan, getOverdue, updateScheduleStatus,
} = require('./repayment-schedules.controller');
const { validateGenerate, validateStatusUpdate } = require('./repayment-schedules.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/repayment-schedules/overdue  — all overdue installments across all loans
router.get('/overdue', authenticate, authorize('admin', 'loan_officer'), getOverdue);

// GET /api/repayment-schedules/loan/:loanId  — full schedule for a loan
router.get('/loan/:loanId', authenticate, authorize('admin', 'loan_officer', 'borrower'), getScheduleByLoan);

// GET /api/repayment-schedules/loan/:loanId/pending  — pending installments for a loan
router.get('/loan/:loanId/pending', authenticate, authorize('admin', 'loan_officer', 'borrower'), getPendingByLoan);

// GET /api/repayment-schedules/:id  — single installment
router.get('/:id', authenticate, authorize('admin', 'loan_officer', 'borrower'), getScheduleById);

// POST /api/repayment-schedules/generate  — generate schedule for a loan
router.post('/generate', authenticate, authorize('admin', 'loan_officer'), validateGenerate, generateSchedule);

// PATCH /api/repayment-schedules/:id/status  — mark installment as paid/overdue/waived
router.patch('/:id/status', authenticate, authorize('admin', 'loan_officer'), validateStatusUpdate, updateScheduleStatus);

module.exports = router;