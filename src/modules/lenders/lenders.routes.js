const express = require('express');
const router = express.Router();
const { getAll, getOne, createLender, updateLender, deleteLender } = require('./lenders.controller');
const { validateLender } = require('./lenders.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/lenders
router.get('/', authenticate, getAll);

// GET /api/lenders/:id
router.get('/:id', authenticate, getOne);

// POST /api/lenders
router.post('/', authenticate, authorize('admin'), validateLender, createLender);

// PUT /api/lenders/:id
router.put('/:id', authenticate, authorize('admin'), validateLender, updateLender);

// DELETE /api/lenders/:id
router.delete('/:id', authenticate, authorize('admin'), deleteLender);

module.exports = router;