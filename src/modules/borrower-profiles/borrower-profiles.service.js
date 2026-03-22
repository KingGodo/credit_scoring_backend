const { v4: uuidv4 } = require('uuid');
const {
  createProfile, getProfileByBorrowerId, getProfileById,
  getAllProfiles, updateProfile, deleteProfile,
} = require('./borrower-profiles.repository');

const create = async (borrower_id, data) => {
  // One borrower can only have one profile
  const existing = await getProfileByBorrowerId(borrower_id);
  if (existing) throw { statusCode: 409, message: 'Profile already exists for this borrower.' };

  const profile_id = uuidv4();
  return createProfile({ profile_id, borrower_id, ...data });
};

const fetchAll = async () => getAllProfiles();

const fetchById = async (profile_id) => {
  const profile = await getProfileById(profile_id);
  if (!profile) throw { statusCode: 404, message: 'Profile not found.' };
  return profile;
};

const fetchByBorrowerId = async (borrower_id) => {
  const profile = await getProfileByBorrowerId(borrower_id);
  if (!profile) throw { statusCode: 404, message: 'Profile not found for this borrower.' };
  return profile;
};

const update = async (profile_id, data) => {
  const existing = await getProfileById(profile_id);
  if (!existing) throw { statusCode: 404, message: 'Profile not found.' };
  return updateProfile(profile_id, data);
};

const remove = async (profile_id) => {
  const existing = await getProfileById(profile_id);
  if (!existing) throw { statusCode: 404, message: 'Profile not found.' };
  await deleteProfile(profile_id);
};

module.exports = { create, fetchAll, fetchById, fetchByBorrowerId, update, remove };