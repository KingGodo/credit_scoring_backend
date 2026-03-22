const {
  create, fetchAll, fetchActive, fetchById,
  fetchByLender, update, activate, deactivate, remove,
} = require('./loan-products.service');
const { sendSuccess } = require('../../utils/response');

const createProduct = async (req, res, next) => {
  try {
    const product = await create(req.body);
    return sendSuccess(res, product, 'Loan product created successfully.', 201);
  } catch (err) { next(err); }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await fetchAll();
    return sendSuccess(res, products);
  } catch (err) { next(err); }
};

const getActiveProducts = async (req, res, next) => {
  try {
    const products = await fetchActive();
    return sendSuccess(res, products);
  } catch (err) { next(err); }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await fetchById(req.params.id);
    return sendSuccess(res, product);
  } catch (err) { next(err); }
};

const getProductsByLender = async (req, res, next) => {
  try {
    const products = await fetchByLender(req.params.lenderId);
    return sendSuccess(res, products);
  } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await update(req.params.id, req.body);
    return sendSuccess(res, product, 'Loan product updated successfully.');
  } catch (err) { next(err); }
};

const activateProduct = async (req, res, next) => {
  try {
    const product = await activate(req.params.id);
    return sendSuccess(res, product, 'Loan product activated.');
  } catch (err) { next(err); }
};

const deactivateProduct = async (req, res, next) => {
  try {
    const product = await deactivate(req.params.id);
    return sendSuccess(res, product, 'Loan product deactivated.');
  } catch (err) { next(err); }
};

const deleteProduct = async (req, res, next) => {
  try {
    await remove(req.params.id);
    return sendSuccess(res, null, 'Loan product deleted.');
  } catch (err) { next(err); }
};

module.exports = {
  createProduct, getAllProducts, getActiveProducts,
  getProductById, getProductsByLender, updateProduct,
  activateProduct, deactivateProduct, deleteProduct,
};