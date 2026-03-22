const { fetchAll, fetchById, create, update, remove } = require('./lenders.service');
const { sendSuccess, sendError } = require('../../utils/response');

const getAll = async (req, res, next) => {
  try {
    const lenders = await fetchAll();
    return sendSuccess(res, lenders);
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const lender = await fetchById(req.params.id);
    return sendSuccess(res, lender);
  } catch (err) { next(err); }
};

const createLender = async (req, res, next) => {
  try {
    const lender = await create(req.body);
    return sendSuccess(res, lender, 'Lender created successfully.', 201);
  } catch (err) { next(err); }
};

const updateLender = async (req, res, next) => {
  try {
    const lender = await update(req.params.id, req.body);
    return sendSuccess(res, lender, 'Lender updated.');
  } catch (err) { next(err); }
};

const deleteLender = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Lender deleted.');
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, createLender, updateLender, deleteLender };