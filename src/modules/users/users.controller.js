const { fetchAll, fetchById, update, setActiveStatus, changePassword, remove } = require('./users.service');
const { sendSuccess } = require('../../utils/response');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAll();
    return sendSuccess(res, users);
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await fetchById(req.params.id);
    return sendSuccess(res, user);
  } catch (err) { next(err); }
};

// Logged in user can view their own profile
const getMe = async (req, res, next) => {
  try {
    const user = await fetchById(req.user.user_id);
    return sendSuccess(res, user);
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await update(req.params.id, req.body);
    return sendSuccess(res, user, 'User updated successfully.');
  } catch (err) { next(err); }
};

const activateUser = async (req, res, next) => {
  try {
    const user = await setActiveStatus(req.params.id, true);
    return sendSuccess(res, user, 'User activated.');
  } catch (err) { next(err); }
};

const deactivateUser = async (req, res, next) => {
  try {
    const user = await setActiveStatus(req.params.id, false);
    return sendSuccess(res, user, 'User deactivated.');
  } catch (err) { next(err); }
};

const updatePassword = async (req, res, next) => {
  try {
    const result = await changePassword(req.user.user_id, req.body);
    return sendSuccess(res, result, 'Password changed successfully.');
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'User deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  getAllUsers, getUserById, getMe,
  updateUser, activateUser, deactivateUser,
  updatePassword, deleteUser,
};