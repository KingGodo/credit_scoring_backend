const { create, fetchAll, fetchById, fetchByLender, update, remove } = require('./lender-staff.service');
const { sendSuccess } = require('../../utils/response');

const createStaff = async (req, res, next) => {
  try {
    const staff = await create(req.body);
    return sendSuccess(res, staff, 'Staff member created successfully.', 201);
  } catch (err) { next(err); }
};

const getAllStaff = async (req, res, next) => {
  try {
    const staff = await fetchAll();
    return sendSuccess(res, staff);
  } catch (err) { next(err); }
};

const getStaffById = async (req, res, next) => {
  try {
    const staff = await fetchById(req.params.id);
    return sendSuccess(res, staff);
  } catch (err) { next(err); }
};

const getStaffByLender = async (req, res, next) => {
  try {
    const staff = await fetchByLender(req.params.lenderId);
    return sendSuccess(res, staff);
  } catch (err) { next(err); }
};

const updateStaff = async (req, res, next) => {
  try {
    const staff = await update(req.params.id, req.body);
    return sendSuccess(res, staff, 'Staff member updated.');
  } catch (err) { next(err); }
};

const deleteStaff = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Staff member deleted.');
  } catch (err) { next(err); }
};

module.exports = { createStaff, getAllStaff, getStaffById, getStaffByLender, updateStaff, deleteStaff };