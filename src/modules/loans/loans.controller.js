const {
  create, fetchAll, fetchById, fetchByBorrower,
  fetchByStatus, updateStatus, remove,
} = require('./loans.service');
const { sendSuccess } = require('../../utils/response');

const createLoan = async (req, res, next) => {
  try {
    const loan = await create(req.body);
    return sendSuccess(res, loan, 'Loan created successfully.', 201);
  } catch (err) { next(err); }
};

const getAllLoans = async (req, res, next) => {
  try {
    const loans = await fetchAll();
    return sendSuccess(res, loans);
  } catch (err) { next(err); }
};

const getLoanById = async (req, res, next) => {
  try {
    const loan = await fetchById(req.params.id);
    return sendSuccess(res, loan);
  } catch (err) { next(err); }
};

// GET /api/loans/borrower/:borrowerId
const getLoansByBorrower = async (req, res, next) => {
  try {
    const loans = await fetchByBorrower(req.params.borrowerId);
    return sendSuccess(res, loans);
  } catch (err) { next(err); }
};

// GET /api/loans/status/:status
const getLoansByStatus = async (req, res, next) => {
  try {
    const loans = await fetchByStatus(req.params.status);
    return sendSuccess(res, loans);
  } catch (err) { next(err); }
};

// PATCH /api/loans/:id/status
const changeLoanStatus = async (req, res, next) => {
  try {
    const loan = await updateStatus(req.params.id, req.body.loan_status);
    return sendSuccess(res, loan, 'Loan status updated.');
  } catch (err) { next(err); }
};

const deleteLoan = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Loan deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  createLoan, getAllLoans, getLoanById,
  getLoansByBorrower, getLoansByStatus,
  changeLoanStatus, deleteLoan,
};