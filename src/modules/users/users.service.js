const bcrypt = require('bcryptjs');
const {
  getAllUsers, getUserById, getUserByEmail,
  updateUser, toggleUserActive, updatePassword, deleteUser,
} = require('./users.repository');

const fetchAll = async () => getAllUsers();

const fetchById = async (user_id) => {
  const user = await getUserById(user_id);
  if (!user) throw { statusCode: 404, message: 'User not found.' };
  return user;
};

const update = async (user_id, { email, role }) => {
  const existing = await getUserById(user_id);
  if (!existing) throw { statusCode: 404, message: 'User not found.' };

  // If email is being changed, check it's not taken by another user
  if (email && email !== existing.email) {
    const emailTaken = await getUserByEmail(email);
    if (emailTaken) throw { statusCode: 409, message: 'Email already in use.' };
  }

  return updateUser(user_id, { email: email || existing.email, role: role || existing.role });
};

const setActiveStatus = async (user_id, is_active) => {
  const existing = await getUserById(user_id);
  if (!existing) throw { statusCode: 404, message: 'User not found.' };
  return toggleUserActive(user_id, is_active);
};

const changePassword = async (user_id, { current_password, new_password }) => {
  // Get full user record including password_hash
  const user = await getUserByEmail((await getUserById(user_id)).email);
  if (!user) throw { statusCode: 404, message: 'User not found.' };

  const isMatch = await bcrypt.compare(current_password, user.password_hash);
  if (!isMatch) throw { statusCode: 401, message: 'Current password is incorrect.' };

  const password_hash = await bcrypt.hash(new_password, 10);
  return updatePassword(user_id, password_hash);
};

const remove = async (user_id) => {
  const existing = await getUserById(user_id);
  if (!existing) throw { statusCode: 404, message: 'User not found.' };
  await deleteUser(user_id);
};

module.exports = { fetchAll, fetchById, update, setActiveStatus, changePassword, remove };