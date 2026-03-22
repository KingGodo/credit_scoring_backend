const { v4: uuidv4 } = require('uuid');
const {
  createProduct, getAllProducts, getActiveProducts,
  getProductById, getProductsByLenderId,
  updateProduct, toggleProductActive, deleteProduct,
} = require('./loan-products.repository');

const VALID_REPAYMENT_FREQUENCIES = ['daily', 'weekly', 'bi_weekly', 'monthly'];

const create = async (data) => {
  const { min_amount, max_amount, repayment_frequency } = data;

  if (!VALID_REPAYMENT_FREQUENCIES.includes(repayment_frequency)) {
    throw {
      statusCode: 400,
      message: `Invalid repayment_frequency. Must be one of: ${VALID_REPAYMENT_FREQUENCIES.join(', ')}.`,
    };
  }

  if (parseFloat(min_amount) >= parseFloat(max_amount)) {
    throw { statusCode: 400, message: 'min_amount must be less than max_amount.' };
  }

  const product_id = uuidv4();
  return createProduct({ product_id, ...data });
};

const fetchAll = async () => getAllProducts();

const fetchActive = async () => getActiveProducts();

const fetchById = async (product_id) => {
  const product = await getProductById(product_id);
  if (!product) throw { statusCode: 404, message: 'Loan product not found.' };
  return product;
};

const fetchByLender = async (lender_id) => getProductsByLenderId(lender_id);

const update = async (product_id, data) => {
  const existing = await getProductById(product_id);
  if (!existing) throw { statusCode: 404, message: 'Loan product not found.' };

  const { min_amount, max_amount, repayment_frequency } = data;

  if (repayment_frequency && !VALID_REPAYMENT_FREQUENCIES.includes(repayment_frequency)) {
    throw {
      statusCode: 400,
      message: `Invalid repayment_frequency. Must be one of: ${VALID_REPAYMENT_FREQUENCIES.join(', ')}.`,
    };
  }

  if (min_amount && max_amount && parseFloat(min_amount) >= parseFloat(max_amount)) {
    throw { statusCode: 400, message: 'min_amount must be less than max_amount.' };
  }

  return updateProduct(product_id, {
    product_name: data.product_name || existing.product_name,
    description: data.description || existing.description,
    min_amount: data.min_amount || existing.min_amount,
    max_amount: data.max_amount || existing.max_amount,
    interest_rate: data.interest_rate || existing.interest_rate,
    term_months: data.term_months || existing.term_months,
    repayment_frequency: data.repayment_frequency || existing.repayment_frequency,
  });
};

const activate = async (product_id) => {
  const existing = await getProductById(product_id);
  if (!existing) throw { statusCode: 404, message: 'Loan product not found.' };
  return toggleProductActive(product_id, true);
};

const deactivate = async (product_id) => {
  const existing = await getProductById(product_id);
  if (!existing) throw { statusCode: 404, message: 'Loan product not found.' };
  return toggleProductActive(product_id, false);
};

const remove = async (product_id) => {
  const existing = await getProductById(product_id);
  if (!existing) throw { statusCode: 404, message: 'Loan product not found.' };
  await deleteProduct(product_id);
};

module.exports = {
  create, fetchAll, fetchActive, fetchById,
  fetchByLender, update, activate, deactivate, remove,
};