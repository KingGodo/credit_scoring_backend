const { v4: uuidv4 } = require('uuid');
const { getAllLenders, getLenderById, createLender, updateLender, deleteLender } = require('./lenders.repository');

const fetchAll = async () => getAllLenders();

const fetchById = async (lender_id) => {
  const lender = await getLenderById(lender_id);
  if (!lender) throw { statusCode: 404, message: 'Lender not found.' };
  return lender;
};

const create = async (data) => {
  const lender_id = uuidv4();
  return createLender({ lender_id, ...data });
};

const update = async (lender_id, data) => {
  const existing = await getLenderById(lender_id);
  if (!existing) throw { statusCode: 404, message: 'Lender not found.' };
  return updateLender(lender_id, data);
};

const remove = async (lender_id) => {
  const existing = await getLenderById(lender_id);
  if (!existing) throw { statusCode: 404, message: 'Lender not found.' };
  await deleteLender(lender_id);
};

module.exports = { fetchAll, fetchById, create, update, remove };