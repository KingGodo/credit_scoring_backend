const {
  create, fetchAll, fetchById, fetchByBorrower,
  fetchByStatus, updateStatus, remove,
} = require('./loan-applications.service');
const { sendSuccess } = require('../../utils/response');

const createApplication = async (req, res, next) => {
  try {
    const application = await create(req.body);
    return sendSuccess(res, application, 'Loan application submitted successfully.', 201);
  } catch (err) { next(err); }
};

const getAllApplications = async (req, res, next) => {
  try {
    const applications = await fetchAll();
    return sendSuccess(res, applications);
  } catch (err) { next(err); }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await fetchById(req.params.id);
    return sendSuccess(res, application);
  } catch (err) { next(err); }
};

const getApplicationsByBorrower = async (req, res, next) => {
  try {
    const applications = await fetchByBorrower(req.params.borrowerId);
    return sendSuccess(res, applications);
  } catch (err) { next(err); }
};

// GET /api/loan-applications/status/:status
const getApplicationsByStatus = async (req, res, next) => {
  try {
    const applications = await fetchByStatus(req.params.status);
    return sendSuccess(res, applications);
  } catch (err) { next(err); }
};

// PATCH /api/loan-applications/:id/status
const changeApplicationStatus = async (req, res, next) => {
  try {
    const application = await updateStatus(req.params.id, req.body.application_status);
    return sendSuccess(res, application, 'Application status updated.');
  } catch (err) { next(err); }
};

const deleteApplication = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Loan application deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  createApplication, getAllApplications, getApplicationById,
  getApplicationsByBorrower, getApplicationsByStatus,
  changeApplicationStatus, deleteApplication,
};