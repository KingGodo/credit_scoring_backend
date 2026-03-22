const express = require('express');
const router = express.Router();
const {
  uploadDocument, getAllDocuments, getDocumentById,
  getDocumentsByBorrower, getDocumentsByStatus,
  verifyDocument, deleteDocument,
} = require('./borrower-documents.controller');
const { validateUpload, validateVerify } = require('./borrower-documents.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/borrower-documents  — admin & loan_officer see all docs
router.get('/', authenticate, authorize('admin', 'loan_officer'), getAllDocuments);

// GET /api/borrower-documents/status/:status  — filter by verification status
// e.g. /api/borrower-documents/status/pending
router.get('/status/:status', authenticate, authorize('admin', 'loan_officer'), getDocumentsByStatus);

// GET /api/borrower-documents/borrower/:borrowerId  — all docs for one borrower
router.get('/borrower/:borrowerId', authenticate, authorize('admin', 'loan_officer', 'borrower'), getDocumentsByBorrower);

// GET /api/borrower-documents/:id  — single document
router.get('/:id', authenticate, authorize('admin', 'loan_officer', 'borrower'), getDocumentById);

// POST /api/borrower-documents  — borrower uploads a document
router.post('/', authenticate, authorize('admin', 'loan_officer', 'borrower'), validateUpload, uploadDocument);

// PATCH /api/borrower-documents/:id/verify  — loan_officer or admin verifies/rejects
router.patch('/:id/verify', authenticate, authorize('admin', 'loan_officer'), validateVerify, verifyDocument);

// DELETE /api/borrower-documents/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteDocument);

module.exports = router;