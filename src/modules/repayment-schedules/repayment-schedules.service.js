const { v4: uuidv4 } = require('uuid');
const {
  createSchedules, getSchedulesByLoanId, getScheduleById,
  getPendingSchedulesByLoanId, getOverdueSchedules,
  updateScheduleStatus, deleteSchedulesByLoanId,
} = require('./repayment-schedules.repository');

const VALID_STATUSES = ['pending', 'paid', 'overdue', 'waived'];

/**
 * Auto-generate repayment schedule when a loan is created.
 * Calculates equal monthly installments using simple interest.
 *
 * Formula:
 *   total_interest = principal * (rate/100) * (term/12)
 *   total_payable  = principal + total_interest
 *   monthly_amount = total_payable / term_months
 */
const generate = async ({ loan_id, principal_amount, interest_rate, start_date, term_months }) => {
  // Remove any existing schedule first (in case of regeneration)
  await deleteSchedulesByLoanId(loan_id);

  const principal = parseFloat(principal_amount);
  const rate = parseFloat(interest_rate);
  const term = parseInt(term_months);

  const total_interest = principal * (rate / 100) * (term / 12);
  const total_payable = principal + total_interest;
  const monthly_amount = parseFloat((total_payable / term).toFixed(2));

  const schedules = [];
  const loanStartDate = new Date(start_date);

  for (let i = 1; i <= term; i++) {
    const due = new Date(loanStartDate);
    due.setMonth(due.getMonth() + i);

    schedules.push({
      schedule_id: uuidv4(),
      loan_id,
      installment_number: i,
      due_date: due.toISOString().split('T')[0],
      amount_due: monthly_amount,
    });
  }

  return createSchedules(schedules);
};

const fetchByLoanId = async (loan_id) => getSchedulesByLoanId(loan_id);

const fetchById = async (schedule_id) => {
  const schedule = await getScheduleById(schedule_id);
  if (!schedule) throw { statusCode: 404, message: 'Schedule not found.' };
  return schedule;
};

const fetchPendingByLoan = async (loan_id) => getPendingSchedulesByLoanId(loan_id);

const fetchOverdue = async () => getOverdueSchedules();

const updateStatus = async (schedule_id, status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
  }

  const existing = await getScheduleById(schedule_id);
  if (!existing) throw { statusCode: 404, message: 'Schedule not found.' };

  if (existing.status === 'paid') {
    throw { statusCode: 400, message: 'This installment is already paid.' };
  }

  return updateScheduleStatus(schedule_id, status);
};

module.exports = { generate, fetchByLoanId, fetchById, fetchPendingByLoan, fetchOverdue, updateStatus };