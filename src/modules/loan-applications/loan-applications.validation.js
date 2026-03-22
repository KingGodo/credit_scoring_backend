const { body, validationResult } = require('express-validator');

const handle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

const VALID_STATUSES = ['pending', 'under_review', 'approved', 'rejected'];

const validateCreateApplication = [
  body('borrower_id')
    .isUUID().withMessage('Valid borrower_id (UUID) is required.'),
  body('product_id')
    .isUUID().withMessage('Valid product_id (UUID) is required.'),
  body('requested_amount')
    .isNumeric().withMessage('requested_amount must be a number.')
    .custom((val) => val > 0).withMessage('requested_amount must be greater than 0.'),
  body('requested_term')
    .isInt({ min: 1 }).withMessage('requested_term must be a positive integer (months).'),
  handle,
];

const validateStatusUpdate = [
  body('application_status')
    .isIn(VALID_STATUSES)
    .withMessage(`application_status must be one of: ${VALID_STATUSES.join(', ')}.`),
  handle,
];

module.exports = { validateCreateApplication, validateStatusUpdate };