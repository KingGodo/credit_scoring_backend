const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const VALID_STATUSES = ['active', 'completed', 'late', 'defaulted'];

const validateCreateLoan = [
  body('application_id')
    .isUUID().withMessage('Valid application_id (UUID) is required.'),
  body('borrower_id')
    .isUUID().withMessage('Valid borrower_id (UUID) is required.'),
  body('principal_amount')
    .isNumeric().withMessage('principal_amount must be a number.')
    .custom((val) => val > 0).withMessage('principal_amount must be greater than 0.'),
  body('interest_rate')
    .isNumeric().withMessage('interest_rate must be a number.')
    .custom((val) => val >= 0).withMessage('interest_rate cannot be negative.'),
  body('start_date')
    .isDate().withMessage('start_date must be a valid date (YYYY-MM-DD).'),
  body('end_date')
    .isDate().withMessage('end_date must be a valid date (YYYY-MM-DD).')
    .custom((end_date, { req }) => {
      if (new Date(end_date) <= new Date(req.body.start_date)) {
        throw new Error('end_date must be after start_date.');
      }
      return true;
    }),
  handle,
];

const validateStatusUpdate = [
  body('loan_status')
    .isIn(VALID_STATUSES)
    .withMessage(`loan_status must be one of: ${VALID_STATUSES.join(', ')}.`),
  handle,
];

module.exports = { validateCreateLoan, validateStatusUpdate };