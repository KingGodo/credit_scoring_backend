const {
  create, fetchAll, fetchById,
  fetchByUser, fetchByAction, fetchByEntity,
  fetchByEntityId, remove, clearByUser,
} = require('./audit-logs.service');
const { sendSuccess } = require('../../utils/response');

// POST /api/audit-logs
const createLog = async (req, res, next) => {
  try {
    const log = await create(req.body);
    return sendSuccess(res, log, 'Audit log created.', 201);
  } catch (err) { next(err); }
};

// GET /api/audit-logs
const getAllLogs = async (req, res, next) => {
  try {
    const logs = await fetchAll();
    return sendSuccess(res, logs);
  } catch (err) { next(err); }
};

// GET /api/audit-logs/:id
const getLogById = async (req, res, next) => {
  try {
    const log = await fetchById(req.params.id);
    return sendSuccess(res, log);
  } catch (err) { next(err); }
};

// GET /api/audit-logs/user/:userId
const getLogsByUser = async (req, res, next) => {
  try {
    const logs = await fetchByUser(req.params.userId);
    return sendSuccess(res, logs);
  } catch (err) { next(err); }
};

// GET /api/audit-logs/action/:action
// e.g. /api/audit-logs/action/loan_created
const getLogsByAction = async (req, res, next) => {
  try {
    const logs = await fetchByAction(req.params.action);
    return sendSuccess(res, logs);
  } catch (err) { next(err); }
};

// GET /api/audit-logs/entity/:entity
// e.g. /api/audit-logs/entity/loan
const getLogsByEntity = async (req, res, next) => {
  try {
    const logs = await fetchByEntity(req.params.entity);
    return sendSuccess(res, logs);
  } catch (err) { next(err); }
};

// GET /api/audit-logs/entity-id/:entityId
const getLogsByEntityId = async (req, res, next) => {
  try {
    const logs = await fetchByEntityId(req.params.entityId);
    return sendSuccess(res, logs);
  } catch (err) { next(err); }
};

// DELETE /api/audit-logs/:id
const deleteLog = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Audit log deleted.');
  } catch (err) { next(err); }
};

// DELETE /api/audit-logs/user/:userId/clear
const clearUserLogs = async (req, res, next) => {
  try {
    await clearByUser(req.params.userId);
    return sendSuccess(res, null, 'All audit logs for user cleared.');
  } catch (err) { next(err); }
};

module.exports = {
  createLog, getAllLogs, getLogById,
  getLogsByUser, getLogsByAction, getLogsByEntity,
  getLogsByEntityId, deleteLog, clearUserLogs,
};