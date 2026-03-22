const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const VALID_REPAYMENT_FREQUENCIES = ['daily', 'weekly', 'bi_weekly', 'monthly'];

const validateCreateProduct = [
  body('lender_id')
    .isUUID().withMessage('Valid lender_id (UUID) is required.'),
  body('product_name')
    .notEmpty().withMessage('Product name is required.'),
  body('min_amount')
    .isNumeric().withMessage('min_amount must be a number.')
    .custom((val) => val > 0).withMessage('min_amount must be greater than 0.'),
  body('max_amount')
    .isNumeric().withMessage('max_amount must be a number.')
    .custom((val) => val > 0).withMessage('max_amount must be greater than 0.'),
  body('interest_rate')
    .isNumeric().withMessage('interest_rate must be a number.')
    .custom((val) => val >= 0).withMessage('interest_rate cannot be negative.'),
  body('term_months')
    .isInt({ min: 1 }).withMessage('term_months must be a positive integer.'),
  body('repayment_frequency')
    .isIn(VALID_REPAYMENT_FREQUENCIES)
    .withMessage(`repayment_frequency must be one of: ${VALID_REPAYMENT_FREQUENCIES.join(', ')}.`),
  handle,
];

const validateUpdateProduct = [
  body('product_name').optional().notEmpty().withMessage('Product name cannot be empty.'),
  body('min_amount').optional().isNumeric().withMessage('min_amount must be a number.'),
  body('max_amount').optional().isNumeric().withMessage('max_amount must be a number.'),
  body('interest_rate').optional().isNumeric().withMessage('interest_rate must be a number.'),
  body('term_months').optional().isInt({ min: 1 }).withMessage('term_months must be a positive integer.'),
  body('repayment_frequency')
    .optional()
    .isIn(VALID_REPAYMENT_FREQUENCIES)
    .withMessage(`repayment_frequency must be one of: ${VALID_REPAYMENT_FREQUENCIES.join(', ')}.`),
  handle,
];

module.exports = { validateCreateProduct, validateUpdateProduct };