const express = require('express');
const router = express.Router();
const {
  createBorrower, getAllBorrowers, getBorrowerById,
  getMyBorrowerRecord, updateBorrower, deleteBorrower,
} = require('./borrowers.controller');
const { validateCreateBorrower, validateUpdateBorrower } = require('./borrowers.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/borrowers/me  — logged-in borrower gets their own record
router.get('/me', authenticate, authorize('borrower'), getMyBorrowerRecord);

// GET /api/borrowers  — admin & loan_officer
router.get('/', authenticate, authorize('admin', 'loan_officer'), getAllBorrowers);

// GET /api/borrowers/:id  — admin & loan_officer
router.get('/:id', authenticate, authorize('admin', 'loan_officer'), getBorrowerById);

// POST /api/borrowers  — admin or loan_officer registers a borrower
router.post('/', authenticate, authorize('admin', 'loan_officer'), validateCreateBorrower, createBorrower);

// PUT /api/borrowers/:id  — admin & loan_officer
router.put('/:id', authenticate, authorize('admin', 'loan_officer'), validateUpdateBorrower, updateBorrower);

// DELETE /api/borrowers/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteBorrower);

module.exports = router;