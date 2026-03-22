const { v4: uuidv4 } = require('uuid');
const {
  createDocument, getAllDocuments, getDocumentById,
  getDocumentsByBorrowerId, getDocumentsByStatus,
  updateVerificationStatus, deleteDocument,
} = require('./borrower-documents.repository');

const VALID_DOCUMENT_TYPES = [
  'national_id',
  'passport',
  'drivers_license',
  'proof_of_address',
  'business_license',
  'selfie_verification',
];

const VALID_STATUSES = ['pending', 'verified', 'rejected'];

const upload = async ({ borrower_id, document_type, document_url }) => {
  if (!VALID_DOCUMENT_TYPES.includes(document_type)) {
    throw {
      statusCode: 400,
      message: `Invalid document type. Must be one of: ${VALID_DOCUMENT_TYPES.join(', ')}.`,
    };
  }

  const document_id = uuidv4();
  return createDocument({ document_id, borrower_id, document_type, document_url });
};

const fetchAll = async () => getAllDocuments();

const fetchById = async (document_id) => {
  const doc = await getDocumentById(document_id);
  if (!doc) throw { statusCode: 404, message: 'Document not found.' };
  return doc;
};

const fetchByBorrowerId = async (borrower_id) => {
  return getDocumentsByBorrowerId(borrower_id);
};

const fetchByStatus = async (verification_status) => {
  if (!VALID_STATUSES.includes(verification_status)) {
    throw {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
  }
  return getDocumentsByStatus(verification_status);
};

const verify = async (document_id, verification_status) => {
  if (!VALID_STATUSES.includes(verification_status)) {
    throw {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
  }

  const existing = await getDocumentById(document_id);
  if (!existing) throw { statusCode: 404, message: 'Document not found.' };

  return updateVerificationStatus(document_id, verification_status);
};

const remove = async (document_id) => {
  const existing = await getDocumentById(document_id);
  if (!existing) throw { statusCode: 404, message: 'Document not found.' };
  await deleteDocument(document_id);
};

module.exports = { upload, fetchAll, fetchById, fetchByBorrowerId, fetchByStatus, verify, remove };