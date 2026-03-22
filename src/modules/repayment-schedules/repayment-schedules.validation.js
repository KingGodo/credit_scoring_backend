const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const VALID_STATUSES = ['pending', 'paid', 'overdue', 'waived'];

const validateGenerate = [
  body('loan_id')
    .isUUID().withMessage('Valid loan_id (UUID) is required.'),
  body('principal_amount')
    .isNumeric().withMessage('principal_amount must be a number.')
    .custom((val) => val > 0).withMessage('principal_amount must be greater than 0.'),
  body('interest_rate')
    .isNumeric().withMessage('interest_rate must be a number.')
    .custom((val) => val >= 0).withMessage('interest_rate cannot be negative.'),
  body('start_date')
    .isDate().withMessage('start_date must be a valid date (YYYY-MM-DD).'),
  body('term_months')
    .isInt({ min: 1 }).withMessage('term_months must be a positive integer.'),
  handle,
];

const validateStatusUpdate = [
  body('status')
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}.`),
  handle,
];

module.exports = { validateGenerate, validateStatusUpdate };