const express = require('express');
const router = express.Router();
const {
  createStaff, getAllStaff, getStaffById,
  getStaffByLender, updateStaff, deleteStaff,
} = require('./lender-staff.controller');
const { validateStaff, validateStaffUpdate } = require('./lender-staff.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/lender-staff
router.get('/', authenticate, authorize('admin'), getAllStaff);

// GET /api/lender-staff/:id
router.get('/:id', authenticate, authorize('admin', 'loan_officer'), getStaffById);

// GET /api/lender-staff/lender/:lenderId  — all staff under a specific lender
router.get('/lender/:lenderId', authenticate, authorize('admin', 'loan_officer'), getStaffByLender);

// POST /api/lender-staff
router.post('/', authenticate, authorize('admin'), validateStaff, createStaff);

// PUT /api/lender-staff/:id
router.put('/:id', authenticate, authorize('admin'), validateStaffUpdate, updateStaff);

// DELETE /api/lender-staff/:id
router.delete('/:id', authenticate, authorize('admin'), deleteStaff);

module.exports = router;