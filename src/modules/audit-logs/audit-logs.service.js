const { v4: uuidv4 } = require('uuid');
const {
  createLog, getAllLogs, getLogById,
  getLogsByUserId, getLogsByAction, getLogsByEntity,
  getLogsByEntityId, deleteLog, clearLogsByUserId,
} = require('./audit-logs.repository');

// All valid actions across the whole system
const VALID_ACTIONS = [
  // Auth
  'user_registered',
  'user_logged_in',
  // Users
  'user_updated',
  'user_activated',
  'user_deactivated',
  'user_deleted',
  'password_changed',
  // Lenders
  'lender_created',
  'lender_updated',
  'lender_deleted',
  // Lender Staff
  'staff_created',
  'staff_updated',
  'staff_deleted',
  // Borrowers
  'borrower_created',
  'borrower_updated',
  // Borrower Profile
  'profile_created',
  'profile_updated',
  // KYC Documents
  'kyc_uploaded',
  'kyc_verified',
  'kyc_rejected',
  // Loan Products
  'product_created',
  'product_updated',
  'product_activated',
  'product_deactivated',
  // Loan Applications
  'application_submitted',
  'application_under_review',
  'application_approved',
  'application_rejected',
  // Loans
  'loan_created',
  'loan_status_updated',
  // Repayment Schedules
  'schedule_generated',
  'schedule_status_updated',
  // Repayments
  'payment_recorded',
  'payment_deleted',
  // ML Models
  'model_version_created',
  'model_version_updated',
  // Predictions
  'prediction_run',
];

// Valid entities in the system
const VALID_ENTITIES = [
  'user', 'lender', 'lender_staff', 'borrower', 'borrower_profile',
  'borrower_document', 'loan_product', 'loan_application', 'loan',
  'repayment_schedule', 'repayment', 'model_version', 'prediction_run',
];

/**
 * Used internally by other modules to log actions.
 * Call this after any important DB operation.
 *
 * Example usage in another service:
 *   await auditLog({ user_id, action: 'loan_created', entity: 'loan', entity_id: loan.loan_id });
 */
const auditLog = async ({ user_id, action, entity, entity_id }) => {
  const log_id = uuidv4();
  return createLog({ log_id, user_id, action, entity, entity_id });
};

const create = async ({ user_id, action, entity, entity_id }) => {
  if (!VALID_ACTIONS.includes(action)) {
    throw {
      statusCode: 400,
      message: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}.`,
    };
  }

  if (!VALID_ENTITIES.includes(entity)) {
    throw {
      statusCode: 400,
      message: `Invalid entity. Must be one of: ${VALID_ENTITIES.join(', ')}.`,
    };
  }

  const log_id = uuidv4();
  return createLog({ log_id, user_id, action, entity, entity_id });
};

const fetchAll = async () => getAllLogs();

const fetchById = async (log_id) => {
  const log = await getLogById(log_id);
  if (!log) throw { statusCode: 404, message: 'Audit log not found.' };
  return log;
};

const fetchByUser = async (user_id) => getLogsByUserId(user_id);

const fetchByAction = async (action) => {
  if (!VALID_ACTIONS.includes(action)) {
    throw {
      statusCode: 400,
      message: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}.`,
    };
  }
  return getLogsByAction(action);
};

const fetchByEntity = async (entity) => {
  if (!VALID_ENTITIES.includes(entity)) {
    throw {
      statusCode: 400,
      message: `Invalid entity. Must be one of: ${VALID_ENTITIES.join(', ')}.`,
    };
  }
  return getLogsByEntity(entity);
};

const fetchByEntityId = async (entity_id) => getLogsByEntityId(entity_id);

const remove = async (log_id) => {
  const existing = await getLogById(log_id);
  if (!existing) throw { statusCode: 404, message: 'Audit log not found.' };
  await deleteLog(log_id);
};

const clearByUser = async (user_id) => {
  await clearLogsByUserId(user_id);
};

module.exports = {
  auditLog, create, fetchAll, fetchById,
  fetchByUser, fetchByAction, fetchByEntity,
  fetchByEntityId, remove, clearByUser,
  VALID_ACTIONS, VALID_ENTITIES,
};