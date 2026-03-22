const { create, fetchAll, fetchById, fetchByName, update, remove } = require('./model-versions.service');
const { sendSuccess } = require('../../utils/response');

// POST /api/model-versions
const createModelVersion = async (req, res, next) => {
  try {
    const model = await create(req.body);
    return sendSuccess(res, model, 'Model version created successfully.', 201);
  } catch (err) { next(err); }
};

// GET /api/model-versions
const getAllModelVersions = async (req, res, next) => {
  try {
    const models = await fetchAll();
    return sendSuccess(res, models);
  } catch (err) { next(err); }
};

// GET /api/model-versions/:id
const getModelVersionById = async (req, res, next) => {
  try {
    const model = await fetchById(req.params.id);
    return sendSuccess(res, model);
  } catch (err) { next(err); }
};

// GET /api/model-versions/search/:name
const getModelVersionsByName = async (req, res, next) => {
  try {
    const models = await fetchByName(req.params.name);
    return sendSuccess(res, models);
  } catch (err) { next(err); }
};

// PUT /api/model-versions/:id
const updateModelVersion = async (req, res, next) => {
  try {
    const model = await update(req.params.id, req.body);
    return sendSuccess(res, model, 'Model version updated successfully.');
  } catch (err) { next(err); }
};

// DELETE /api/model-versions/:id
const deleteModelVersion = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Model version deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  createModelVersion, getAllModelVersions, getModelVersionById,
  getModelVersionsByName, updateModelVersion, deleteModelVersion,
};