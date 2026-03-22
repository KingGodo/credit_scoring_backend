const express = require('express');
const router = express.Router();
const {
  createLog, getAllLogs, getLogById,
  getLogsByUser, getLogsByAction, getLogsByEntity,
  getLogsByEntityId, deleteLog, clearUserLogs,
} = require('./audit-logs.controller');
const { validateCreateLog } = require('./audit-logs.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/audit-logs  — admin sees all logs
router.get('/', authenticate, authorize('admin'), getAllLogs);

// GET /api/audit-logs/action/:action  — filter by action
// e.g. /api/audit-logs/action/loan_created
router.get('/action/:action', authenticate, authorize('admin'), getLogsByAction);

// GET /api/audit-logs/entity/:entity  — filter by entity type
// e.g. /api/audit-logs/entity/loan
router.get('/entity/:entity', authenticate, authorize('admin'), getLogsByEntity);

// GET /api/audit-logs/entity-id/:entityId  — all logs for a specific record
router.get('/entity-id/:entityId', authenticate, authorize('admin'), getLogsByEntityId);

// GET /api/audit-logs/user/:userId  — all logs for a user
router.get('/user/:userId', authenticate, authorize('admin'), getLogsByUser);

// GET /api/audit-logs/:id  — single log entry
router.get('/:id', authenticate, authorize('admin'), getLogById);

// POST /api/audit-logs  — manually create a log (admin only)
router.post('/', authenticate, authorize('admin'), validateCreateLog, createLog);

// DELETE /api/audit-logs/:id  — delete single log
router.delete('/:id', authenticate, authorize('admin'), deleteLog);

// DELETE /api/audit-logs/user/:userId/clear  — clear all logs for a user
router.delete('/user/:userId/clear', authenticate, authorize('admin'), clearUserLogs);

module.exports = router;