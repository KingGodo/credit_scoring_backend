const pool = require('../../config/db');

const createDocument = async ({ document_id, borrower_id, document_type, document_url }) => {
  const result = await pool.query(
    `INSERT INTO borrower_documents (document_id, borrower_id, document_type, document_url)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [document_id, borrower_id, document_type, document_url]
  );
  return result.rows[0];
};

const getAllDocuments = async () => {
  const result = await pool.query(
    `SELECT bd.*, b.phone, b.national_id, u.email
     FROM borrower_documents bd
     JOIN borrowers b ON bd.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     ORDER BY bd.uploaded_at DESC`
  );
  return result.rows;
};

const getDocumentById = async (document_id) => {
  const result = await pool.query(
    `SELECT bd.*, b.phone, b.national_id, u.email
     FROM borrower_documents bd
     JOIN borrowers b ON bd.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     WHERE bd.document_id = $1`,
    [document_id]
  );
  return result.rows[0];
};

const getDocumentsByBorrowerId = async (borrower_id) => {
  const result = await pool.query(
    `SELECT * FROM borrower_documents
     WHERE borrower_id = $1
     ORDER BY uploaded_at DESC`,
    [borrower_id]
  );
  return result.rows;
};

const getDocumentsByStatus = async (verification_status) => {
  const result = await pool.query(
    `SELECT bd.*, b.phone, b.national_id, u.email
     FROM borrower_documents bd
     JOIN borrowers b ON bd.borrower_id = b.borrower_id
     JOIN users u ON b.user_id = u.user_id
     WHERE bd.verification_status = $1
     ORDER BY bd.uploaded_at DESC`,
    [verification_status]
  );
  return result.rows;
};

const updateVerificationStatus = async (document_id, verification_status) => {
  const result = await pool.query(
    `UPDATE borrower_documents
     SET verification_status = $1
     WHERE document_id = $2
     RETURNING *`,
    [verification_status, document_id]
  );
  return result.rows[0];
};

const deleteDocument = async (document_id) => {
  await pool.query('DELETE FROM borrower_documents WHERE document_id = $1', [document_id]);
};

module.exports = {
  createDocument, getAllDocuments, getDocumentById,
  getDocumentsByBorrowerId, getDocumentsByStatus,
  updateVerificationStatus, deleteDocument,
};