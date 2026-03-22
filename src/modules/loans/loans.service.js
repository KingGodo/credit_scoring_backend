const { v4: uuidv4 } = require('uuid');
const {
  createLoan, getAllLoans, getLoanById,
  getLoansByBorrowerId, getLoansByStatus,
  getLoanByApplicationId, updateLoanStatus, deleteLoan,
} = require('./loans.repository');

const VALID_STATUSES = ['active', 'completed', 'late', 'defaulted'];

const create = async ({
  application_id, borrower_id, principal_amount,
  interest_rate, start_date, end_date,
}) => {
  // Prevent duplicate loan for the same application
  const existing = await getLoanByApplicationId(application_id);
  if (existing) {
    throw { statusCode: 409, message: 'A loan already exists for this application.' };
  }

  const loan_id = uuidv4();
  return createLoan({
    loan_id, application_id, borrower_id, principal_amount,
    interest_rate, start_date, end_date, loan_status: 'active',
  });
};

const fetchAll = async () => getAllLoans();

const fetchById = async (loan_id) => {
  const loan = await getLoanById(loan_id);
  if (!loan) throw { statusCode: 404, message: 'Loan not found.' };
  return loan;
};

const fetchByBorrower = async (borrower_id) => getLoansByBorrowerId(borrower_id);

const fetchByStatus = async (loan_status) => {
  if (!VALID_STATUSES.includes(loan_status)) {
    throw {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
  }
  return getLoansByStatus(loan_status);
};

const updateStatus = async (loan_id, loan_status) => {
  if (!VALID_STATUSES.includes(loan_status)) {
    throw {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
  }

  const existing = await getLoanById(loan_id);
  if (!existing) throw { statusCode: 404, message: 'Loan not found.' };

  // Completed loans cannot be changed
  if (existing.loan_status === 'completed') {
    throw { statusCode: 400, message: 'Completed loans cannot have their status changed.' };
  }

  return updateLoanStatus(loan_id, loan_status);
};

const remove = async (loan_id) => {
  const existing = await getLoanById(loan_id);
  if (!existing) throw { statusCode: 404, message: 'Loan not found.' };
  await deleteLoan(loan_id);
};

module.exports = { create, fetchAll, fetchById, fetchByBorrower, fetchByStatus, updateStatus, remove };