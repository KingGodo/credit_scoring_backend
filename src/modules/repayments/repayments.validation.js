const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const VALID_PAYMENT_METHODS = ['mobile_money', 'bank_transfer', 'cash'];

const validateRecordRepayment = [
  body('loan_id')
    .isUUID().withMessage('Valid loan_id (UUID) is required.'),
  body('amount_paid')
    .isNumeric().withMessage('amount_paid must be a number.')
    .custom((val) => val > 0).withMessage('amount_paid must be greater than 0.'),
  body('payment_date')
    .isDate().withMessage('payment_date must be a valid date (YYYY-MM-DD).'),
  body('payment_method')
    .isIn(VALID_PAYMENT_METHODS)
    .withMessage(`payment_method must be one of: ${VALID_PAYMENT_METHODS.join(', ')}.`),
  body('recorded_by')
    .isUUID().withMessage('Valid recorded_by (staff UUID) is required.'),
  handle,
];

module.exports = { validateRecordRepayment };