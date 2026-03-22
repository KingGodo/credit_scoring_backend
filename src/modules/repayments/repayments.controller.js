const {
  record, fetchAll, fetchById, fetchByLoan,
  fetchByBorrower, fetchTotalPaid, fetchByPaymentMethod, remove,
} = require('./repayments.service');
const { sendSuccess } = require('../../utils/response');

// POST /api/repayments
const recordRepayment = async (req, res, next) => {
  try {
    const repayment = await record(req.body);
    return sendSuccess(res, repayment, 'Repayment recorded successfully.', 201);
  } catch (err) { next(err); }
};

// GET /api/repayments
const getAllRepayments = async (req, res, next) => {
  try {
    const repayments = await fetchAll();
    return sendSuccess(res, repayments);
  } catch (err) { next(err); }
};

// GET /api/repayments/:id
const getRepaymentById = async (req, res, next) => {
  try {
    const repayment = await fetchById(req.params.id);
    return sendSuccess(res, repayment);
  } catch (err) { next(err); }
};

// GET /api/repayments/loan/:loanId
const getRepaymentsByLoan = async (req, res, next) => {
  try {
    const repayments = await fetchByLoan(req.params.loanId);
    return sendSuccess(res, repayments);
  } catch (err) { next(err); }
};

// GET /api/repayments/borrower/:borrowerId
const getRepaymentsByBorrower = async (req, res, next) => {
  try {
    const repayments = await fetchByBorrower(req.params.borrowerId);
    return sendSuccess(res, repayments);
  } catch (err) { next(err); }
};

// GET /api/repayments/loan/:loanId/total
const getTotalPaidByLoan = async (req, res, next) => {
  try {
    const total = await fetchTotalPaid(req.params.loanId);
    return sendSuccess(res, total);
  } catch (err) { next(err); }
};

// GET /api/repayments/method/:method
const getRepaymentsByMethod = async (req, res, next) => {
  try {
    const repayments = await fetchByPaymentMethod(req.params.method);
    return sendSuccess(res, repayments);
  } catch (err) { next(err); }
};

// DELETE /api/repayments/:id
const deleteRepayment = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Repayment deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  recordRepayment, getAllRepayments, getRepaymentById,
  getRepaymentsByLoan, getRepaymentsByBorrower,
  getTotalPaidByLoan, getRepaymentsByMethod, deleteRepayment,
};