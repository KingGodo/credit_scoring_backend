const { v4: uuidv4 } = require('uuid');
const {
  createBorrower, getAllBorrowers, getBorrowerById,
  getBorrowerByUserId, getBorrowerByNationalId,
  updateBorrower, deleteBorrower,
} = require('./borrowers.repository');

const create = async ({ user_id, phone, national_id }) => {
  // One user can only have one borrower record
  const existingUser = await getBorrowerByUserId(user_id);
  if (existingUser) throw { statusCode: 409, message: 'A borrower record already exists for this user.' };

  // National ID must be unique
  const existingNationalId = await getBorrowerByNationalId(national_id);
  if (existingNationalId) throw { statusCode: 409, message: 'National ID is already registered.' };

  const borrower_id = uuidv4();
  return createBorrower({ borrower_id, user_id, phone, national_id });
};

const fetchAll = async () => getAllBorrowers();

const fetchById = async (borrower_id) => {
  const borrower = await getBorrowerById(borrower_id);
  if (!borrower) throw { statusCode: 404, message: 'Borrower not found.' };
  return borrower;
};

const fetchByUserId = async (user_id) => {
  const borrower = await getBorrowerByUserId(user_id);
  if (!borrower) throw { statusCode: 404, message: 'Borrower not found for this user.' };
  return borrower;
};

const update = async (borrower_id, { phone, national_id }) => {
  const existing = await getBorrowerById(borrower_id);
  if (!existing) throw { statusCode: 404, message: 'Borrower not found.' };

  // If national_id is being changed, ensure it is not taken
  if (national_id && national_id !== existing.national_id) {
    const takenId = await getBorrowerByNationalId(national_id);
    if (takenId) throw { statusCode: 409, message: 'National ID is already registered.' };
  }

  return updateBorrower(borrower_id, {
    phone: phone || existing.phone,
    national_id: national_id || existing.national_id,
  });
};

const remove = async (borrower_id) => {
  const existing = await getBorrowerById(borrower_id);
  if (!existing) throw { statusCode: 404, message: 'Borrower not found.' };
  await deleteBorrower(borrower_id);
};

module.exports = { create, fetchAll, fetchById, fetchByUserId, update, remove };