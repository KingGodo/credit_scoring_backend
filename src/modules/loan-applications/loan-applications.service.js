const { v4: uuidv4 } = require('uuid');
const {
  createApplication, getAllApplications, getApplicationById,
  getApplicationsByBorrowerId, getApplicationsByStatus,
  updateApplicationStatus, deleteApplication,
} = require('./loan-applications.repository');

const VALID_STATUSES = ['pending', 'under_review', 'approved', 'rejected'];

const create = async ({ borrower_id, product_id, requested_amount, requested_term }) => {
  const application_id = uuidv4();
  return createApplication({ application_id, borrower_id, product_id, requested_amount, requested_term });
};

const fetchAll = async () => getAllApplications();

const fetchById = async (application_id) => {
  const application = await getApplicationById(application_id);
  if (!application) throw { statusCode: 404, message: 'Loan application not found.' };
  return application;
};

const fetchByBorrower = async (borrower_id) => getApplicationsByBorrowerId(borrower_id);

const fetchByStatus = async (application_status) => {
  if (!VALID_STATUSES.includes(application_status)) {
    throw {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
  }
  return getApplicationsByStatus(application_status);
};

const updateStatus = async (application_id, application_status) => {
  if (!VALID_STATUSES.includes(application_status)) {
    throw {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
    };
  }

  const existing = await getApplicationById(application_id);
  if (!existing) throw { statusCode: 404, message: 'Loan application not found.' };

  // Prevent changing status of already approved or rejected applications
  if (['approved', 'rejected'].includes(existing.application_status)) {
    throw {
      statusCode: 400,
      message: `Application is already ${existing.application_status} and cannot be changed.`,
    };
  }

  return updateApplicationStatus(application_id, application_status);
};

const remove = async (application_id) => {
  const existing = await getApplicationById(application_id);
  if (!existing) throw { statusCode: 404, message: 'Loan application not found.' };

  // Only pending applications can be deleted
  if (existing.application_status !== 'pending') {
    throw {
      statusCode: 400,
      message: 'Only pending applications can be deleted.',
    };
  }

  await deleteApplication(application_id);
};

module.exports = { create, fetchAll, fetchById, fetchByBorrower, fetchByStatus, updateStatus, remove };