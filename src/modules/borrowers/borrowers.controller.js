const { create, fetchAll, fetchById, fetchByUserId, update, remove } = require('./borrowers.service');
const { sendSuccess } = require('../../utils/response');

const createBorrower = async (req, res, next) => {
  try {
    const borrower = await create(req.body);
    return sendSuccess(res, borrower, 'Borrower created successfully.', 201);
  } catch (err) { next(err); }
};

const getAllBorrowers = async (req, res, next) => {
  try {
    const borrowers = await fetchAll();
    return sendSuccess(res, borrowers);
  } catch (err) { next(err); }
};

const getBorrowerById = async (req, res, next) => {
  try {
    const borrower = await fetchById(req.params.id);
    return sendSuccess(res, borrower);
  } catch (err) { next(err); }
};

// Logged-in borrower fetches their own record
const getMyBorrowerRecord = async (req, res, next) => {
  try {
    const borrower = await fetchByUserId(req.user.user_id);
    return sendSuccess(res, borrower);
  } catch (err) { next(err); }
};

const updateBorrower = async (req, res, next) => {
  try {
    const borrower = await update(req.params.id, req.body);
    return sendSuccess(res, borrower, 'Borrower updated successfully.');
  } catch (err) { next(err); }
};

const deleteBorrower = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Borrower deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  createBorrower, getAllBorrowers, getBorrowerById,
  getMyBorrowerRecord, updateBorrower, deleteBorrower,
};