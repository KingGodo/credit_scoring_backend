const express = require('express');
const router = express.Router();
const {
  createProduct, getAllProducts, getActiveProducts,
  getProductById, getProductsByLender, updateProduct,
  activateProduct, deactivateProduct, deleteProduct,
} = require('./loan-products.controller');
const { validateCreateProduct, validateUpdateProduct } = require('./loan-products.validation');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

// GET /api/loan-products/active  — all roles can see active products
router.get('/active', authenticate, getActiveProducts);

// GET /api/loan-products  — admin & loan_officer see all (including inactive)
router.get('/', authenticate, authorize('admin', 'loan_officer'), getAllProducts);

// GET /api/loan-products/:id  — any authenticated user
router.get('/:id', authenticate, getProductById);

// GET /api/loan-products/lender/:lenderId  — products by lender
router.get('/lender/:lenderId', authenticate, getProductsByLender);

// POST /api/loan-products  — admin & loan_officer create products
router.post('/', authenticate, authorize('admin', 'loan_officer'), validateCreateProduct, createProduct);

// PUT /api/loan-products/:id  — admin & loan_officer update
router.put('/:id', authenticate, authorize('admin', 'loan_officer'), validateUpdateProduct, updateProduct);

// PATCH /api/loan-products/:id/activate
router.patch('/:id/activate', authenticate, authorize('admin', 'loan_officer'), activateProduct);

// PATCH /api/loan-products/:id/deactivate
router.patch('/:id/deactivate', authenticate, authorize('admin', 'loan_officer'), deactivateProduct);

// DELETE /api/loan-products/:id  — admin only
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;