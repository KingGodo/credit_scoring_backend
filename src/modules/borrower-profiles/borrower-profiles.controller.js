const { create, fetchAll, fetchById, fetchByBorrowerId, update, remove } = require('./borrower-profiles.service');
const { sendSuccess } = require('../../utils/response');

const createProfile = async (req, res, next) => {
  try {
    const profile = await create(req.params.borrowerId, req.body);
    return sendSuccess(res, profile, 'Borrower profile created successfully.', 201);
  } catch (err) { next(err); }
};

const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await fetchAll();
    return sendSuccess(res, profiles);
  } catch (err) { next(err); }
};

const getProfileById = async (req, res, next) => {
  try {
    const profile = await fetchById(req.params.id);
    return sendSuccess(res, profile);
  } catch (err) { next(err); }
};

const getProfileByBorrowerId = async (req, res, next) => {
  try {
    const profile = await fetchByBorrowerId(req.params.borrowerId);
    return sendSuccess(res, profile);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await update(req.params.id, req.body);
    return sendSuccess(res, profile, 'Profile updated successfully.');
  } catch (err) { next(err); }
};

const deleteProfile = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Profile deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  createProfile, getAllProfiles, getProfileById,
  getProfileByBorrowerId, updateProfile, deleteProfile,
};