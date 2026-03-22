const express = require('express');
const router = express.Router();
const {
  createModelVersion, getAllModelVersions, getModelVersionById,
  getModelVersionsByName, updateModelVersion, deleteModelVersion,
} = require('./model-versions.controller');
const { validateCreateModel, validateUpdateModel } = require('./model-versions.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/model-versions  — admin sees all model versions
router.get('/', authenticate, authorize('admin'), getAllModelVersions);

// GET /api/model-versions/search/:name  — search by model name
// e.g. /api/model-versions/search/RandomForest
router.get('/search/:name', authenticate, authorize('admin'), getModelVersionsByName);

// GET /api/model-versions/:id  — single model version
router.get('/:id', authenticate, authorize('admin'), getModelVersionById);

// POST /api/model-versions  — admin registers a new model version
router.post('/', authenticate, authorize('admin'), validateCreateModel, createModelVersion);

// PUT /api/model-versions/:id  — admin updates a model version
router.put('/:id', authenticate, authorize('admin'), validateUpdateModel, updateModelVersion);

// DELETE /api/model-versions/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteModelVersion);

module.exports = router;