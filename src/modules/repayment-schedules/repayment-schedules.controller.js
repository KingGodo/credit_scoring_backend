const {
  generate, fetchByLoanId, fetchById,
  fetchPendingByLoan, fetchOverdue, updateStatus,
} = require('./repayment-schedules.service');
const { sendSuccess } = require('../../utils/response');

// POST /api/repayment-schedules/generate
const generateSchedule = async (req, res, next) => {
  try {
    const schedules = await generate(req.body);
    return sendSuccess(res, schedules, 'Repayment schedule generated successfully.', 201);
  } catch (err) { next(err); }
};

// GET /api/repayment-schedules/loan/:loanId
const getScheduleByLoan = async (req, res, next) => {
  try {
    const schedules = await fetchByLoanId(req.params.loanId);
    return sendSuccess(res, schedules);
  } catch (err) { next(err); }
};

// GET /api/repayment-schedules/:id
const getScheduleById = async (req, res, next) => {
  try {
    const schedule = await fetchById(req.params.id);
    return sendSuccess(res, schedule);
  } catch (err) { next(err); }
};

// GET /api/repayment-schedules/loan/:loanId/pending
const getPendingByLoan = async (req, res, next) => {
  try {
    const schedules = await fetchPendingByLoan(req.params.loanId);
    return sendSuccess(res, schedules);
  } catch (err) { next(err); }
};

// GET /api/repayment-schedules/overdue
const getOverdue = async (req, res, next) => {
  try {
    const schedules = await fetchOverdue();
    return sendSuccess(res, schedules);
  } catch (err) { next(err); }
};

// PATCH /api/repayment-schedules/:id/status
const updateScheduleStatus = async (req, res, next) => {
  try {
    const schedule = await updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, schedule, 'Schedule status updated.');
  } catch (err) { next(err); }
};

module.exports = {
  generateSchedule, getScheduleByLoan, getScheduleById,
  getPendingByLoan, getOverdue, updateScheduleStatus,
};