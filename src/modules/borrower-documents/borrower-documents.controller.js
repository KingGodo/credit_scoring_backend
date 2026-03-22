const { upload, fetchAll, fetchById, fetchByBorrowerId, fetchByStatus, verify, remove } = require('./borrower-documents.service');
const { sendSuccess } = require('../../utils/response');

// POST /api/borrower-documents
const uploadDocument = async (req, res, next) => {
  try {
    const doc = await upload(req.body);
    return sendSuccess(res, doc, 'Document uploaded successfully.', 201);
  } catch (err) { next(err); }
};

// GET /api/borrower-documents
const getAllDocuments = async (req, res, next) => {
  try {
    const docs = await fetchAll();
    return sendSuccess(res, docs);
  } catch (err) { next(err); }
};

// GET /api/borrower-documents/:id
const getDocumentById = async (req, res, next) => {
  try {
    const doc = await fetchById(req.params.id);
    return sendSuccess(res, doc);
  } catch (err) { next(err); }
};

// GET /api/borrower-documents/borrower/:borrowerId
const getDocumentsByBorrower = async (req, res, next) => {
  try {
    const docs = await fetchByBorrowerId(req.params.borrowerId);
    return sendSuccess(res, docs);
  } catch (err) { next(err); }
};

// GET /api/borrower-documents/status/:status
const getDocumentsByStatus = async (req, res, next) => {
  try {
    const docs = await fetchByStatus(req.params.status);
    return sendSuccess(res, docs);
  } catch (err) { next(err); }
};

// PATCH /api/borrower-documents/:id/verify
const verifyDocument = async (req, res, next) => {
  try {
    const doc = await verify(req.params.id, req.body.verification_status);
    return sendSuccess(res, doc, 'Document verification status updated.');
  } catch (err) { next(err); }
};

// DELETE /api/borrower-documents/:id
const deleteDocument = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Document deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  uploadDocument, getAllDocuments, getDocumentById,
  getDocumentsByBorrower, getDocumentsByStatus,
  verifyDocument, deleteDocument,
};