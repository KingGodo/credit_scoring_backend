const { v4: uuidv4 } = require('uuid');
const {
  createRepayment, getAllRepayments, getRepaymentById,
  getRepaymentsByLoanId, getRepaymentsByBorrowerId,
  getTotalPaidByLoanId, getRepaymentsByPaymentMethod,
  deleteRepayment,
} = require('./repayments.repository');

const VALID_PAYMENT_METHODS = ['mobile_money', 'bank_transfer', 'cash'];

const record = async ({ loan_id, amount_paid, payment_date, payment_method, recorded_by }) => {
  if (!VALID_PAYMENT_METHODS.includes(payment_method)) {
    throw {
      statusCode: 400,
      message: `Invalid payment_method. Must be one of: ${VALID_PAYMENT_METHODS.join(', ')}.`,
    };
  }

  if (parseFloat(amount_paid) <= 0) {
    throw { statusCode: 400, message: 'amount_paid must be greater than 0.' };
  }

  const repayment_id = uuidv4();
  return createRepayment({ repayment_id, loan_id, amount_paid, payment_date, payment_method, recorded_by });
};

const fetchAll = async () => getAllRepayments();

const fetchById = async (repayment_id) => {
  const repayment = await getRepaymentById(repayment_id);
  if (!repayment) throw { statusCode: 404, message: 'Repayment not found.' };
  return repayment;
};

const fetchByLoan = async (loan_id) => getRepaymentsByLoanId(loan_id);

const fetchByBorrower = async (borrower_id) => getRepaymentsByBorrowerId(borrower_id);

const fetchTotalPaid = async (loan_id) => {
  const total_paid = await getTotalPaidByLoanId(loan_id);
  return { loan_id, total_paid };
};

const fetchByPaymentMethod = async (payment_method) => {
  if (!VALID_PAYMENT_METHODS.includes(payment_method)) {
    throw {
      statusCode: 400,
      message: `Invalid payment_method. Must be one of: ${VALID_PAYMENT_METHODS.join(', ')}.`,
    };
  }
  return getRepaymentsByPaymentMethod(payment_method);
};

const remove = async (repayment_id) => {
  const existing = await getRepaymentById(repayment_id);
  if (!existing) throw { statusCode: 404, message: 'Repayment not found.' };
  await deleteRepayment(repayment_id);
};

module.exports = {
  record, fetchAll, fetchById, fetchByLoan,
  fetchByBorrower, fetchTotalPaid, fetchByPaymentMethod, remove,
};