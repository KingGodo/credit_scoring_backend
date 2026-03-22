const express = require('express');
const router = express.Router();
const {
  createProfile, getAllProfiles, getProfileById,
  getProfileByBorrowerId, updateProfile, deleteProfile,
} = require('./borrower-profiles.controller');
const { validateProfile, validateProfileUpdate } = require('./borrower-profiles.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/borrower-profiles  — admin & loan_officer
router.get('/', authenticate, authorize('admin', 'loan_officer'), getAllProfiles);

// GET /api/borrower-profiles/:id  — admin & loan_officer
router.get('/:id', authenticate, authorize('admin', 'loan_officer'), getProfileById);

// GET /api/borrower-profiles/borrower/:borrowerId  — get profile by borrower ID
router.get('/borrower/:borrowerId', authenticate, authorize('admin', 'loan_officer', 'borrower'), getProfileByBorrowerId);

// POST /api/borrower-profiles/borrower/:borrowerId  — create profile for a borrower
router.post('/borrower/:borrowerId', authenticate, authorize('admin', 'loan_officer', 'borrower'), validateProfile, createProfile);

// PUT /api/borrower-profiles/:id  — update profile
router.put('/:id', authenticate, authorize('admin', 'loan_officer', 'borrower'), validateProfileUpdate, updateProfile);

// DELETE /api/borrower-profiles/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteProfile);

module.exports = router;