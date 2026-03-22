const { v4: uuidv4 } = require('uuid');
const {
  createStaff, getAllStaff, getStaffById,
  getStaffByLenderId, getStaffByUserId,
  updateStaff, deleteStaff,
} = require('./lender-staff.repository');

const create = async ({ user_id, lender_id, full_name, position }) => {
  // Prevent duplicate staff entry for same user
  const existing = await getStaffByUserId(user_id);
  if (existing) throw { statusCode: 409, message: 'This user is already registered as staff.' };

  const staff_id = uuidv4();
  return createStaff({ staff_id, user_id, lender_id, full_name, position });
};

const fetchAll = async () => getAllStaff();

const fetchById = async (staff_id) => {
  const staff = await getStaffById(staff_id);
  if (!staff) throw { statusCode: 404, message: 'Staff member not found.' };
  return staff;
};

const fetchByLender = async (lender_id) => getStaffByLenderId(lender_id);

const update = async (staff_id, data) => {
  const existing = await getStaffById(staff_id);
  if (!existing) throw { statusCode: 404, message: 'Staff member not found.' };
  return updateStaff(staff_id, data);
};

const remove = async (staff_id) => {
  const existing = await getStaffById(staff_id);
  if (!existing) throw { statusCode: 404, message: 'Staff member not found.' };
  await deleteStaff(staff_id);
};

module.exports = { create, fetchAll, fetchById, fetchByLender, update, remove };